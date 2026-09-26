import React, { useState } from 'react';
import { BudgetConfig } from '../types/finance';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: BudgetConfig;
  onUpdateConfig: (newConfig: Partial<BudgetConfig>) => void;
  onResetToZero: () => void;
  onLoadSampleData: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  config,
  onUpdateConfig,
  onResetToZero,
  onLoadSampleData,
}) => {
  const [currency, setCurrency] = useState(config.currencySymbol);
  const [baseline, setBaseline] = useState(config.baselineDailyCap.toString());
  const [resetConfirm, setResetConfirm] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const numBaseline = parseFloat(baseline);
    onUpdateConfig({
      currencySymbol: currency,
      baselineDailyCap: isNaN(numBaseline) ? 0 : numBaseline,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0b1c30]/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white border border-[#c6c6cd]/40 rounded-2xl w-full max-w-md shadow-xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="px-6 py-4 border-b border-[#c6c6cd]/20 flex items-center justify-between bg-[#eff4ff]/40">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-black">settings</span>
            <h3 className="text-[18px] font-bold text-[#0b1c30] font-display">Ledger Settings</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-[#45464d] hover:bg-[#e5eeff] transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        <form onSubmit={handleSave} className="p-6 space-y-4">
          <div>
            <label className="text-[13px] font-semibold text-[#0b1c30]">Preferred Currency</label>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="w-full h-10 px-3 mt-1 rounded-lg bg-white border border-[#c6c6cd]/40 text-[#0b1c30] text-[13px] focus:outline-none focus:border-black cursor-pointer"
            >
              <option value="₹">₹ - Indian Rupee (INR)</option>
              <option value="$">$ - US Dollar (USD)</option>
              <option value="€">€ - Euro (EUR)</option>
              <option value="£">£ - British Pound (GBP)</option>
              <option value="¥">¥ - Japanese Yen (JPY)</option>
              <option value="A$">A$ - Australian Dollar (AUD)</option>
            </select>
          </div>

          <div>
            <label className="text-[13px] font-semibold text-[#0b1c30]">
              Daily Baseline Cap ({currency})
            </label>
            <input
              type="number"
              step="1"
              value={baseline}
              onChange={(e) => setBaseline(e.target.value)}
              placeholder="e.g. 150"
              className="w-full h-10 px-3.5 mt-1 rounded-lg bg-white border border-[#c6c6cd]/40 text-[#0b1c30] text-[13px] focus:outline-none focus:border-black"
            />
            <p className="text-[11px] text-[#45464d] mt-1">
              Benchmark limit for daily velocity pacing alerts.
            </p>
          </div>

          <div className="pt-3 border-t border-[#c6c6cd]/20 space-y-3">
            <div>
              <h4 className="text-[13px] font-semibold text-[#0b1c30] mb-0.5">Real Budget Controls</h4>
              <p className="text-[11px] text-[#45464d]">
                Control and toggle between real zero ledger state or test sample records.
              </p>
            </div>

            {resetConfirm ? (
              <div className="p-3 bg-[#ffdad6]/60 rounded-lg flex items-center justify-between gap-2">
                <span className="text-[12px] text-[#93000a] font-medium">Reset all to clean zero?</span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setResetConfirm(false)}
                    className="px-2.5 py-1 text-[11px] bg-white rounded border border-[#c6c6cd] cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onResetToZero();
                      setResetConfirm(false);
                      onClose();
                    }}
                    className="px-2.5 py-1 text-[11px] bg-[#ba1a1a] text-white rounded font-semibold cursor-pointer"
                  >
                    Confirm Zero
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => setResetConfirm(true)}
                  className="text-[12px] text-[#ba1a1a] hover:underline font-medium flex items-center gap-1.5 cursor-pointer text-left"
                >
                  <span className="material-symbols-outlined text-sm">restart_alt</span>
                  Reset Ledger to Clean Zero
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onLoadSampleData();
                    onClose();
                  }}
                  className="text-[12px] text-[#006c49] hover:underline font-medium flex items-center gap-1.5 cursor-pointer text-left"
                >
                  <span className="material-symbols-outlined text-sm">science</span>
                  Load Sample Preview Transactions
                </button>
              </div>
            )}
          </div>

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
              Save Preferences
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
