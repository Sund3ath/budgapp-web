import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { Database } from '../types/supabase';

type Transaction = Database['public']['Tables']['transactions']['Row'];
type Loan = Database['public']['Tables']['loans']['Row'];

export function useReports() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loans, setLoans] = useState<Loan[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      setLoading(true);
      
      // Fetch all transactions
      const { data: transactionsData, error: transactionsError } = await supabase
        .from('transactions')
        .select('*')
        .order('date', { ascending: false });

      if (transactionsError) throw transactionsError;

      // Fetch all loans
      const { data: loansData, error: loansError } = await supabase
        .from('loans')
        .select('*')
        .order('created_at', { ascending: false });

      if (loansError) throw loansError;

      setTransactions(transactionsData || []);
      setLoans(loansData || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ein Fehler ist aufgetreten');
    } finally {
      setLoading(false);
    }
  }

  function calculateMetrics(filteredTransactions: Transaction[]) {
    const today = new Date();
    
    // Calculate transaction totals
    const totalIncome = filteredTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpenses = filteredTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    
    // Calculate active loan payments
    const totalLoanPayments = loans.reduce((sum, loan) => {
      const startDate = new Date(loan.start_date);
      const endDate = new Date(startDate);
      endDate.setMonth(startDate.getMonth() + loan.term_months);
      
      // Only include active loans
      if (today < startDate || today > endDate) {
        return sum;
      }

      // Calculate total loan payments for the period
      const monthlyPayment = loan.payment_frequency === 'monthly'
        ? loan.regular_payment
        : (loan.regular_payment * 26 / 12); // Convert biweekly to monthly

      return sum + monthlyPayment;
    }, 0);

    // Only include actual expenses and loan payments, not income
    const totalExpensesWithLoans = totalExpenses;
    const netIncome = totalIncome - (totalExpenses + totalLoanPayments);
    const savingsRate = totalIncome > 0 
      ? ((totalIncome - (totalExpenses + totalLoanPayments)) / totalIncome) * 100 
      : 0;

    return {
      totalIncome,
      totalExpenses,
      totalLoanPayments,
      netIncome,
      savingsRate,
    };
  }

  return {
    transactions,
    loans,
    loading,
    error,
    calculateMetrics,
  };
}