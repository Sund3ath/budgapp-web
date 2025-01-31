import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { LoanForm } from './LoanForm';
import { LoanCard } from './LoanCard';
import { LoanDetails } from './LoanDetails';
import { calculateAmortizationSchedule, formatCurrency } from '../../utils/calculations';
import { generateLoansOverviewPDF } from '../../utils/pdfExport';
import { useLoans } from '../../hooks/useLoans';
import { Download } from 'lucide-react';

export const Loans: React.FC = () => {
  const { loans, loading, error, addLoan, updateLoan, getLatestMileage } = useLoans();
  const { t } = useTranslation();
  const [selectedLoan, setSelectedLoan] = useState<string | null>(null);
  const [editingLoan, setEditingLoan] = useState<string | null>(null);
  const [currentMileages, setCurrentMileages] = useState<Record<string, number>>({});

  useEffect(() => {
    async function fetchMileages() {
      const mileages: Record<string, number> = {};
      try {
        for (const loan of loans) {
          if (loan.type === 'lease' && loan.mileage_limit) {
            const mileage = await getLatestMileage(loan.id);
            if (mileage !== null) {
              mileages[loan.id] = mileage;
            }
          }
        }
        setCurrentMileages(mileages);
      } catch (err) {
        console.error('Error fetching mileages:', err);
      }
    }
    fetchMileages();
  }, [loans]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500 dark:text-gray-400">{t('loading')}</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 p-4 rounded-lg">
        {error}
      </div>
    );
  };

  const calculateLoanProgress = (loan: typeof loans[0]) => {
    const currentDate = new Date();
    const startDate = new Date(loan.start_date);
    const endDate = new Date(startDate);
    endDate.setMonth(startDate.getMonth() + loan.term_months);
    
    // Calculate elapsed months
    const elapsedMonths = (currentDate.getFullYear() - startDate.getFullYear()) * 12 + 
      (currentDate.getMonth() - startDate.getMonth());
    
    // Calculate progress percentage
    const progress = Math.min(Math.max((elapsedMonths / loan.term_months) * 100, 0), 100);
    
    // Calculate remaining balance based on elapsed time
    const monthlyRate = loan.interest_rate / 12 / 100;
    const monthlyPayment = loan.regular_payment;
    let remainingBalance = loan.principal;
    
    for (let i = 0; i < elapsedMonths && i < loan.term_months; i++) {
      const interest = remainingBalance * monthlyRate;
      const principal = monthlyPayment - interest;
      remainingBalance = Math.max(remainingBalance - principal, 0);
    }

    return {
      progress,
      remainingBalance,
    };
  };

  const handleEditLoan = async (id: string, loanData: any) => {
    try {
      await updateLoan(id, loanData);
      setEditingLoan(null);
    } catch (error) {
      console.error('Error updating loan:', error);
    }
  };

  if (selectedLoan) {
    const loan = loans.find((l) => l.id === selectedLoan);
    if (!loan) return null;
    
    // Transform loan data to match component interface
    const transformedLoan = {
      ...loan,
      interestRate: loan.interest_rate,
      termMonths: loan.term_months,
      startDate: loan.start_date,
      regularPayment: loan.regular_payment,
      paymentFrequency: loan.payment_frequency,
      residualValue: loan.residual_value,
      mileageLimit: loan.mileage_limit,
      currentMileage: currentMileages[loan.id],
    };
    
    if (editingLoan === loan.id) {
      return (
        <LoanForm
          loan={transformedLoan}
          onSubmit={(data) => handleEditLoan(loan.id, data)}
          onCancel={() => setEditingLoan(null)}
        />
      );
    }
    return <LoanDetails loan={transformedLoan} onBack={() => setSelectedLoan(null)} onEdit={() => setEditingLoan(loan.id)} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 sm:justify-between sm:items-center">
        <LoanForm onSubmit={addLoan} />
        {loans.length > 0 && (
          <button
            onClick={() => {
              const progressData = loans.reduce((acc, loan) => {
                acc[loan.name] = calculateLoanProgress(loan);
                return acc;
              }, {});
              const doc = generateLoansOverviewPDF(loans, progressData);
              doc.save(t('loan_overview'));
            }}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
          >
            <Download className="w-4 h-4" />
            {t('export_loans')}
          </button>
        )}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {loans.map((loan) => {
          const { progress, remainingBalance } = calculateLoanProgress(loan);
          return (
            <LoanCard
              key={loan.id}
              loan={loan}
              progress={progress}
              remainingBalance={remainingBalance}
              currentMileage={currentMileages[loan.id]}
              onClick={() => setSelectedLoan(loan.id)}
            />
          );
        })}
      </div>
    </div>
  );
};