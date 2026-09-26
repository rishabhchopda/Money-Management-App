import React, { useState, useEffect } from 'react';
import { BudgetConfig } from '../types/finance';

interface EditBudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: BudgetConfig;
  totalSpent: number;
  onUpdateBudget: (newLimit: number) => void;
}

export const EditBudgetModal: React.FC<EditBudgetModalProps> = ({
  isOpen,
  onClose,
  config,
  totalSpent,
  onUpdateBudget,
}) => {
  const [budgetLimit, setBudgetLimit] = useState(
    config.monthlyBudget > 0 ? config.monthlyBudget.toString() : ''
  );

  useEffect(() => {
    if (isOpen) {
      setBudgetLimit(config.monthlyBudget > 0 ? config.monthlyBudget.toString() : '');
    }
  }, [isOpen, config.monthlyBudget]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(budgetLimit);
    if (!isNaN(val) && val >= 0) {
      onUpdateBudget(val);
      onClose();
    }
  };

  const currentVal = parseFloat(budgetLimit) || 0;
  const previewRemaining = Math.max(0, currentVal - totalSpent);
  const previewPercent = currentVal > 0 ? ((totalSpent / currentVal) * 100).toFixed(1) : '0.0';

  const presets = [2500, 5000, 10000, 25000];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0b1c30]/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white border border-[#c6c6cd]/40 rounded-2xl w-full max-w-md shadow-xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="px-6 py-4 border-b border-[#c6c6cd]/20 flex items-center justify-between bg-[#eff4ff]/40">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-black">tune</span>
            <h3 className="text-[18px] font-bold text-[#0b1c30] font-display">
              {config.monthlyBudget === 0 ? 'Set Monthly Budget' : 'Adjust Monthly Budget'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-[#45464d] hover:bg-[#e5eeff] transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="text-[13px] font-semibold text-[#0b1c30]">
              Total Monthly Cap ({config.currencySymbol})
            </label>
            <div className="relative mt-1">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#76777d] font-bold text-lg pointer-events-none">
                {config.currencySymbol}
              </span>
              <input
                type="number"
                step="50"
                min="0"
                required
                value={budgetLimit}
                onChange={(e) => setBudgetLimit(e.target.value)}
                placeholder="e.g. 5000.00"
                className="w-full h-11 pl-8 pr-4 rounded-lg bg-white border border-[#c6c6cd]/40 text-[#0b1c30] text-lg font-bold focus:outline-none focus:border-black"
                autoFocus
              />
            </div>

            {/* Quick preset buttons */}
            <div className="flex items-center gap-2 mt-2">
              <span className="text-[11px] text-[#76777d]">Quick suggestions:</span>
              {presets.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setBudgetLimit(preset.toString())}
                  className="px-2 py-0.5 text-[11px] font-medium bg-[#eff4ff] hover:bg-[#e5eeff] rounded border border-[#c6c6cd]/30 text-[#0b1c30] cursor-pointer"
                >
                  {config.currencySymbol}{preset.toLocaleString()}
                </button>
              ))}
            </div>

            <p className="text-[12px] text-[#45464d] mt-2">
              Applying this envelope limit will automatically calibrate your baseline daily spending pace and reserve metrics.
            </p>
          </div>

          {/* Quick Preview Badge */}
          {currentVal > 0 && (
            <div className="p-3 bg-[#eff4ff] rounded-xl border border-[#c6c6cd]/20 text-[12px] space-y-1">
              <div className="flex justify-between">
                <span className="text-[#45464d]">Spent so far:</span>
                <span className="font-semibold text-[#0b1c30]">
                  {config.currencySymbol}{totalSpent.toFixed(2)} ({previewPercent}%)
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#45464d]">Calculated Remaining:</span>
                <span className="font-bold text-[#006c49]">
                  {config.currencySymbol}{previewRemaining.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#45464d]">Daily Allowance:</span>
                <span className="font-semibold text-[#0b1c30]">
                  {config.currencySymbol}{(previewRemaining / (config.cycleDaysRemaining || 1)).toFixed(2)} / day
                </span>
              </div>
            </div>
          )}

          <div className="pt-4 border-t border-[#c6c6cd]/20 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-[#eff4ff] text-[#0b1c30] text-[13px] font-medium hover:bg-[#e5eeff] transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-black text-white text-[13px] font-semibold hover:opacity-90 transition-all shadow-sm cursor-pointer"
            >
              Confirm Limit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
