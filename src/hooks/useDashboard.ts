import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { Database } from '../types/supabase';

type Transaction = Database['public']['Tables']['transactions']['Row'];
type SavingsGoal = Database['public']['Tables']['savings_goals']['Row'];
type Loan = Database['public']['Tables']['loans']['Row'];

export function useDashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [savingsGoals, setSavingsGoals] = useState<SavingsGoal[]>([]);
  const [loans, setLoans] = useState<Loan[]>([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  async function fetchDashboardData() {
    try {
      setLoading(true);
      
      // Fetch recent transactions
      const { data: transactionsData, error: transactionsError } = await supabase
        .from('transactions')
        .select('*')
        .order('date', { ascending: false })
        .limit(5);

      if (transactionsError) throw transactionsError;

      // Fetch active loans
      const { data: loansData, error: loansError } = await supabase
        .from('loans')
        .select('*')
        .order('created_at', { ascending: false });

      if (loansError) throw loansError;

      // Fetch savings goals
      const { data: goalsData, error: goalsError } = await supabase
        .from('savings_goals')
        .select('*')
        .order('created_at', { ascending: false });

      if (goalsError) throw goalsError;

      setTransactions(transactionsData || []);
      setLoans(loansData || []);
      setSavingsGoals(goalsData || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ein Fehler ist aufgetreten');
    } finally {
      setLoading(false);
    }
  }

  async function addSavingsGoal(goal: {
    name: string;
    targetAmount: number;
    deadline?: string;
  }) {
    try {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;

      const { data, error } = await supabase
        .from('savings_goals')
        .insert([{
          user_id: userData.user.id,
          name: goal.name,
          target_amount: goal.targetAmount,
          current_amount: 0,
          deadline: goal.deadline,
        }])
        .select()
        .single();

      if (error) throw error;
      setSavingsGoals(prev => [data, ...prev]);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ein Fehler ist aufgetreten');
      throw err;
    }
  }

  async function updateSavingsGoal(id: string, amount: number) {
    try {
      const { data, error } = await supabase
        .from('savings_goals')
        .update({ current_amount: amount })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      setSavingsGoals(prev => prev.map(goal => 
        goal.id === id ? data : goal
      ));
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ein Fehler ist aufgetreten');
      throw err;
    }
  }

  function calculateMetrics() {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const today = new Date();

    const monthlyTransactions = transactions.filter(t => {
      const date = new Date(t.date);
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
    });

    const monthlyIncome = monthlyTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const monthlyRegularExpenses = monthlyTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    
    // Calculate total monthly loan payments
    const monthlyLoanPayments = loans.reduce((sum, loan) => {
      const startDate = new Date(loan.start_date);
      const endDate = new Date(startDate);
      endDate.setMonth(startDate.getMonth() + loan.term_months);
      
      // Only include active loans
      if (today < startDate || today > endDate) {
        return sum;
      }

      if (loan.payment_frequency === 'monthly') {
        return sum + loan.regular_payment;
      } else if (loan.payment_frequency === 'biweekly') {
        // Convert biweekly payments to monthly (26 payments per year / 12 months)
        return sum + (loan.regular_payment * 26 / 12);
      }
      return sum;
    }, 0);

    const totalMonthlyExpenses = monthlyRegularExpenses + monthlyLoanPayments;

    const savingsRate = monthlyIncome > 0 
      ? Math.round(((monthlyIncome - totalMonthlyExpenses) / monthlyIncome) * 100 * 10) / 10
      : 0;

    return {
      totalBalance: monthlyIncome - totalMonthlyExpenses,
      monthlyIncome,
      monthlyExpenses: totalMonthlyExpenses,
      monthlyLoanPayments,
      monthlyRegularExpenses,
      savingsRate,
    };
  }

  return {
    loading,
    error,
    transactions,
    savingsGoals,
    loans,
    metrics: calculateMetrics(),
    addSavingsGoal,
    updateSavingsGoal,
  };
}