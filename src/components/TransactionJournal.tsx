import React, { useState } from 'react';
import { Transaction, Category, BudgetConfig } from '../types/finance';

interface TransactionJournalProps {
  transactions: Transaction[];
  categories: Category[];
  config: BudgetConfig;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  modalityFilter: 'all' | 'cash' | 'online';
  setModalityFilter: (mod: 'all' | 'cash' | 'online') => void;
  searchQuery: string;
  onDeleteTransaction: (id: string) => void;
  onOpenAddTransaction: () => void;
}

export const TransactionJournal: React.FC<TransactionJournalProps> = ({
  transactions,
  categories,
  config,
  selectedCategory,
  setSelectedCategory,
  modalityFilter,
  setModalityFilter,
  searchQuery,
  onDeleteTransaction,
  onOpenAddTransaction,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Filter transactions
  const filtered = transactions.filter((tx) => {
    // Modality filter
    if (modalityFilter === 'cash' && tx.modality !== 'cash') return false;
    if (modalityFilter === 'online' && tx.modality === 'cash') return false;

    // Category filter
    if (selectedCategory !== 'All Categories' && tx.category !== selectedCategory) return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchMerchant = tx.merchant.toLowerCase().includes(q);
      const matchSubtitle = tx.subtitle.toLowerCase().includes(q);
      const matchCategory = tx.category.toLowerCase().includes(q);
      const matchAmount = tx.amount.toString().includes(q);
      if (!matchMerchant && !matchSubtitle && !matchCategory && !matchAmount) {
        return false;
      }
    }

    return true;
  });

  const totalPages = Math.ceil(filtered.length / itemsPerPage) || 1;
  const currentSafePage = Math.min(currentPage, totalPages);
  const startIndex = (currentSafePage - 1) * itemsPerPage;
  const displayedTransactions = filtered.slice(startIndex, startIndex + itemsPerPage);

  const handlePrevPage = () => {
    if (currentSafePage > 1) setCurrentPage(currentSafePage - 1);
  };

  const handleNextPage = () => {
    if (currentSafePage < totalPages) setCurrentPage(currentSafePage + 1);
  };

  return (
    <section className="bg-white border border-[#c6c6cd]/30 rounded-xl p-6 shadow-2xs space-y-5">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-black">receipt_long</span>
            <h2 className="text-[18px] font-bold text-[#0b1c30] font-display">Transaction Journal</h2>
          </div>
          <p className="text-[12px] text-[#45464d] mt-0.5">
            Audit-ready breakdown with payment modality verification.
          </p>
        </div>

        {/* Channel Filter Chips & Dropdown */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => {
              setModalityFilter('all');
              setCurrentPage(1);
            }}
            className={`px-3.5 py-1.5 rounded-lg text-[13px] font-medium transition-all cursor-pointer ${
              modalityFilter === 'all'
                ? 'bg-black text-white shadow-2xs font-semibold'
                : 'bg-[#eff4ff] text-[#0b1c30] hover:bg-[#e5eeff] border border-[#c6c6cd]/30'
            }`}
          >
            All Payments
          </button>
          <button
            onClick={() => {
              setModalityFilter('cash');
              setCurrentPage(1);
            }}
            className={`px-3.5 py-1.5 rounded-lg text-[13px] font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
              modalityFilter === 'cash'
                ? 'bg-black text-white shadow-2xs font-semibold'
                : 'bg-[#eff4ff] text-[#0b1c30] hover:bg-[#e5eeff] border border-[#c6c6cd]/30'
            }`}
          >
            <span className="material-symbols-outlined text-base">payments</span>
            Cash Only
          </button>
          <button
            onClick={() => {
              setModalityFilter('online');
              setCurrentPage(1);
            }}
            className={`px-3.5 py-1.5 rounded-lg text-[13px] font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
              modalityFilter === 'online'
                ? 'bg-black text-white shadow-2xs font-semibold'
                : 'bg-[#eff4ff] text-[#0b1c30] hover:bg-[#e5eeff] border border-[#c6c6cd]/30'
            }`}
          >
            <span className="material-symbols-outlined text-base">credit_card</span>
            Online / Card Only
          </button>

          <div className="h-6 w-[1px] bg-[#c6c6cd]/40 mx-1 hidden sm:block"></div>

          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setCurrentPage(1);
            }}
            className="h-9 px-3 rounded-lg text-[13px] bg-white border border-[#c6c6cd]/40 text-[#0b1c30] focus:outline-none focus:border-black cursor-pointer shadow-2xs"
          >
            <option value="All Categories">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Ledger Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead>
            <tr className="border-b border-[#c6c6cd]/20 text-[11px] font-semibold text-[#45464d] uppercase tracking-wider">
              <th className="py-3 px-3">Date</th>
              <th className="py-3 px-3">Description / Merchant</th>
              <th className="py-3 px-3">Category</th>
              <th className="py-3 px-3">Payment Modality</th>
              <th className="py-3 px-3">Status</th>
              <th className="py-3 px-3 text-right">Amount</th>
              <th className="py-3 px-2 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#c6c6cd]/15 text-[14px]">
            {transactions.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-14 text-center">
                  <div className="flex flex-col items-center justify-center gap-3 max-w-sm mx-auto">
                    <div className="w-12 h-12 rounded-2xl bg-[#e5eeff] flex items-center justify-center text-black">
                      <span className="material-symbols-outlined text-2xl">account_balance_wallet</span>
                    </div>
                    <div>
                      <p className="font-bold text-[#0b1c30] text-[15px] font-display">
                        Ready to start your real budget
                      </p>
                      <p className="text-[12px] text-[#45464d] mt-1">
                        All dummy data has been removed. Record your first cash or online transaction to begin real-time velocity tracking.
                      </p>
                    </div>
                    <button
                      onClick={onOpenAddTransaction}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-black text-white text-[13px] font-semibold hover:opacity-90 transition-all shadow-xs cursor-pointer mt-1"
                    >
                      <span className="material-symbols-outlined text-base">add</span>
                      <span>Record First Transaction</span>
                    </button>
                  </div>
                </td>
              </tr>
            ) : displayedTransactions.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-10 text-center text-[#45464d]">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <span className="material-symbols-outlined text-3xl text-[#76777d]">search_off</span>
                    <p className="font-semibold text-[#0b1c30]">No matching transactions</p>
                    <p className="text-[12px] text-[#76777d]">No transactions match your current search or filter filters.</p>
                  </div>
                </td>
              </tr>
            ) : (
              displayedTransactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-[#eff4ff]/60 transition-colors group">
                  <td className="py-3.5 px-3 text-[#45464d] font-medium text-[13px] whitespace-nowrap">
                    {tx.displayDate}
                  </td>
                  <td className="py-3.5 px-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#e5eeff] flex items-center justify-center text-[#0b1c30] font-semibold text-[12px] shrink-0 font-display">
                        {tx.initials}
                      </div>
                      <div>
                        <div className="font-semibold text-[#0b1c30] leading-snug">{tx.merchant}</div>
                        <div className="text-[12px] text-[#45464d] leading-none mt-0.5">{tx.subtitle}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-3 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#e5eeff] text-[#0b1c30] text-[11px] font-semibold">
                      {tx.category}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 whitespace-nowrap">
                    {tx.modality === 'cash' ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#eff4ff] text-[#45464d] border border-[#c6c6cd]/30 text-[11px] font-medium">
                        <span className="material-symbols-outlined text-sm">payments</span>
                        {tx.modalityLabel}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#dce9ff] text-[#0b1c30] text-[11px] font-medium">
                        <span className="material-symbols-outlined text-sm">credit_card</span>
                        {tx.modalityLabel}
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-3 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1.5 text-[11px] text-[#006c49] font-semibold">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#006c49]"></span>
                      {tx.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 text-right font-bold text-[#0b1c30] whitespace-nowrap">
                    -{config.currencySymbol}{tx.amount.toFixed(2)}
                  </td>
                  <td className="py-3.5 px-2 text-right">
                    <button
                      onClick={() => onDeleteTransaction(tx.id)}
                      className="p-1 rounded text-[#76777d] hover:text-[#ba1a1a] hover:bg-[#ffdad6]/40 transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"
                      title="Remove transaction"
                    >
                      <span className="material-symbols-outlined text-base">delete</span>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination & Summary */}
      <div className="flex flex-col sm:flex-row items-center justify-between pt-3 border-t border-[#c6c6cd]/20 text-[12px] text-[#45464d] gap-3">
        <span>
          Showing {filtered.length === 0 ? 0 : startIndex + 1} to{' '}
          {Math.min(startIndex + itemsPerPage, filtered.length)} of {filtered.length} recorded transactions
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrevPage}
            disabled={currentSafePage <= 1}
            className="px-3 py-1 rounded border border-[#c6c6cd]/30 bg-white hover:bg-[#eff4ff] disabled:opacity-40 disabled:hover:bg-white text-[#0b1c30] text-[11px] font-medium cursor-pointer transition-colors shadow-2xs"
          >
            Previous
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
            <button
              key={pageNum}
              onClick={() => setCurrentPage(pageNum)}
              className={`px-3 py-1 rounded text-[11px] font-medium transition-all cursor-pointer ${
                pageNum === currentSafePage
                  ? 'bg-black text-white shadow-2xs'
                  : 'border border-[#c6c6cd]/30 bg-white hover:bg-[#eff4ff] text-[#0b1c30]'
              }`}
            >
              {pageNum}
            </button>
          ))}
          <button
            onClick={handleNextPage}
            disabled={currentSafePage >= totalPages}
            className="px-3 py-1 rounded border border-[#c6c6cd]/30 bg-white hover:bg-[#eff4ff] disabled:opacity-40 disabled:hover:bg-white text-[#0b1c30] text-[11px] font-medium cursor-pointer transition-colors shadow-2xs"
          >
            Next
          </button>
        </div>
      </div>
    </section>
  );
};
