import React from 'react';
import { formatCurrency } from '../../utils/calculations';
import { TrendingDown, ArrowUpRight, ArrowDownRight, Calendar } from 'lucide-react';

interface DebtBreakdownProps {
  loans: Array<{
    name: string;
    principal: number;
    interest_rate: number;
    term_months: number;
    start_date: string;
    regular_payment: number;
    payment_frequency: 'monthly' | 'biweekly';
  }>;
  monthlyNetIncome: number;
}

export const DebtBreakdown: React.FC<DebtBreakdownProps> = ({ loans, monthlyNetIncome }) => {
  // Calculate total monthly payments
  const totalMonthlyPayments = loans.reduce((total, loan) => {
    const payment = loan.payment_frequency === 'monthly'
      ? loan.regular_payment
      : (loan.regular_payment * 26 / 12);
    return total + payment;
  }, 0);

  // Calculate total remaining principal
  const totalPrincipal = loans.reduce((total, loan) => total + loan.principal, 0);

  // Calculate debt-to-income ratio
  const debtToIncomeRatio = (totalMonthlyPayments / monthlyNetIncome) * 100;

  // Calculate average interest rate
  const averageInterestRate = loans.reduce((sum, loan) => 
    sum + (loan.interest_rate * (loan.principal / totalPrincipal)), 0);

  // Find loan with earliest and latest end dates
  const loanEndDates = loans.map(loan => {
    const startDate = new Date(loan.start_date);
    const endDate = new Date(startDate);
    endDate.setMonth(startDate.getMonth() + loan.term_months);
    return { name: loan.name, endDate };
  });

  const earliestEnd = loanEndDates.reduce((earliest, current) => 
    current.endDate < earliest.endDate ? current : earliest);
  
  const latestEnd = loanEndDates.reduce((latest, current) => 
    current.endDate > latest.endDate ? current : latest);

  return (
    <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-soft p-6 mt-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6">
        Detaillierte Schuldenanalyse
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-primary-50 dark:bg-primary-900/10">
              <TrendingDown className="w-5 h-5 text-primary-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Schuldenquote
              </p>
              <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {Math.round(debtToIncomeRatio)}%
              </p>
            </div>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Anteil des Einkommens für Kreditzahlungen
          </p>
        </div>

        <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-900/10">
              <ArrowUpRight className="w-5 h-5 text-emerald-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Monatliche Rate
              </p>
              <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {formatCurrency(totalMonthlyPayments)}
              </p>
            </div>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Gesamte monatliche Kreditraten
          </p>
        </div>

        <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-rose-50 dark:bg-rose-900/10">
              <ArrowDownRight className="w-5 h-5 text-rose-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Ø Zinssatz
              </p>
              <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {averageInterestRate.toFixed(2)}%
              </p>
            </div>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Gewichteter Durchschnitt aller Kredite
          </p>
        </div>

        <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-900/10">
              <Calendar className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Zeitspanne
              </p>
              <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {Math.ceil((latestEnd.endDate.getTime() - new Date().getTime()) / 
                  (1000 * 60 * 60 * 24 * 365.25))} Jahre
              </p>
            </div>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Bis zur vollständigen Tilgung
          </p>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
            Meilensteine
          </h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  Erster Kredit abbezahlt
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {earliestEnd.name}
                </p>
              </div>
              <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                {earliestEnd.endDate.toLocaleDateString()}
              </p>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  Letzter Kredit abbezahlt
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {latestEnd.name}
                </p>
              </div>
              <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                {latestEnd.endDate.toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
            Kredite nach Größe
          </h4>
          <div className="space-y-3">
            {[...loans]
              .sort((a, b) => b.principal - a.principal)
              .map(loan => {
                const monthlyPayment = loan.payment_frequency === 'monthly'
                  ? loan.regular_payment
                  : (loan.regular_payment * 26 / 12);
                
                return (
                  <div key={loan.name} className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {loan.name}
                      </p>
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {formatCurrency(loan.principal)}
                      </p>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                      <span>Rate: {formatCurrency(monthlyPayment)}/Monat</span>
                      <span>{loan.interest_rate}% APR</span>
                    </div>
                    <div className="mt-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1">
                      <div
                        className="bg-primary-500 h-1 rounded-full"
                        style={{ width: `${(loan.principal / totalPrincipal) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
};