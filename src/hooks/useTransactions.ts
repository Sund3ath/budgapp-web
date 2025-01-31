import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { Database } from '../types/supabase';

type Transaction = Database['public']['Tables']['transactions']['Row'];

// Transform database transaction to frontend format
function transformTransaction(transaction: Transaction) {
  return {
    ...transaction,
    isRecurring: transaction.is_recurring,
  };
}

// Transform frontend transaction to database format
function transformTransactionForDb(transaction: any) {
  if (!transaction.type || !transaction.amount || !transaction.category || 
      !transaction.description || !transaction.date) {
    throw new Error('Missing required transaction fields');
  }

  if (transaction.amount <= 0) {
    throw new Error('Amount must be greater than 0');
  }

  return {
    type: transaction.type,
    amount: transaction.amount,
    category: transaction.category,
    description: transaction.description,
    date: transaction.date,
    is_recurring: transaction.isRecurring || false,
    frequency: transaction.frequency,
  };
}

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTransactions();
  }, []);

  async function fetchTransactions() {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .order('date', { ascending: false });

      if (error) throw error;
      setTransactions((data || []).map(transformTransaction));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }

  async function addTransaction(transactionData: any) {
    try {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;

      const dbTransaction = transformTransactionForDb(transactionData);
      const { data, error } = await supabase
        .from('transactions')
        .insert([{ ...dbTransaction, user_id: userData.user.id }])
        .select()
        .single();

      if (error) throw error;
      
      const transformedTransaction = transformTransaction(data);
      setTransactions((prev) => [transformedTransaction, ...prev]);
      return transformedTransaction;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    }
  }

  async function updateTransaction(id: string, transactionData: any) {
    try {
      const dbTransaction = transformTransactionForDb(transactionData);
      const { data, error } = await supabase
        .from('transactions')
        .update(dbTransaction)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      const transformedTransaction = transformTransaction(data);
      setTransactions(prev => prev.map(transaction => 
        transaction.id === id ? transformedTransaction : transaction
      ));
      
      return transformedTransaction;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    }
  }

  async function deleteTransaction(id: string) {
    try {
      const { error } = await supabase
        .from('transactions')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setTransactions(prev => prev.filter(transaction => transaction.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    }
  }

  return {
    transactions,
    loading,
    error,
    addTransaction,
    updateTransaction,
    deleteTransaction,
  };
}