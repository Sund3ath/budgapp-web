export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      savings_goals: {
        Row: {
          id: string
          user_id: string
          name: string
          target_amount: number
          current_amount: number
          deadline: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          target_amount: number
          current_amount?: number
          deadline?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          target_amount?: number
          current_amount?: number
          deadline?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      transactions: {
        Row: {
          id: string
          user_id: string
          type: 'income' | 'expense'
          amount: number
          category: string
          description: string
          date: string
          is_recurring: boolean
          frequency: 'weekly' | 'biweekly' | 'monthly' | 'yearly' | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          type: 'income' | 'expense'
          amount: number
          category: string
          description: string
          date: string
          is_recurring?: boolean
          frequency?: 'weekly' | 'biweekly' | 'monthly' | 'yearly' | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          type?: 'income' | 'expense'
          amount?: number
          category?: string
          description?: string
          date?: string
          is_recurring?: boolean
          frequency?: 'weekly' | 'biweekly' | 'monthly' | 'yearly' | null
          created_at?: string
          updated_at?: string
        }
      }
      loans: {
        Row: {
          id: string
          user_id: string
          name: string
          type: 'loan' | 'lease'
          principal: number
          interest_rate: number
          term_months: number
          start_date: string
          regular_payment: number
          payment_frequency: 'monthly' | 'biweekly'
          residual_value: number | null
          mileage_limit: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          type: 'loan' | 'lease'
          principal: number
          interest_rate: number
          term_months: number
          start_date: string
          regular_payment: number
          payment_frequency: 'monthly' | 'biweekly'
          residual_value?: number | null
          mileage_limit?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          type?: 'loan' | 'lease'
          principal?: number
          interest_rate?: number
          term_months?: number
          start_date?: string
          regular_payment?: number
          payment_frequency?: 'monthly' | 'biweekly'
          residual_value?: number | null
          mileage_limit?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      mileage_updates: {
        Row: {
          id: string
          loan_id: string
          mileage: number
          date: string
          created_at: string
        }
        Insert: {
          id?: string
          loan_id: string
          mileage: number
          date: string
          created_at?: string
        }
        Update: {
          id?: string
          loan_id?: string
          mileage?: number
          date?: string
          created_at?: string
        }
      }
    }
  }
}