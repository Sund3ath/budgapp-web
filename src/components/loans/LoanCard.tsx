import React from 'react';
import { useTranslation } from 'react-i18next';
import { CreditCard } from 'lucide-react';
import { formatCurrency } from '../../utils/calculations';

interface LoanCardProps {
  loan: {
    id: string;
    name: string;
    type: 'loan' | 'lease';
    principal: number;
    interestRate: number;
    termMonths: number;
    regularPayment: number;
    startDate: string;
    paymentFrequency: 'monthly' | 'biweekly',
    residualValue?: number;
    mileageLimit?: number;
    currentMileage?: number;
  };
  progress: number;
  remainingBalance: number;
  currentMileage?: number;
  onClick?: () => void;
}

export const LoanCard: React.FC<LoanCardProps> = ({
  loan,
  progress,
  remainingBalance,
  currentMileage,
  onClick,
}) => {
  const { t } = useTranslation();
  return (
    <div
      onClick={onClick}
      className={`p-6 bg-surface-light dark:bg-surface-dark rounded-xl shadow-soft ${
        onClick ? 'cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50' : ''
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary-50 dark:bg-primary-900/10">
            <CreditCard className="w-5 h-5 text-primary-500" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {loan.name}
              {loan.type === 'lease' && (
                <span className="ml-2 text-xs font-medium px-2 py-1 bg-primary-100 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 rounded-full">
                  {t('lease')}
                </span>
              )}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {loan.paymentFrequency === 'monthly' ? t('monthly_payments') : t('biweekly_payments')}
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
            {formatCurrency(loan.regularPayment)}/{loan.paymentFrequency === 'monthly' ? t('month') : t('weeks')}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {loan.interestRate}% APR
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-500 dark:text-gray-400">
            {t('monthly_payment')}
          </span>
          <span className="font-medium text-gray-900 dark:text-gray-100">
            {formatCurrency(loan.paymentFrequency === 'monthly'
              ? loan.regularPayment
              : loan.regularPayment * 26 / 12)} /{t('per_month')}
          </span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-gray-500 dark:text-gray-400">{t('progress')}</span>
          <span className="font-medium text-gray-900 dark:text-gray-100">
            {Math.round(progress)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div
            className="bg-primary-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500 dark:text-gray-400">
            {t('original_amount')}
          </span>
          <span className="font-medium text-gray-900 dark:text-gray-100">
            {formatCurrency(loan.principal)}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500 dark:text-gray-400">
            Restbetrag
          </span>
          <span className="font-medium text-gray-900 dark:text-gray-100">
            {formatCurrency(remainingBalance)}
          </span>
        </div>
        {loan.type === 'lease' && loan.mileageLimit && (
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-500 dark:text-gray-400">
                Kilometerstand
              </span>
              <span className="font-medium text-gray-900 dark:text-gray-100">
                {currentMileage?.toLocaleString() || '0'} / {loan.mileageLimit.toLocaleString()} km
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-300 ${
                  ((currentMileage || 0) / loan.mileageLimit) > 0.9
                    ? 'bg-rose-500'
                    : ((currentMileage || 0) / loan.mileageLimit) > 0.75
                    ? 'bg-amber-500'
                    : 'bg-emerald-500'
                }`}
                style={{ width: `${((currentMileage || 0) / loan.mileageLimit) * 100}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};