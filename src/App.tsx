/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { BudgetCards } from './components/BudgetCards';
import { DailyVelocityChart } from './components/DailyVelocityChart';
import { CategoryGrid } from './components/CategoryGrid';
import { TransactionJournal } from './components/TransactionJournal';
import { AddTransactionModal } from './components/AddTransactionModal';
import { EditBudgetModal } from './components/EditBudgetModal';
import { AddCategoryModal } from './components/AddCategoryModal';
import { ExportStatementModal } from './components/ExportStatementModal';
import { SettingsModal } from './components/SettingsModal';
import { SupportModal } from './components/SupportModal';
import { NotificationsPopover } from './components/NotificationsPopover';

import {
  zeroConfig,
  defaultCleanCategories,
  zeroTransactions,
  sampleMockTransactions,
} from './data/initialData';
import {
  getDailyVelocityData,
  calculateCategorySpending,
} from './utils/financeUtils';
import { BudgetConfig, Category, Transaction } from './types/finance';

export default function App() {
  // Use 'aura_real_v1_*' to ensure placeholder demo data from prior version is completely removed
  const [config, setConfig] = useState<BudgetConfig>(() => {
    const saved = localStorage.getItem('aura_real_v1_config');
    return saved ? JSON.parse(saved) : zeroConfig;
  });

  const [baseCategories, setBaseCategories] = useState<Category[]>(() => {
    const saved = localStorage.getItem('aura_real_v1_categories');
    return saved ? JSON.parse(saved) : defaultCleanCategories;
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('aura_real_v1_transactions');
    return saved ? JSON.parse(saved) : zeroTransactions;
  });

  // UI state
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('All Categories');
  const [modalityFilter, setModalityFilter] = useState<'all' | 'cash' | 'online'>('all');
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Modals state
  const [isAddTransactionOpen, setIsAddTransactionOpen] = useState(false);
  const [isEditBudgetOpen, setIsEditBudgetOpen] = useState(false);
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
  const [isExportStatementOpen, setIsExportStatementOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isSupportOpen, setIsSupportOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('aura_real_v1_config', JSON.stringify(config));
  }, [config]);

  useEffect(() => {
    localStorage.setItem('aura_real_v1_categories', JSON.stringify(baseCategories));
  }, [baseCategories]);

  useEffect(() => {
    localStorage.setItem('aura_real_v1_transactions', JSON.stringify(transactions));
  }, [transactions]);

  // Derived categories with spend computed from real transactions
  const categories = useMemo(() => {
    return calculateCategorySpending(baseCategories, transactions);
  }, [baseCategories, transactions]);

  // Dynamic daily velocity datasets calculated from real transactions
  const data7Days = useMemo(() => {
    return getDailyVelocityData(7, transactions);
  }, [transactions]);

  const data14Days = useMemo(() => {
    return getDailyVelocityData(14, transactions);
  }, [transactions]);

  const data30Days = useMemo(() => {
    return getDailyVelocityData(30, transactions);
  }, [transactions]);

  // Aggregate stats
  const totalSpent = useMemo(() => {
    return transactions.reduce((acc, tx) => acc + tx.amount, 0);
  }, [transactions]);

  const cashTransactions = useMemo(() => {
    return transactions.filter((tx) => tx.modality === 'cash');
  }, [transactions]);

  const onlineTransactions = useMemo(() => {
    return transactions.filter((tx) => tx.modality !== 'cash');
  }, [transactions]);

  const cashSpent = useMemo(() => {
    return cashTransactions.reduce((acc, tx) => acc + tx.amount, 0);
  }, [cashTransactions]);

  const onlineSpent = useMemo(() => {
    return onlineTransactions.reduce((acc, tx) => acc + tx.amount, 0);
  }, [onlineTransactions]);

  const cashTxCount = cashTransactions.length;
  const onlineTxCount = onlineTransactions.length;

  // Add Transaction Handler
  const handleAddTransaction = (newTxData: Omit<Transaction, 'id'>) => {
    const newTx: Transaction = {
      ...newTxData,
      id: `tx-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    };

    setTransactions((prev) => [newTx, ...prev]);
  };

  // Delete Transaction Handler
  const handleDeleteTransaction = (id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  // Update Budget Limit
  const handleUpdateBudget = (newLimit: number) => {
    setConfig((prev) => ({
      ...prev,
      monthlyBudget: newLimit,
      baselineDailyCap: +(newLimit / 31).toFixed(2),
    }));
  };

  // Add Category Handler
  const handleAddCategory = (catData: Omit<Category, 'id' | 'spent' | 'cashSpent' | 'onlineSpent'>) => {
    const newCat: Category = {
      ...catData,
      id: `cat-${Date.now()}`,
      spent: 0,
      cashSpent: 0,
      onlineSpent: 0,
    };
    setBaseCategories((prev) => [...prev, newCat]);
  };

  // Reset to Clean Zero
  const handleResetToZero = () => {
    localStorage.removeItem('aura_real_v1_config');
    localStorage.removeItem('aura_real_v1_categories');
    localStorage.removeItem('aura_real_v1_transactions');
    setConfig(zeroConfig);
    setBaseCategories(defaultCleanCategories);
    setTransactions([]);
    setSearchQuery('');
    setSelectedCategoryFilter('All Categories');
    setModalityFilter('all');
    setUnreadNotifications(0);
  };

  // Optional: Load sample data for testing
  const handleLoadSampleData = () => {
    setConfig({
      ...zeroConfig,
      monthlyBudget: 4500.0,
      baselineDailyCap: 145.16,
    });
    setTransactions(sampleMockTransactions);
    setUnreadNotifications(1);
  };

  return (
    <div className="min-h-screen bg-[#f8f9ff] text-[#0b1c30] antialiased">
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAddTransaction={() => setIsAddTransactionOpen(true)}
        onOpenExportStatement={() => setIsExportStatementOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenSupport={() => setIsSupportOpen(true)}
        isMobileOpen={isMobileMenuOpen}
        setIsMobileOpen={setIsMobileMenuOpen}
      />

      {/* Top Header Navigation */}
      <Header
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedMonth={config.selectedMonth}
        setSelectedMonth={(month) => setConfig((prev) => ({ ...prev, selectedMonth: month }))}
        onOpenAddTransaction={() => setIsAddTransactionOpen(true)}
        onOpenExportStatement={() => setIsExportStatementOpen(true)}
        onOpenNotifications={() => setIsNotificationsOpen((prev) => !prev)}
        onOpenSupport={() => setIsSupportOpen(true)}
        unreadNotifications={unreadNotifications}
        onToggleMobileMenu={() => setIsMobileMenuOpen((prev) => !prev)}
      />

      {/* Notifications Popover */}
      <NotificationsPopover
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        onClear={() => setUnreadNotifications(0)}
        currencySymbol={config.currencySymbol}
      />

      {/* Main Workspace Canvas */}
      <main className="lg:pl-[260px] pt-6 pb-20 px-4 sm:px-8 min-h-screen">
        <div className="max-w-[1400px] mx-auto space-y-8">
          {/* Zero Budget Setup Prompt Banner (when budget is 0) */}
          {config.monthlyBudget === 0 && (
            <div className="bg-gradient-to-r from-[#131b2e] to-[#213145] text-white p-5 rounded-2xl shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-[#c6c6cd]/20">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-white text-xl">account_balance</span>
                </div>
                <div>
                  <h3 className="font-bold text-[15px] font-display">Real Budget Mode Active</h3>
                  <p className="text-[12px] text-[#c6c6cd] mt-0.5">
                    Placeholder data removed. Set your monthly budget limit or record your first transaction to calibrate pacing.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2.5 w-full md:w-auto">
                <button
                  onClick={() => setIsEditBudgetOpen(true)}
                  className="px-4 py-2 rounded-lg bg-white text-black text-[12px] font-semibold hover:bg-white/90 transition-all shadow-xs cursor-pointer whitespace-nowrap"
                >
                  Set Monthly Budget
                </button>
                <button
                  onClick={() => setIsAddTransactionOpen(true)}
                  className="px-4 py-2 rounded-lg bg-white/15 text-white hover:bg-white/25 text-[12px] font-medium transition-all cursor-pointer whitespace-nowrap"
                >
                  + Add Expense
                </button>
              </div>
            </div>
          )}

          {/* Section 1: Dashboard Top Header & Bento Grid */}
          <section id="dashboard" className="space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-[28px] sm:text-[32px] font-bold text-[#0b1c30] tracking-tight font-display">
                  Monthly Financial Ledger
                </h1>
                <p className="text-[13px] sm:text-[14px] text-[#45464d]">
                  Real-time pacing, budget reserves, and cash versus electronic payment distribution.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-[11px] text-[#45464d] bg-[#e5eeff] px-3 py-1.5 rounded-full border border-[#c6c6cd]/30 flex items-center gap-1.5 shadow-2xs">
                  <span className="w-2 h-2 rounded-full bg-[#006c49] animate-pulse"></span>
                  Ledger active • Real data
                </span>
                <button
                  onClick={() => setIsEditBudgetOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#c6c6cd]/40 bg-white text-[#0b1c30] text-[13px] font-medium hover:bg-[#eff4ff] transition-colors shadow-2xs cursor-pointer"
                >
                  <span className="material-symbols-outlined text-base">tune</span>
                  <span>{config.monthlyBudget === 0 ? 'Set Budget Cap' : 'Edit Budget Limit'}</span>
                </button>
              </div>
            </div>

            {/* 4-Card Bento Grid */}
            <BudgetCards
              config={config}
              totalSpent={totalSpent}
              cashSpent={cashSpent}
              onlineSpent={onlineSpent}
              cashTxCount={cashTxCount}
              onlineTxCount={onlineTxCount}
              onOpenEditBudget={() => setIsEditBudgetOpen(true)}
            />
          </section>

          {/* Section 2: Daily Velocity & Timeline */}
          <DailyVelocityChart
            data7Days={data7Days}
            data14Days={data14Days}
            data30Days={data30Days}
            config={config}
          />

          {/* Section 3: Categories & Envelopes */}
          <CategoryGrid
            categories={categories}
            config={config}
            onOpenAddCategory={() => setIsAddCategoryOpen(true)}
            onSelectCategoryFilter={(catName) => {
              setSelectedCategoryFilter(catName);
              const element = document.getElementById('transaction-journal');
              if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
              }
            }}
          />

          {/* Section 4: Transaction Journal */}
          <div id="transaction-journal">
            <TransactionJournal
              transactions={transactions}
              categories={categories}
              config={config}
              selectedCategory={selectedCategoryFilter}
              setSelectedCategory={setSelectedCategoryFilter}
              modalityFilter={modalityFilter}
              setModalityFilter={setModalityFilter}
              searchQuery={searchQuery}
              onDeleteTransaction={handleDeleteTransaction}
              onOpenAddTransaction={() => setIsAddTransactionOpen(true)}
            />
          </div>
        </div>
      </main>

      {/* Modals */}
      <AddTransactionModal
        isOpen={isAddTransactionOpen}
        onClose={() => setIsAddTransactionOpen(false)}
        categories={categories}
        currencySymbol={config.currencySymbol}
        onAddTransaction={handleAddTransaction}
      />

      <EditBudgetModal
        isOpen={isEditBudgetOpen}
        onClose={() => setIsEditBudgetOpen(false)}
        config={config}
        totalSpent={totalSpent}
        onUpdateBudget={handleUpdateBudget}
      />

      <AddCategoryModal
        isOpen={isAddCategoryOpen}
        onClose={() => setIsAddCategoryOpen(false)}
        config={config}
        onAddCategory={handleAddCategory}
      />

      <ExportStatementModal
        isOpen={isExportStatementOpen}
        onClose={() => setIsExportStatementOpen(false)}
        config={config}
        categories={categories}
        totalSpent={totalSpent}
        cashSpent={cashSpent}
        onlineSpent={onlineSpent}
        cashTxCount={cashTxCount}
        onlineTxCount={onlineTxCount}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        config={config}
        onUpdateConfig={(updates) => setConfig((prev) => ({ ...prev, ...updates }))}
        onResetToZero={handleResetToZero}
        onLoadSampleData={handleLoadSampleData}
      />

      <SupportModal
        isOpen={isSupportOpen}
        onClose={() => setIsSupportOpen(false)}
      />
    </div>
  );
}
