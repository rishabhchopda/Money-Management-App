import { Category, Transaction, BudgetConfig } from '../types/finance';
import { getCurrentCycleInfo } from '../utils/financeUtils';

const cycleInfo = getCurrentCycleInfo();

export const zeroConfig: BudgetConfig = {
  monthlyBudget: 0.0,
  cycle: cycleInfo.cycle,
  cycleDaysRemaining: cycleInfo.cycleDaysRemaining,
  totalCycleDays: cycleInfo.totalCycleDays,
  baselineDailyCap: 0.0,
  currencySymbol: '₹',
  selectedMonth: cycleInfo.selectedMonth,
};

export const defaultCleanCategories: Category[] = [
  {
    id: 'cat-1',
    name: 'Food & Groceries',
    description: 'Supermarkets, bulk items',
    icon: 'shopping_cart',
    spent: 0.0,
    limit: 500.0,
    cashSpent: 0.0,
    onlineSpent: 0.0,
  },
  {
    id: 'cat-2',
    name: 'Housing & Utilities',
    description: 'Rent, water, power, fiber',
    icon: 'home',
    spent: 0.0,
    limit: 1200.0,
    cashSpent: 0.0,
    onlineSpent: 0.0,
  },
  {
    id: 'cat-3',
    name: 'Dining & Coffee',
    description: 'Bistros, espresso bars',
    icon: 'local_cafe',
    spent: 0.0,
    limit: 300.0,
    cashSpent: 0.0,
    onlineSpent: 0.0,
  },
  {
    id: 'cat-4',
    name: 'Transport',
    description: 'Fuel, metro, rideshare',
    icon: 'directions_car',
    spent: 0.0,
    limit: 250.0,
    cashSpent: 0.0,
    onlineSpent: 0.0,
  },
  {
    id: 'cat-5',
    name: 'Shopping',
    description: 'Apparel, electronics, personal',
    icon: 'checkroom',
    spent: 0.0,
    limit: 350.0,
    cashSpent: 0.0,
    onlineSpent: 0.0,
  },
  {
    id: 'cat-6',
    name: 'Healthcare',
    description: 'Pharmacy, dental copay, clinic',
    icon: 'medical_services',
    spent: 0.0,
    limit: 200.0,
    cashSpent: 0.0,
    onlineSpent: 0.0,
  },
];

// Clean zero-based transactions
export const zeroTransactions: Transaction[] = [];

// Optional sample data retained in case user wants to test with preview records
export const sampleMockTransactions: Transaction[] = [
  {
    id: 'sample-tx-1',
    date: new Date().toISOString().split('T')[0],
    displayDate: 'Today',
    merchant: 'Organic Green Grocer',
    subtitle: 'Weekly pantry supplies',
    initials: 'OG',
    category: 'Food & Groceries',
    modality: 'online',
    modalityLabel: 'Online / Card',
    status: 'Cleared',
    amount: 64.20,
  },
  {
    id: 'sample-tx-2',
    date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
    displayDate: 'Yesterday',
    merchant: 'Corner Artisan Bakery',
    subtitle: 'Sourdough & weekend brunch',
    initials: 'CB',
    category: 'Dining & Coffee',
    modality: 'cash',
    modalityLabel: 'Cash Spend',
    status: 'Cleared',
    amount: 32.50,
  },
  {
    id: 'sample-tx-3',
    date: new Date(Date.now() - 86400000 * 2).toISOString().split('T')[0],
    displayDate: '2 days ago',
    merchant: 'Metro City Power & Gas',
    subtitle: 'Utility monthly draft',
    initials: 'GP',
    category: 'Housing & Utilities',
    modality: 'online_ach',
    modalityLabel: 'Online ACH',
    status: 'Cleared',
    amount: 110.00,
  },
];
