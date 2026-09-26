import React from 'react';

interface SupportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SupportModal: React.FC<SupportModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0b1c30]/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white border border-[#c6c6cd]/40 rounded-2xl w-full max-w-md shadow-xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="px-6 py-4 border-b border-[#c6c6cd]/20 flex items-center justify-between bg-[#eff4ff]/40">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-black">help</span>
            <h3 className="text-[18px] font-bold text-[#0b1c30] font-display">Concierge &amp; Support</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-[#45464d] hover:bg-[#e5eeff] transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        <div className="p-6 space-y-4 text-[13px] text-[#0b1c30]">
          <div className="p-4 bg-[#eff4ff] rounded-xl border border-[#c6c6cd]/20">
            <div className="flex items-center gap-2 text-black font-semibold">
              <span className="material-symbols-outlined text-lg">verified_user</span>
              <span>Tier-1 Private Wealth Concierge</span>
            </div>
            <p className="text-[12px] text-[#45464d] mt-1">
              Direct access to chartered private wealth advisors and institutional portfolio custodians.
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="font-bold text-[#0b1c30]">Frequently Asked Questions</h4>
            <div className="border border-[#c6c6cd]/20 rounded-lg p-3">
              <p className="font-semibold text-[#0b1c30]">How is Daily Baseline Cap calculated?</p>
              <p className="text-[12px] text-[#45464d] mt-0.5">
                Total monthly envelope divided by 31 days. Spending exceeding ₹150 triggers an over-pacing alert.
              </p>
            </div>

            <div className="border border-[#c6c6cd]/20 rounded-lg p-3">
              <p className="font-semibold text-[#0b1c30]">Can I export statements for tax audits?</p>
              <p className="text-[12px] text-[#45464d] mt-0.5">
                Yes. Click "Export Statement" to generate a verified financial statement with cryptographic hash validation.
              </p>
            </div>
          </div>

          <div className="pt-3 border-t border-[#c6c6cd]/20 flex items-center justify-between">
            <span className="text-[11px] text-[#76777d]">Need assistance? support@auramoney.private</span>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-black text-white text-[12px] font-semibold hover:opacity-90 transition-all cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
