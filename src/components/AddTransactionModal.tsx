import React, { useState } from 'react';
import { Category, PaymentModality, Transaction } from '../types/finance';

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  currencySymbol: string;
  onAddTransaction: (newTx: Omit<Transaction, 'id'>) => void;
}

export const AddTransactionModal: React.FC<AddTransactionModalProps> = ({
  isOpen,
  onClose,
  categories,
  currencySymbol,
  onAddTransaction,
}) => {
  const [amount, setAmount] = useState('');
  const [merchant, setMerchant] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [category, setCategory] = useState(categories[0]?.name || 'Food & Groceries');
  const [modality, setModality] = useState<PaymentModality>('online');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) return;

    // Generate initials
    const words = merchant.trim().split(' ');
    let initials = '';
    if (words.length >= 2) {
      initials = (words[0][0] + words[1][0]).toUpperCase();
    } else if (words.length === 1 && words[0].length >= 2) {
      initials = words[0].slice(0, 2).toUpperCase();
    } else {
      initials = 'TX';
    }

    // Format display date
    const d = new Date(date);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const displayDate = `${months[d.getMonth()]} ${String(d.getDate()).padStart(2, '0')}, ${d.getFullYear()}`;

    const modalityLabel =
      modality === 'cash'
        ? 'Cash Spend'
        : modality === 'online_ach'
        ? 'Online ACH'
        : 'Online / Card';

    onAddTransaction({
      date,
      displayDate,
      merchant: merchant.trim(),
      subtitle: subtitle.trim() || 'General expense',
      initials,
      category,
      modality,
      modalityLabel,
      status: 'Cleared',
      amount: numAmount,
    });

    // Reset & close
    setAmount('');
    setMerchant('');
    setSubtitle('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0b1c30]/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white border border-[#c6c6cd]/40 rounded-2xl w-full max-w-lg shadow-xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="px-6 py-4 border-b border-[#c6c6cd]/20 flex items-center justify-between bg-[#eff4ff]/40">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-black">add_card</span>
            <h3 className="text-[18px] font-bold text-[#0b1c30] font-display">Record New Transaction</h3>
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
              Amount ({currencySymbol})
            </label>
            <div className="relative mt-1">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#76777d] font-bold text-lg pointer-events-none">
                {currencySymbol}
              </span>
              <input
                type="number"
                step="0.01"
                min="0.01"
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full h-11 pl-8 pr-4 rounded-lg bg-white border border-[#c6c6cd]/40 text-[#0b1c30] text-lg font-bold focus:outline-none focus:border-black"
                autoFocus
              />
            </div>
          </div>

          <div>
            <label className="text-[13px] font-semibold text-[#0b1c30]">
              Merchant / Description
            </label>
            <input
              type="text"
              required
              value={merchant}
              onChange={(e) => setMerchant(e.target.value)}
              placeholder="e.g. Organic Green Grocer"
              className="w-full h-10 px-3.5 mt-1 rounded-lg bg-white border border-[#c6c6cd]/40 text-[#0b1c30] text-[13px] focus:outline-none focus:border-black"
            />
          </div>

          <div>
            <label className="text-[13px] font-semibold text-[#0b1c30]">
              Note / Memo
            </label>
            <input
              type="text"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              placeholder="e.g. Weekly pantry supplies & organic items"
              className="w-full h-10 px-3.5 mt-1 rounded-lg bg-white border border-[#c6c6cd]/40 text-[#0b1c30] text-[13px] focus:outline-none focus:border-black"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[13px] font-semibold text-[#0b1c30]">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full h-10 px-3 mt-1 rounded-lg bg-white border border-[#c6c6cd]/40 text-[#0b1c30] text-[13px] focus:outline-none focus:border-black cursor-pointer"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[13px] font-semibold text-[#0b1c30]">
                Payment Modality
              </label>
              <select
                value={modality}
                onChange={(e) => setModality(e.target.value as PaymentModality)}
                className="w-full h-10 px-3 mt-1 rounded-lg bg-white border border-[#c6c6cd]/40 text-[#0b1c30] text-[13px] focus:outline-none focus:border-black cursor-pointer"
              >
                <option value="online">Online / Card / UPI</option>
                <option value="cash">Cash / Physical</option>
                <option value="online_ach">Online ACH / Draft</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-[13px] font-semibold text-[#0b1c30]">
              Transaction Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full h-10 px-3.5 mt-1 rounded-lg bg-white border border-[#c6c6cd]/40 text-[#0b1c30] text-[13px] focus:outline-none focus:border-black"
            />
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
              Save Transaction
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
