export type PaymentModality = 'online' | 'cash' | 'online_ach';

export interface Transaction {
  id: string;
  date: string; // YYYY-MM-DD
  displayDate: string; // "Oct 20, 2024"
  merchant: string;
  subtitle: string;
  initials: string;
  category: string;
  modality: PaymentModality;
  modalityLabel: string;
  status: 'Cleared' | 'Pending';
  amount: number; // positive number representing expense
}

export interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
  spent: number;
  limit: number;
  cashSpent: number;
  onlineSpent: number;
}

export interface DailyData {
  dayLabel: string; // e.g. "Mon 14"
  date: string;
  total: number;
  online: number;
  cash: number;
  isToday?: boolean;
}

export interface BudgetConfig {
  monthlyBudget: number;
  cycle: string;
  cycleDaysRemaining: number;
  totalCycleDays: number;
  baselineDailyCap: number;
  currencySymbol: string;
  selectedMonth: string;
}
