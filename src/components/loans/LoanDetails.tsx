import React from 'react';
import { ArrowLeft, Calendar, DollarSign, Percent, Clock, Edit, Download } from 'lucide-react';
import { generateLoanPDF } from '../../utils/pdfExport';
import { formatCurrency } from '../../utils/calculations';

interface LoanDetailsProps {
  loan: {
    id: string;
    name: string;
    type: 'loan' | 'lease';
    principal: number;
    interestRate: number;
    termMonths: number;
    regularPayment: number;
    startDate: string;
    paymentFrequency: 'monthly' | 'biweekly';
    residualValue?: number;
    mileageLimit?: number;
    currentMileage?: number;
  };
  onBack: () => void;
  onEdit: () => void;
}

export const LoanDetails: React.FC<LoanDetailsProps> = ({ loan, onBack, onEdit }) => {
  const stats = [
    {
      icon: DollarSign,
      label: 'Kreditsumme',
      value: formatCurrency(loan.principal),
    },
    {
      icon: Percent,
      label: 'Zinssatz',
      value: `${loan.interest_rate}% APR`,
    },
    {
      icon: Clock,
      label: 'Laufzeit',
      value: `${loan.term_months} Monate`,
    },
    {
      icon: Calendar,
      label: 'Startdatum',
      value: new Date(loan.start_date).toLocaleDateString(),
    },
  ];

  const handleExportPDF = () => {
    const { progress, remainingBalance } = calculateLoanProgress(loan);
    const doc = generateLoanPDF(loan, progress, remainingBalance);
    doc.save(`${loan.name.toLowerCase().replace(/\s+/g, '-')}-details.pdf`);
  };

  return (
    <div className="space-y-6">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
      >
        <ArrowLeft className="w-4 h-4" />
        Zurück zu Krediten
      </button>
      
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          {loan.name}
          {loan.type === 'lease' && (
            <span className="ml-2 text-sm font-medium px-2 py-1 bg-primary-100 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 rounded-full">
              Leasing
            </span>
          )}
        </h2>
        <div className="flex items-center gap-4">
          <button
            onClick={handleExportPDF}
            className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
          >
            <Download className="w-4 h-4" />
            Als PDF exportieren
          </button>
          <button
            onClick={onEdit}
            className="flex items-center gap-2 px-4 py-2 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300"
          >
            <Edit className="w-4 h-4" />
            Bearbeiten
          </button>
        </div>
      </div>

      <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-soft p-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
          {loan.name}
          {loan.type === 'lease' && (
            <span className="ml-2 text-sm font-medium px-2 py-1 bg-primary-100 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 rounded-full">
              Leasing
            </span>
          )}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map(({ icon: Icon, label, value }) => (
            <div
              key={label}
              className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-primary-50 dark:bg-primary-900/10">
                  <Icon className="w-5 h-5 text-primary-500" />
                </div>
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  {label}
                </span>
              </div>
              <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {value}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-8">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Zahlungsplan
          </h3>
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  {loan.paymentFrequency === 'monthly' ? 'Monatliche' : 'Zweiwöchentliche'} Rate
                </p>
                <p className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  {formatCurrency(loan.regularPayment)}
                  <span className="text-sm font-normal text-gray-500 dark:text-gray-400 ml-1">
                    pro {loan.paymentFrequency === 'monthly' ? 'Monat' : '2 Wochen'}
                  </span>
                </p>
                {loan.paymentFrequency === 'biweekly' && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    ≈ {formatCurrency(loan.regularPayment * 26 / 12)} pro Monat
                  </p>
                )}
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Zahlungsintervall
                </p>
                <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {loan.paymentFrequency === 'monthly' ? 'Monatlich' : 'Zweiwöchentlich'}
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {loan.type === 'lease' && (
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Leasing-Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {loan.residualValue && (
                <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                    Restwert
                  </p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    {formatCurrency(loan.residualValue)}
                  </p>
                </div>
              )}
              {loan.mileageLimit && loan.currentMileage && (
                <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Kilometerstand
                    </p>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {Math.round((loan.currentMileage / loan.mileageLimit) * 100)}%
                    </p>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${
                        (loan.currentMileage / loan.mileageLimit) > 0.9
                          ? 'bg-rose-500'
                          : (loan.currentMileage / loan.mileageLimit) > 0.75
                          ? 'bg-amber-500'
                          : 'bg-emerald-500'
                      }`}
                      style={{ width: `${(loan.currentMileage / loan.mileageLimit) * 100}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                    <span>Aktuell: {loan.currentMileage.toLocaleString()} km</span>
                    <span>Limit: {loan.mileageLimit.toLocaleString()} km</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};