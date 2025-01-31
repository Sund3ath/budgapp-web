import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus } from 'lucide-react';
import { calculatePrincipalFromPayment, formatCurrency } from '../../utils/calculations';

interface LoanFormProps {
  loan?: {
    name: string;
    type: 'loan' | 'lease';
    principal: number;
    interestRate: number;
    termMonths: number;
    startDate: string;
    regularPayment: number;
    paymentFrequency: 'monthly' | 'biweekly';
    residualValue?: number;
    mileageLimit?: number;
    currentMileage?: number;
  };
  onSubmit: (loan: {
    name: string;
    type: 'loan' | 'lease';
    principal: number;
    interestRate: number;
    termMonths: number;
    startDate: string;
    regularPayment: number;
    paymentFrequency: 'monthly' | 'biweekly';
    residualValue?: number;
    mileageLimit?: number;
    currentMileage?: number;
  }) => void;
  onCancel?: () => void;
}

export const LoanForm: React.FC<LoanFormProps> = ({ loan, onSubmit, onCancel }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const [type, setType] = useState<'loan' | 'lease'>('loan');
  const [monthlyPayment, setMonthlyPayment] = useState('');
  const [interestRate, setInterestRate] = useState('');
  const [termMonths, setTermMonths] = useState('');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [paymentFrequency, setPaymentFrequency] = useState<'monthly' | 'biweekly'>('monthly');
  const [residualValue, setResidualValue] = useState('');
  const [mileageLimit, setMileageLimit] = useState('');
  const [currentMileage, setCurrentMileage] = useState('');

  useEffect(() => {
    if (loan) {
      setName(loan.name);
      setType(loan.type);
      setMonthlyPayment(loan.regularPayment.toString());
      setInterestRate(loan.interestRate.toString());
      setTermMonths(loan.termMonths.toString());
      setStartDate(loan.startDate);
      setPaymentFrequency(loan.paymentFrequency);
      setResidualValue(loan.residualValue?.toString() || '');
      setMileageLimit(loan.mileageLimit?.toString() || '');
      setCurrentMileage(loan.currentMileage?.toString() || '');
    }
  }, [loan]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const rate = parseFloat(interestRate);
    const term = parseInt(termMonths);
    const payment = parseFloat(monthlyPayment);
    
    if (isNaN(rate) || isNaN(term) || isNaN(payment)) {
      alert(t('invalid_numbers'));
      return;
    }
    
    let principal;
    try {
      principal = calculatePrincipalFromPayment(payment, rate, term);
    } catch (error) {
      alert(t('invalid_parameters') + (error instanceof Error ? error.message : t('invalid_numbers')));
      return;
    }

    onSubmit({
      name,
      type,
      principal,
      interestRate: rate,
      termMonths: term,
      startDate: startDate,
      regularPayment: payment,
      paymentFrequency: paymentFrequency,
      ...(type === 'lease' && {
        residualValue: residualValue ? parseFloat(residualValue) : null,
        mileageLimit: mileageLimit ? parseInt(mileageLimit) : null,
        currentMileage: currentMileage ? parseInt(currentMileage) : null,
      }),
    });
    
    setIsOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setName('');
    setType('loan');
    setMonthlyPayment('');
    setInterestRate('');
    setTermMonths('');
    setStartDate(new Date().toISOString().split('T')[0]);
    setPaymentFrequency('monthly');
    setResidualValue('');
    setMileageLimit('');
    setCurrentMileage('');
  };

  return (
    <div className="mb-6">
      {!isOpen && !loan ? (
        <button
          onClick={() => setIsOpen(true)}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
        >
          <Plus className="w-5 h-5" />
          {t('add_loan')}
        </button>
      ) : loan || isOpen ? (
        <form onSubmit={handleSubmit} className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-soft p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('loan_name')}
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder={t('loan_example')}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('type')}
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      className="w-4 h-4 text-primary-500"
                      checked={type === 'loan'}
                      onChange={() => setType('loan')}
                    />
                    <span className="ml-2 text-sm text-gray-900 dark:text-gray-100">{t('loan')}</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      className="w-4 h-4 text-primary-500"
                      checked={type === 'lease'}
                      onChange={() => setType('lease')}
                    />
                    <span className="ml-2 text-sm text-gray-900 dark:text-gray-100">{t('lease')}</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('monthly_payment')}
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    value={monthlyPayment}
                    onChange={(e) => setMonthlyPayment(e.target.value)}
                    className="w-full pl-8 pr-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('interest_rate')}
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="100"
                    required
                    value={interestRate}
                    onChange={(e) => setInterestRate(e.target.value)}
                    className="w-full pr-8 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="5.99"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">%</span>
                </div>
              </div>
            </div>

            <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('loan_details')}
              </h4>
              <div className="space-y-2">
                {monthlyPayment && interestRate && termMonths &&
                  parseFloat(monthlyPayment) > 0 &&
                  parseFloat(interestRate) > 0 &&
                  parseInt(termMonths) > 0 && (
                  <>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {t('loan_amount')}
                      </span>
                      {(() => {
                        try {
                          const principal = calculatePrincipalFromPayment(
                            parseFloat(monthlyPayment),
                            parseFloat(interestRate),
                            parseInt(termMonths)
                          );
                          return (
                            <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                              {formatCurrency(principal)}
                            </span>
                          );
                        } catch (error) {
                          return (
                            <span className="text-sm text-rose-500 dark:text-rose-400">
                              {t('invalid_values')}
                            </span>
                          );
                        }
                      })()}
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {t('total_cost')}
                      </span>
                      <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {formatCurrency(parseFloat(monthlyPayment) * parseInt(termMonths))}
                      </span>
                    </div>
                  </>
                )}
                {(!monthlyPayment || !interestRate || !termMonths ||
                  parseFloat(monthlyPayment) <= 0 ||
                  parseFloat(interestRate) <= 0 ||
                  parseInt(termMonths) <= 0) && (
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {t('enter_details')}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('term_months')}
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  value={termMonths}
                  onChange={(e) => setTermMonths(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder={t('term_example')}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('start_date')}
                </label>
                <input
                  type="date"
                  required
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('payment_interval')}
                </label>
                <select
                  value={paymentFrequency}
                  onChange={(e) => setPaymentFrequency(e.target.value as 'monthly' | 'biweekly')}
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="monthly">{t('monthly')}</option>
                  <option value="biweekly">{t('biweekly')}</option>
                </select>
              </div>

              {type === 'lease' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {t('residual_value')}
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={residualValue}
                        onChange={(e) => setResidualValue(e.target.value)}
                        className="w-full pl-8 pr-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="0.00"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {t('mileage_limit')}
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={mileageLimit}
                      onChange={(e) => setMileageLimit(e.target.value)}
                      className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder={t('mileage_example')}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {t('current_mileage')}
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={currentMileage}
                      onChange={(e) => setCurrentMileage(e.target.value)}
                      className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder={t('current_mileage_example')}
                    />
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-4 mt-6">
            <button
              type="button"
              onClick={() => {
                if (onCancel) {
                  onCancel();
                } else {
                  setIsOpen(false);
                  resetForm();
                }
              }}
              className="px-4 py-2 text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              {t('cancel')}
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
            >
              {loan ? t('save_changes') : t('save_loan')}
            </button>
          </div>
        </form>
      ) : null}
    </div>
  );
};