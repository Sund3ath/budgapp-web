import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { Database } from '../types/supabase';

type Loan = Database['public']['Tables']['loans']['Row'];
type MileageUpdate = Database['public']['Tables']['mileage_updates']['Row'];

// Transform database loan to frontend format
function transformLoan(loan: Loan) {
  return {
    ...loan,
    interestRate: loan.interest_rate,
    termMonths: loan.term_months,
    startDate: loan.start_date,
    regularPayment: loan.regular_payment,
    paymentFrequency: loan.payment_frequency,
    residualValue: loan.residual_value,
    mileageLimit: loan.mileage_limit,
  };
}

// Transform frontend loan to database format
function transformLoanForDb(loan: any) {
  // Validate required fields
  if (!loan.name || !loan.type || !loan.principal || !loan.interestRate || 
      !loan.termMonths || !loan.startDate || !loan.regularPayment || 
      !loan.paymentFrequency) {
    throw new Error('Missing required loan fields');
  }

  // Ensure numeric values are valid
  if (loan.principal <= 0 || loan.interestRate < 0 || loan.termMonths <= 0 || 
      loan.regularPayment <= 0) {
    throw new Error('Invalid numeric values in loan data');
  }

  return {
    name: loan.name,
    type: loan.type,
    principal: loan.principal,
    interest_rate: loan.interestRate,
    term_months: loan.termMonths,
    start_date: loan.startDate,
    regular_payment: loan.regularPayment,
    payment_frequency: loan.paymentFrequency,
    residual_value: loan.residualValue || null,
    mileage_limit: loan.mileageLimit || null,
  };
}

export function useLoans() {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchLoans();
  }, []);

  async function fetchLoans() {
    try {
      const { data, error } = await supabase
        .from('loans')
        .select(`
          id,
          name,
          type,
          principal,
          interest_rate,
          term_months,
          start_date,
          regular_payment,
          payment_frequency,
          residual_value,
          mileage_limit,
          created_at,
          updated_at
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setLoans((data || []).map(transformLoan));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }

  async function addLoan(loanData: any) {
    try {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;

      const dbLoan = transformLoanForDb(loanData);
      const initialMileage = loanData.currentMileage;

      const { data, error } = await supabase
        .from('loans')
        .insert([{ ...dbLoan, user_id: userData.user.id }])
        .select()
        .single();

      if (error) throw error;
      
      // If it's a lease and has initial mileage, create mileage update
      if (data.type === 'lease' && initialMileage) {
        const { error: mileageError } = await supabase
          .from('mileage_updates')
          .insert([{
            loan_id: data.id,
            mileage: parseInt(initialMileage),
            date: data.start_date,
          }]);

        if (mileageError) {
          console.error('Error saving initial mileage:', mileageError);
        }
      }
      const transformedLoan = transformLoan(data);
      setLoans((prev) => [transformedLoan, ...prev]);
      return transformedLoan;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    }
  }

  async function updateLoan(id: string, loanData: any) {
    try {
      setUpdating(true);
      const currentMileage = loanData.currentMileage;
      const dbLoan = transformLoanForDb(loanData);
      
      const { data, error } = await supabase
        .from('loans')
        .update(dbLoan)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      // If it's a lease and has current mileage, create mileage update
      if (data.type === 'lease' && currentMileage) {
        const { error: mileageError } = await supabase
          .from('mileage_updates')
          .insert([{
            loan_id: data.id,
            mileage: parseInt(currentMileage),
            date: new Date().toISOString().split('T')[0],
          }]);

        if (mileageError) {
          console.error('Error saving mileage update:', mileageError);
        }
      }
      
      const transformedLoan = transformLoan(data);
      setLoans(prev => prev.map(loan => 
        loan.id === id ? transformedLoan : loan
      ));
      
      return transformedLoan;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    } finally {
      setUpdating(false);
    }
  }

  async function updateMileage(loanId: string, mileage: number) {
    try {
      const { error: mileageError } = await supabase
        .from('mileage_updates')
        .insert([{
          loan_id: loanId,
          mileage,
          date: new Date().toISOString().split('T')[0],
        }]);

      if (mileageError) throw mileageError;

      await fetchLoans(); // Refresh loans to get latest data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    }
  }

  async function getLatestMileage(loanId: string): Promise<number | null> {
    try {
      const { data, error } = await supabase
        .from('mileage_updates')
        .select('mileage')
        .eq('loan_id', loanId)
        .order('date', { ascending: false });

      if (error) {
        console.error('Error fetching mileage:', error);
        return null;
      }
      
      // Return the first (most recent) mileage value if it exists
      return data?.[0]?.mileage || null;
    } catch (err) {
      console.error('Error fetching mileage:', err);
      return null;
    }
  }

  return {
    loans,
    loading,
    error,
    updating,
    addLoan,
    updateLoan,
    updateMileage,
    getLatestMileage,
  };
}