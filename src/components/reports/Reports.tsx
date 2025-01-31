import React, { useState, useMemo } from 'react';
import { ReportCard } from './ReportCard';
import { ReportFilter } from './ReportFilter';
import { SpendingByCategory } from './SpendingByCategory';
import { MonthlyOverview } from './MonthlyOverview';
import { DebtBreakdown } from './DebtBreakdown';
import { DebtFreeProjection } from './DebtFreeProjection';
import { TrendAnalysis } from './TrendAnalysis';
import { formatCurrency } from '../../utils/calculations';
import { useReports } from '../../hooks/useReports';
import {
  TrendingUp,
  TrendingDown,
  PiggyBank,
  CreditCard,
} from 'lucide-react';

const calculateMetrics = (transactions: any[]) => {
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const savingsRate = totalIncome > 0 
    ? ((totalIncome - totalExpenses) / totalIncome) * 100 
    : 0;

  return {
    totalIncome,
    totalExpenses,
    netIncome: totalIncome - totalExpenses,
    savingsRate,
  };
};

export const Reports: React.FC = () => {
  const [dateRange, setDateRange] = useState<'week' | 'month' | 'year'>('month');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const { transactions, loans, loading, error, calculateMetrics } = useReports();

  const filteredTransactions = useMemo(() => {
    if (!transactions) return [];

    const now = new Date();
    const filtered = transactions.filter(transaction => {
      const transactionDate = new Date(transaction.date);
      
      if (dateRange === 'week') {
        const weekAgo = new Date(now);
        weekAgo.setDate(now.getDate() - 7);
        return transactionDate >= weekAgo;
      }
      
      if (dateRange === 'month') {
        const monthAgo = new Date(now);
        monthAgo.setMonth(now.getMonth() - 1);
        return transactionDate >= monthAgo;
      }
      
      if (dateRange === 'year') {
        const yearAgo = new Date(now);
        yearAgo.setFullYear(now.getFullYear() - 1);
        return transactionDate >= yearAgo;
      }
      
      return true;
    });

    if (selectedCategories.length > 0) {
      return filtered.filter(t => selectedCategories.includes(t.category));
    }

    return filtered;
  }, [transactions, dateRange, selectedCategories]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500 dark:text-gray-400">Lädt...</div>
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

  const metrics = calculateMetrics(filteredTransactions);

  const summaryCards = [
    {
      title: 'Gesamteinnahmen',
      value: formatCurrency(metrics.totalIncome),
      trend: { value: Math.round(metrics.totalIncome / metrics.totalExpenses * 100) / 100, isPositive: true },
      icon: TrendingUp,
      color: 'success',
    },
    {
      title: 'Gesamtausgaben',
      value: formatCurrency(metrics.totalExpenses + metrics.totalLoanPayments),
      trend: { value: Math.round(metrics.totalExpenses / metrics.totalIncome * 100) / 100, isPositive: false },
      icon: TrendingDown,
      color: 'danger',
    },
    {
      title: 'Nettoeinkommen',
      value: formatCurrency(metrics.netIncome),
      trend: { value: Math.round(Math.abs(metrics.netIncome / metrics.totalIncome * 100)) / 100, isPositive: metrics.netIncome > 0 },
      icon: PiggyBank,
      color: 'primary',
    },
    {
      title: 'Sparquote',
      value: `${Math.round(metrics.savingsRate * 10) / 10}%`,
      trend: { value: Math.round(metrics.savingsRate * 10) / 10, isPositive: metrics.savingsRate > 0 },
      icon: CreditCard,
      color: 'warning',
    },
  ];

  return (
    <div className="space-y-6">
      <ReportFilter
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
        selectedCategories={selectedCategories}
        onCategoryChange={setSelectedCategories}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {summaryCards.map((card) => (
          <ReportCard key={card.title} {...card} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SpendingByCategory transactions={filteredTransactions} />
        <MonthlyOverview transactions={filteredTransactions} />
      </div>

      {loans.length > 0 && <DebtFreeProjection loans={loans} monthlyNetIncome={metrics.netIncome} />}
      {loans.length > 0 && <DebtBreakdown loans={loans} monthlyNetIncome={metrics.netIncome} />}

      <TrendAnalysis transactions={filteredTransactions} dateRange={dateRange} />
    </div>
  );
};