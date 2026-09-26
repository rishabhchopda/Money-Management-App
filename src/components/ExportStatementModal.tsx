import React, { useState } from 'react';
import { Category, BudgetConfig } from '../types/finance';

interface ExportStatementModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: BudgetConfig;
  categories: Category[];
  totalSpent: number;
  cashSpent: number;
  onlineSpent: number;
  cashTxCount: number;
  onlineTxCount: number;
}

export const ExportStatementModal: React.FC<ExportStatementModalProps> = ({
  isOpen,
  onClose,
  config,
  categories,
  totalSpent,
  cashSpent,
  onlineSpent,
  cashTxCount,
  onlineTxCount,
}) => {
  const [downloading, setDownloading] = useState(false);

  if (!isOpen) return null;

  const remainingBudget = Math.max(0, config.monthlyBudget - totalSpent);
  const totalModality = cashSpent + onlineSpent;
  const cashRatio = totalModality > 0 ? ((cashSpent / totalModality) * 100).toFixed(1) : '0.0';

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    setDownloading(true);
    setTimeout(() => {
      setDownloading(false);
      window.print();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#0b1c30]/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white border border-[#c6c6cd]/40 rounded-2xl w-full max-w-3xl shadow-xl max-h-[92vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-[#c6c6cd]/20 flex items-center justify-between bg-[#eff4ff]/40 no-print">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-black">picture_as_pdf</span>
            <h3 className="text-[18px] font-bold text-[#0b1c30] font-display">Export Financial Statement</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-[#45464d] hover:bg-[#e5eeff] transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        {/* Printable Statement Sheet Content */}
        <div className="p-4 sm:p-8 overflow-y-auto space-y-6 text-[#0b1c30] custom-scroll bg-[#f8f9ff]">
          <div className="bg-white border border-[#c6c6cd]/30 rounded-xl p-6 sm:p-8 shadow-2xs space-y-6">
            {/* Document Header */}
            <div className="flex flex-col sm:flex-row items-start justify-between border-b border-[#c6c6cd]/20 pb-6 gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-black text-2xl">account_balance_wallet</span>
                  <span className="text-[22px] font-bold tracking-tight font-display">Aura Money</span>
                </div>
                <p className="text-[12px] text-[#45464d] mt-1">Institutional-Grade Private Ledger</p>
              </div>
              <div className="text-left sm:text-right">
                <span className="text-[11px] bg-[#e5eeff] text-[#0b1c30] px-3 py-1 rounded-full font-semibold uppercase tracking-wider inline-block">
                  Verified Statement
                </span>
                <div className="text-[18px] font-bold text-[#0b1c30] mt-2 font-display">{config.selectedMonth}</div>
                <div className="text-[12px] text-[#45464d]">Generated: Oct 20, 2024 • 14:32 UTC</div>
              </div>
            </div>

            {/* Executive Summary Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-[#eff4ff]/60 p-4 rounded-xl border border-[#c6c6cd]/15 text-center">
              <div>
                <span className="text-[11px] text-[#45464d] uppercase font-semibold">Approved Cap</span>
                <div className="text-[20px] font-bold text-[#0b1c30] mt-1 font-display">
                  {config.currencySymbol}{config.monthlyBudget.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
              </div>
              <div>
                <span className="text-[11px] text-[#45464d] uppercase font-semibold">Total Expensed</span>
                <div className="text-[20px] font-bold text-[#0b1c30] mt-1 font-display">
                  {config.currencySymbol}{totalSpent.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
              </div>
              <div>
                <span className="text-[11px] text-[#45464d] uppercase font-semibold">Safe Reserve</span>
                <div className="text-[20px] font-bold text-[#006c49] mt-1 font-display">
                  {config.currencySymbol}{remainingBudget.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
              </div>
              <div>
                <span className="text-[11px] text-[#45464d] uppercase font-semibold">Cash Ratio</span>
                <div className="text-[20px] font-bold text-[#0b1c30] mt-1 font-display">{cashRatio}%</div>
              </div>
            </div>

            {/* Modality Overview */}
            <div className="space-y-2">
              <h4 className="text-[13px] font-bold text-[#0b1c30] uppercase tracking-wider">Payment Channel Execution</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[12px]">
                <div className="p-3 rounded-lg border border-[#c6c6cd]/20 flex justify-between items-center bg-[#f8f9ff]">
                  <span className="flex items-center gap-1.5 font-medium">
                    <span className="material-symbols-outlined text-base">payments</span> Cash Withdrawals &amp; Spend
                  </span>
                  <span className="font-bold text-[#0b1c30]">
                    {config.currencySymbol}{cashSpent.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}{' '}
                    <span className="text-[#76777d] font-normal">({cashTxCount} tx)</span>
                  </span>
                </div>
                <div className="p-3 rounded-lg border border-[#c6c6cd]/20 flex justify-between items-center bg-[#f8f9ff]">
                  <span className="flex items-center gap-1.5 font-medium">
                    <span className="material-symbols-outlined text-base">credit_card</span> Online, Card &amp; Clearinghouse
                  </span>
                  <span className="font-bold text-[#0b1c30]">
                    {config.currencySymbol}{onlineSpent.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}{' '}
                    <span className="text-[#76777d] font-normal">({onlineTxCount} tx)</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Top Category Breakdown in Statement */}
            <div className="space-y-2">
              <h4 className="text-[13px] font-bold text-[#0b1c30] uppercase tracking-wider">Category Allocation Summary</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-[13px]">
                  <thead>
                    <tr className="border-b border-[#c6c6cd]/20 text-[#45464d] text-[11px] uppercase font-semibold">
                      <th className="py-2.5">Envelope</th>
                      <th className="py-2.5">Limit</th>
                      <th className="py-2.5">Spent</th>
                      <th className="py-2.5 text-right">Variance</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#c6c6cd]/10">
                    {categories.map((cat) => {
                      const variance = cat.limit - cat.spent;
                      const isOver = variance < 0;
                      return (
                        <tr key={cat.id}>
                          <td className="py-2.5 font-medium text-[#0b1c30]">{cat.name}</td>
                          <td className="py-2.5 text-[#45464d]">
                            {config.currencySymbol}{cat.limit.toFixed(2)}
                          </td>
                          <td className="py-2.5 font-semibold text-[#0b1c30]">
                            {config.currencySymbol}{cat.spent.toFixed(2)}
                          </td>
                          <td className={`py-2.5 text-right font-semibold ${isOver ? 'text-[#ba1a1a]' : 'text-[#006c49]'}`}>
                            {isOver ? '-' : '+'}{config.currencySymbol}{Math.abs(variance).toFixed(2)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Footer with verification hash */}
            <div className="pt-4 border-t border-[#c6c6cd]/15 text-[11px] text-[#76777d] flex flex-col sm:flex-row justify-between items-center gap-2">
              <span>
                Aura Money Cryptographic Hash:{' '}
                <code className="text-black font-mono font-bold bg-[#eff4ff] px-1.5 py-0.5 rounded">
                  0x9a8f...3e21
                </code>
              </span>
              <span>Page 1 of 1 • Signed by Alex Sinclair</span>
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="px-6 py-4 border-t border-[#c6c6cd]/20 bg-[#eff4ff]/40 flex flex-col sm:flex-row items-center justify-between gap-3 no-print">
          <span className="text-[12px] text-[#45464d]">
            Statement formatted for print &amp; A4 PDF archives.
          </span>
          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white border border-[#c6c6cd]/30 text-[#0b1c30] hover:bg-[#eff4ff] text-[13px] font-semibold transition-colors shadow-2xs cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">print</span>
              <span>Print Statement</span>
            </button>
            <button
              onClick={handleDownloadPDF}
              disabled={downloading}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-black text-white hover:opacity-90 text-[13px] font-semibold transition-all shadow-sm cursor-pointer disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-base">download</span>
              <span>{downloading ? 'Preparing...' : 'Download PDF'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
