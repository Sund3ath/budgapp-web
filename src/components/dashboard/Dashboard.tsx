import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DashboardCard } from './DashboardCard';
import { RecentActivity } from './RecentActivity';
import {
  Wallet,
  ArrowDownRight,
  ArrowUpRight,
  PiggyBank,
  Plus, 
  CreditCard,
} from 'lucide-react';
import { useDashboard } from '../../hooks/useDashboard';
import { formatCurrency } from '../../utils/calculations';

interface NewGoalFormData {
  name: string;
  targetAmount: string;
  deadline: string;
}

export const Dashboard: React.FC = () => {
  const { loading, error, transactions, savingsGoals, loans, metrics, addSavingsGoal } = useDashboard();
  const [showNewGoalForm, setShowNewGoalForm] = useState(false);
  const { t } = useTranslation();
  const [newGoal, setNewGoal] = useState<NewGoalFormData>({
    name: '',
    targetAmount: '',
    deadline: '',
  });

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
  }

  const handleAddGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addSavingsGoal({
        name: newGoal.name,
        targetAmount: parseFloat(newGoal.targetAmount),
        deadline: newGoal.deadline || undefined,
      });
      setShowNewGoalForm(false);
      setNewGoal({ name: '', targetAmount: '', deadline: '' });
    } catch (error) {
      console.error('Error adding savings goal:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard
          title={t('total_balance')}
          value={formatCurrency(metrics.totalBalance)}
          description={t('available_funds')}
          trend={{ value: Math.round(Math.abs(metrics.totalBalance / metrics.monthlyIncome * 100) * 10) / 10, isPositive: metrics.totalBalance > 0 }}
          icon={Wallet}
          color="primary"
        />
        <DashboardCard
          title={t('monthly_income')}
          value={formatCurrency(metrics.monthlyIncome)}
          description={t('this_month')}
          trend={{ value: Math.round(Math.abs(metrics.monthlyIncome / metrics.monthlyExpenses * 100) * 10) / 10, isPositive: true }}
          icon={ArrowUpRight}
          color="success"
        />
        <DashboardCard
          title={t('monthly_expenses')}
          value={formatCurrency(metrics.monthlyExpenses)}
          description={`${t('including')} ${formatCurrency(metrics.monthlyLoanPayments)} ${t('loans')}`}
          trend={{ value: Math.round(Math.abs(metrics.monthlyExpenses / metrics.monthlyIncome * 100) * 10) / 10, isPositive: false }}
          icon={ArrowDownRight}
          color="danger"
        />
        <DashboardCard
          title={t('savings_rate')}
          value={`${metrics.savingsRate.toFixed(1)}%`}
          description={t('this_month')}
          trend={{ value: metrics.savingsRate, isPositive: metrics.savingsRate > 0 }}
          icon={PiggyBank}
          color="warning"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentActivity activities={transactions} />
          
          {loans.length > 0 && (
            <div className="mt-6 bg-surface-light dark:bg-surface-dark rounded-xl shadow-soft p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                {t('active_loans')}
              </h3>
              <div className="space-y-4">
                {loans.map(loan => (
                  <div key={loan.id} className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-5 h-5 text-primary-500" />
                        <span className="font-medium text-gray-900 dark:text-gray-100">
                          {loan.name}
                          {loan.type === 'lease' && (
                            <span className="ml-2 text-xs font-medium px-2 py-1 bg-primary-100 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 rounded-full">
                              {t('leasing')}
                            </span>
                          )}
                        </span>
                      </div>
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        {formatCurrency(loan.regular_payment)}/{loan.payment_frequency === 'monthly' ? t('month') : t('weeks')}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                      <span>{t('remaining_amount')}: {formatCurrency(loan.principal)}</span>
                      <span>{loan.interest_rate}% APR</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-soft p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {t('savings_goals')}
            </h3>
            <button
              onClick={() => setShowNewGoalForm(true)}
              className="flex items-center gap-2 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300"
            >
              <Plus className="w-4 h-4" />
              {t('new_goal')}
            </button>
          </div>
          {showNewGoalForm ? (
            <form onSubmit={handleAddGoal} className="space-y-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('name')}
                </label>
                <input
                  type="text"
                  required
                  value={newGoal.name}
                  onChange={(e) => setNewGoal(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg"
                  placeholder={t('emergency_fund')}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('target_amount')}
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  value={newGoal.targetAmount}
                  onChange={(e) => setNewGoal(prev => ({ ...prev, targetAmount: e.target.value }))}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg"
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('target_date')}
                </label>
                <input
                  type="date"
                  value={newGoal.deadline}
                  onChange={(e) => setNewGoal(prev => ({ ...prev, deadline: e.target.value }))}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowNewGoalForm(false)}
                  className="px-3 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                >
                  {t('cancel')}
                </button>
                <button
                  type="submit"
                  className="px-3 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
                >
                  {t('create_savings_goal')}
                </button>
              </div>
            </form>
          ) : null}
          <div className="space-y-4">
            {savingsGoals.map(goal => (
              <div key={goal.id} className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <PiggyBank className="w-5 h-5 text-primary-500" />
                    <span className="font-medium text-gray-900 dark:text-gray-100">
                      {goal.name}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    {formatCurrency(goal.target_amount)}
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-primary-500 h-2 rounded-full"
                    style={{ width: `${(goal.current_amount / goal.target_amount) * 100}%` }}
                  ></div>
                </div>
                <div className="flex justify-between mt-2 text-xs text-gray-500 dark:text-gray-400">
                  <span>{t('saved')}: {formatCurrency(goal.current_amount)}</span>
                  <span>{Math.round((goal.current_amount / goal.target_amount) * 100)}%</span>
                </div>
                {goal.deadline && (
                  <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                    {t('target_date_label')}: {new Date(goal.deadline).toLocaleDateString()}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};