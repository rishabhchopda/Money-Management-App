import React from 'react';
import { BudgetConfig } from '../types/finance';

interface BudgetCardsProps {
  config: BudgetConfig;
  totalSpent: number;
  cashSpent: number;
  onlineSpent: number;
  cashTxCount: number;
  onlineTxCount: number;
  onOpenEditBudget: () => void;
}

export const BudgetCards: React.FC<BudgetCardsProps> = ({
  config,
  totalSpent,
  cashSpent,
  onlineSpent,
  cashTxCount,
  onlineTxCount,
  onOpenEditBudget,
}) => {
  const { monthlyBudget, currencySymbol, cycle, cycleDaysRemaining } = config;

  const remainingBudget = Math.max(0, monthlyBudget - totalSpent);
  const spentPercentage = monthlyBudget > 0 ? Math.min(100, (totalSpent / monthlyBudget) * 100) : 0;
  const dailyLimit = cycleDaysRemaining > 0 && monthlyBudget > 0 ? (remainingBudget / cycleDaysRemaining) : 0;

  // Split calculation
  const totalModalitySpent = cashSpent + onlineSpent;
  const cashPercentage = totalModalitySpent > 0 ? (cashSpent / totalModalitySpent) * 100 : 0;
  const onlinePercentage = totalModalitySpent > 0 ? (onlineSpent / totalModalitySpent) * 100 : 0;
  const totalTxCount = cashTxCount + onlineTxCount;

  // Pacing calculation
  const expectedPacing = monthlyBudget > 0 ? ((31 - cycleDaysRemaining) / 31) * monthlyBudget : 0;
  const pacingDelta = expectedPacing - totalSpent;
  const isPacingUnder = pacingDelta >= 0;

  // Safe health status
  const isBudgetConfigured = monthlyBudget > 0;
  const isSafe = isBudgetConfigured ? remainingBudget > 0 && spentPercentage < 85 : true;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
      {/* Card 1: Monthly Total Budget */}
      <div className="bg-white border border-[#c6c6cd]/30 rounded-xl p-5 shadow-2xs relative overflow-hidden group hover:border-[#c6c6cd] transition-all">
        <div className="flex items-start justify-between">
          <div>
            <span className="text-[13px] font-medium text-[#45464d]">Monthly Total Budget</span>
            <div className="text-[32px] sm:text-[36px] font-bold text-[#0b1c30] mt-1 tracking-tight font-display">
              {currencySymbol}{monthlyBudget.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </div>
          <button
            onClick={onOpenEditBudget}
            className="w-9 h-9 rounded-lg bg-[#eff4ff] flex items-center justify-center text-[#45464d] hover:text-black hover:bg-[#e5eeff] transition-colors cursor-pointer"
            title={monthlyBudget === 0 ? "Set Monthly Budget" : "Adjust Limit"}
          >
            <span className="material-symbols-outlined text-lg">
              {monthlyBudget === 0 ? 'add_circle' : 'edit'}
            </span>
          </button>
        </div>
        <div className="mt-4 pt-3 border-t border-[#c6c6cd]/15 flex items-center justify-between text-[12px]">
          <span className="text-[#45464d]">Cycle: {cycle}</span>
          {monthlyBudget === 0 ? (
            <button
              onClick={onOpenEditBudget}
              className="text-[11px] font-semibold text-black bg-[#e5eeff] px-2 py-0.5 rounded hover:bg-[#dce9ff] transition-colors cursor-pointer"
            >
              + Set Budget Cap
            </button>
          ) : (
            <span className="font-semibold text-black bg-[#eff4ff] px-2 py-0.5 rounded">Fixed Envelope</span>
          )}
        </div>
      </div>

      {/* Card 2: Total Spent to Date */}
      <div className="bg-white border border-[#c6c6cd]/30 rounded-xl p-5 shadow-2xs relative overflow-hidden group hover:border-[#c6c6cd] transition-all">
        <div className="flex items-start justify-between">
          <div>
            <span className="text-[13px] font-medium text-[#45464d]">Total Spent to Date</span>
            <div className="text-[32px] sm:text-[36px] font-bold text-[#0b1c30] mt-1 tracking-tight font-display">
              {currencySymbol}{totalSpent.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </div>
          <span className="text-[11px] px-2.5 py-1 rounded-full bg-[#e5eeff] text-[#131b2e] font-semibold">
            {spentPercentage.toFixed(1)}% used
          </span>
        </div>
        <div className="mt-4 space-y-1.5">
          <div className="w-full bg-[#e5eeff] h-2 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                spentPercentage > 90 ? 'bg-[#ba1a1a]' : 'bg-black'
              }`}
              style={{ width: `${Math.max(0, Math.min(100, spentPercentage))}%` }}
            />
          </div>
          <div className="flex justify-between text-[12px] text-[#45464d]">
            <span>Pacing: {totalSpent === 0 ? 'Zero Spend' : spentPercentage > 75 ? 'Accelerated' : 'Normal'}</span>
            <span>
              {totalSpent === 0
                ? 'Clean ledger'
                : isPacingUnder
                ? `${currencySymbol}${Math.abs(pacingDelta).toFixed(2)} under model`
                : `${currencySymbol}${Math.abs(pacingDelta).toFixed(2)} over model`}
            </span>
          </div>
        </div>
      </div>

      {/* Card 3: Remaining Budget Safe Indicator */}
      <div className="bg-white border border-[#c6c6cd]/30 rounded-xl p-5 shadow-2xs relative overflow-hidden group hover:border-[#c6c6cd] transition-all">
        <div className="flex items-start justify-between">
          <div>
            <span className="text-[13px] font-medium text-[#45464d]">Remaining Budget</span>
            <div className={`text-[32px] sm:text-[36px] font-bold mt-1 tracking-tight font-display ${
              remainingBudget > 0 ? 'text-[#006c49]' : 'text-[#0b1c30]'
            }`}>
              {currencySymbol}{remainingBudget.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </div>
          <span
            className={`flex items-center gap-1.5 text-[11px] px-2.5 py-1 rounded-full font-bold ${
              isSafe
                ? 'bg-[#6cf8bb] text-[#00714d]'
                : 'bg-[#ffdad6] text-[#93000a]'
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                isSafe ? 'bg-[#006c49] animate-pulse' : 'bg-[#ba1a1a]'
              }`}
            />
            {totalSpent === 0 ? 'Safe Health' : isSafe ? 'Safe Health' : 'Near Limit'}
          </span>
        </div>
        <div className="mt-4 pt-3 border-t border-[#c6c6cd]/15 flex items-center justify-between text-[12px]">
          <span className="text-[#45464d]">{cycleDaysRemaining} days remaining</span>
          <span className="font-semibold text-[#00714d] bg-[#6cf8bb]/30 px-2 py-0.5 rounded">
            {currencySymbol}{dailyLimit.toFixed(2)} / day limit
          </span>
        </div>
      </div>

      {/* Card 4: Cash vs Online Payment Split */}
      <div
        id="cash-vs-online"
        className="bg-white border border-[#c6c6cd]/30 rounded-xl p-5 shadow-2xs relative overflow-hidden group hover:border-[#c6c6cd] transition-all"
      >
        <div className="flex items-start justify-between">
          <div>
            <span className="text-[13px] font-medium text-[#45464d]">Payment Split Ratio</span>
            <div className="text-[20px] font-bold text-[#0b1c30] mt-1 font-display">
              Cash vs Online
            </div>
          </div>
          <div className="flex items-center text-[12px] text-[#45464d] font-medium">
            {totalTxCount} Total Tx
          </div>
        </div>

        {/* Proportional Dual Bar */}
        <div className="mt-3">
          <div className="flex h-2.5 rounded-full overflow-hidden bg-[#e5eeff]">
            {totalTxCount > 0 ? (
              <>
                <div
                  className="bg-[#76777d] transition-all"
                  style={{ width: `${cashPercentage}%` }}
                  title={`Cash: ${cashPercentage.toFixed(1)}%`}
                />
                <div
                  className="bg-black transition-all"
                  style={{ width: `${onlinePercentage}%` }}
                  title={`Online: ${onlinePercentage.toFixed(1)}%`}
                />
              </>
            ) : (
              <div className="w-full h-full bg-[#e5eeff]" title="No transactions yet" />
            )}
          </div>
        </div>

        {/* Breakdown Labels */}
        <div className="mt-3 pt-2 grid grid-cols-2 gap-2 text-[12px] border-t border-[#c6c6cd]/15">
          <div className="flex flex-col">
            <span className="text-[#45464d] text-[11px] font-medium flex items-center gap-1">
              <span className="w-2 h-2 rounded-2xs bg-[#76777d] inline-block" /> Cash ({cashPercentage.toFixed(1)}%)
            </span>
            <span className="font-bold text-[#0b1c30] mt-0.5">
              {currencySymbol}{cashSpent.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}{' '}
              <span className="font-normal text-[#76777d] text-[11px]">({cashTxCount} tx)</span>
            </span>
          </div>
          <div className="flex flex-col text-right">
            <span className="text-[#45464d] text-[11px] font-medium flex items-center justify-end gap-1">
              <span className="w-2 h-2 rounded-2xs bg-black inline-block" /> Online ({onlinePercentage.toFixed(1)}%)
            </span>
            <span className="font-bold text-[#0b1c30] mt-0.5">
              {currencySymbol}{onlineSpent.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}{' '}
              <span className="font-normal text-[#76777d] text-[11px]">({onlineTxCount} tx)</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
