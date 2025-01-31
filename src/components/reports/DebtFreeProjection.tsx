import React from 'react';
import { Clock, TrendingDown, ArrowRight, TrendingUp } from 'lucide-react';
import { formatCurrency } from '../../utils/calculations';

interface DebtFreeProjectionProps {
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

interface ProjectionPoint {
  date: Date;
  totalDebt: number;
  netIncome: number;
  debtByLoan: { [key: string]: number };
}

export const DebtFreeProjection: React.FC<DebtFreeProjectionProps> = ({ loans, monthlyNetIncome }) => {
  // Calculate monthly projection points for the next 30 years
  const calculateProjection = (): ProjectionPoint[] => {
    const projection: ProjectionPoint[] = [];
    const today = new Date();
    const endDate = new Date(today);
    endDate.setFullYear(today.getFullYear() + 30);

    // Initialize starting point
    let currentDate = new Date(today);
    let totalDebt = 0;
    let netIncome = monthlyNetIncome;
    const debtByLoan: { [key: string]: number } = {};

    // Calculate initial balances
    loans.forEach(loan => {
      const startDate = new Date(loan.start_date);
      const monthlyRate = loan.interest_rate / 12 / 100;
      const monthlyPayment = loan.payment_frequency === 'monthly'
        ? loan.regular_payment
        : (loan.regular_payment * 26 / 12);
      
      // Skip if loan hasn't started yet
      if (startDate > today) return;

      // Calculate current balance
      const monthsPassed = (today.getFullYear() - startDate.getFullYear()) * 12 +
        (today.getMonth() - startDate.getMonth());
      
      let balance = loan.principal;
      for (let i = 0; i < monthsPassed && i < loan.term_months; i++) {
        const interest = balance * monthlyRate;
        const principal = monthlyPayment - interest;
        balance = Math.max(0, balance - principal);
      }

      if (balance > 0) {
        debtByLoan[loan.name] = balance;
        totalDebt += balance;
      }
    });

    // Add initial point
    projection.push({
      date: new Date(currentDate),
      totalDebt,
      netIncome,
      debtByLoan: { ...debtByLoan },
    });

    // Calculate future points
    while (currentDate < endDate && totalDebt > 0) {
      currentDate.setMonth(currentDate.getMonth() + 1);
      
      // Assume 2% annual increase in net income
      
      if (currentDate.getMonth() === 0) {
        netIncome *= 1.02; // 2% annual increase
      }

      let monthlyFreedPayments = 0;

      // Update each loan's balance
      Object.keys(debtByLoan).forEach(loanName => {
        const loan = loans.find(l => l.name === loanName);
        if (!loan) return;

        const monthlyRate = loan.interest_rate / 12 / 100;
        const monthlyPayment = loan.payment_frequency === 'monthly'
          ? loan.regular_payment
          : (loan.regular_payment * 26 / 12);

        const currentBalance = debtByLoan[loanName];
        const previousBalance = currentBalance;
        
        if (currentBalance > 0) {
          const interest = currentBalance * monthlyRate;
          const principal = monthlyPayment - interest;
          debtByLoan[loanName] = Math.max(0, currentBalance - principal);
          
          if (previousBalance > 0 && debtByLoan[loanName] === 0) {
            monthlyFreedPayments += monthlyPayment;
            netIncome += monthlyPayment; // Permanently increase net income
          }
        }
      });

      // Calculate new total
      totalDebt = Object.values(debtByLoan).reduce((sum, balance) => sum + balance, 0);

      // Add point to projection
      projection.push({
        date: new Date(currentDate),
        totalDebt,
        netIncome,
        debtByLoan: { ...debtByLoan },
      });
    }

    return projection;
  };

  const projection = calculateProjection();
  const debtFreeDate = projection.find(point => point.totalDebt === 0)?.date;
  const yearsToDebtFree = debtFreeDate
    ? Math.round((debtFreeDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24 * 365.25) * 10) / 10
    : null;

  const maxDebt = Math.max(...projection.map(p => p.totalDebt));
  const maxNetIncome = Math.max(...projection.map(p => p.netIncome));
  const maxValue = Math.max(maxDebt, maxNetIncome);

  return (
    <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-soft p-8">
      <header className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary-50 dark:bg-primary-900/10">
            <Clock className="w-6 h-6 text-primary-500" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Weg zur Schuldenfreiheit
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Prognose basierend auf aktuellen Zahlungen
            </p>
          </div>
        </div>
      </header>

      {yearsToDebtFree !== null ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="p-4 bg-emerald-50 dark:bg-emerald-900/10 rounded-lg">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-800/50">
                <TrendingDown className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <span className="text-lg font-semibold text-emerald-700 dark:text-emerald-300">
                {yearsToDebtFree} Jahre
              </span>
            </div>
            <p className="text-sm text-emerald-600 dark:text-emerald-400">
              bis zur Schuldenfreiheit
            </p>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700">
                <ArrowRight className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </div>
              <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {debtFreeDate?.toLocaleDateString()}
              </span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Voraussichtliches Datum
            </p>
          </div>
        </div>
      ) : (
        <div className="p-4 bg-amber-50 dark:bg-amber-900/10 rounded-lg mb-8">
          <p className="text-sm text-amber-600 dark:text-amber-400">
          Basierend auf den aktuellen Zahlungen wird die Schuldenfreiheit in mehr als 30 Jahren erreicht.
          </p>
        </div>
      )}

      <div className="relative h-72">
        <div className="absolute inset-0 px-20">
          {[100, 75, 50, 25, 0].map((percent) => (
            <div
              key={percent}
              className="absolute w-full h-px bg-gray-100 dark:bg-gray-800 -translate-x-20"
              style={{ bottom: `${percent}%` }}
            >
              <span className="absolute -left-20 transform -translate-x-full px-2 text-xs font-medium text-gray-500 dark:text-gray-400">
                {formatCurrency(maxDebt * (percent / 100))}
              </span>
            </div>
          ))}

          <div className="absolute inset-0 flex items-end">
            {projection.map((point, index) => {
              const prevPoint = projection[index - 1];
              if (!prevPoint) return null;

              return (
                <React.Fragment key={point.date.toISOString()}>
                  <svg
                    className="h-full flex-1"
                    viewBox="0 0 100 100"
                    preserveAspectRatio="none"
                  >
                    {/* Debt Line */}
                    <path
                      d={`
                        M 0 ${100 - (prevPoint.totalDebt / maxDebt) * 100}
                        L 100 ${100 - (point.totalDebt / maxDebt) * 100}
                      `}
                      className="stroke-rose-500 stroke-[3] fill-none"
                    />
                  </svg>
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </div>
      
      <div className="flex justify-center gap-6 mt-4 mb-2">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-rose-500 rounded-full"></div>
          <span className="text-sm text-gray-600 dark:text-gray-400">Schulden</span>
        </div>
      </div>
      
      {/* Net Income Chart */}
      <div className="relative h-48 mt-12">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
          Einkommensentwicklung
        </h4>
        <div className="absolute inset-0 px-20">
          {[100, 75, 50, 25, 0].map((percent) => (
            <div
              key={percent}
              className="absolute w-full h-px bg-gray-100 dark:bg-gray-800 -translate-x-20"
              style={{ bottom: `${percent}%` }}
            >
              <span className="absolute -left-20 transform -translate-x-full px-2 text-xs font-medium text-gray-500 dark:text-gray-400">
                {formatCurrency(maxNetIncome * (percent / 100))}
              </span>
            </div>
          ))}

          <div className="absolute inset-0 flex items-end">
            {projection.map((point, index) => {
              const prevPoint = projection[index - 1];
              if (!prevPoint) return null;

              return (
                <React.Fragment key={point.date.toISOString()}>
                  <svg
                    className="h-full flex-1"
                    viewBox="0 0 100 100"
                    preserveAspectRatio="none"
                  >
                    <path
                      d={`
                        M 0 ${100 - (prevPoint.netIncome / maxNetIncome) * 100}
                        L 100 ${100 - (point.netIncome / maxNetIncome) * 100}
                      `}
                      className="stroke-emerald-500 stroke-[3] fill-none"
                    />
                  </svg>
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </div>

      <div className="flex justify-center gap-6 mt-4 mb-2">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
          <span className="text-sm text-gray-600 dark:text-gray-400">Nettoeinkommen</span>
        </div>
      </div>

      <div className="grid grid-cols-6 gap-2 mt-6 px-8">
        {projection
          .filter((_, index) => index % Math.ceil(projection.length / 6) === 0)
          .map((point) => (
            <div
              key={point.date.toISOString()}
              className="text-center text-xs font-medium text-gray-600 dark:text-gray-300"
            >
              {point.date.toLocaleDateString(undefined, { year: 'numeric' })}
            </div>
          ))}
      </div>
    </div>
  );
};