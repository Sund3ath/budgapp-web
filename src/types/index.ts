export interface Income {
  id: string;
  amount: number;
  category: string;
  description: string;
  date: string;
  isRecurring: boolean;
  frequency?: 'weekly' | 'biweekly' | 'monthly' | 'yearly';
}

export interface Expense {
  id: string;
  amount: number;
  category: string;
  description: string;
  date: string;
  isRecurring: boolean;
  frequency?: 'weekly' | 'biweekly' | 'monthly' | 'yearly';
}

export interface Loan {
  id: string;
  name: string;
  principal: number;
  interestRate: number;
  termMonths: number;
  startDate: string;
  regularPayment: number;
  paymentFrequency: 'monthly' | 'biweekly';
  extraPayments: ExtraPayment[];
}

export interface ExtraPayment {
  id: string;
  amount: number;
  date: string;
  isRecurring: boolean;
  frequency?: 'monthly' | 'yearly';
}

export interface Theme {
  isDark: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  currency: string;
}

export interface BudgetGoal {
  id: string;
  category: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
}

export interface Notification {
  id: string;
  type: 'payment' | 'goal' | 'system';
  message: string;
  date: string;
  isRead: boolean;
}