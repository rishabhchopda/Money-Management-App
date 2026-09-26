import React, { useState } from 'react';
import { Category, BudgetConfig } from '../types/finance';

interface AddCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: BudgetConfig;
  onAddCategory: (category: Omit<Category, 'id' | 'spent' | 'cashSpent' | 'onlineSpent'>) => void;
}

export const AddCategoryModal: React.FC<AddCategoryModalProps> = ({
  isOpen,
  onClose,
  config,
  onAddCategory,
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [limit, setLimit] = useState('');
  const [icon, setIcon] = useState('bolt');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numLimit = parseFloat(limit);
    if (!name.trim() || isNaN(numLimit) || numLimit <= 0) return;

    onAddCategory({
      name: name.trim(),
      description: description.trim() || 'Custom envelope',
      limit: numLimit,
      icon,
    });

    setName('');
    setDescription('');
    setLimit('');
    setIcon('bolt');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0b1c30]/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white border border-[#c6c6cd]/40 rounded-2xl w-full max-w-md shadow-xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="px-6 py-4 border-b border-[#c6c6cd]/20 flex items-center justify-between bg-[#eff4ff]/40">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-black">add_circle</span>
            <h3 className="text-[18px] font-bold text-[#0b1c30] font-display">Create New Category</h3>
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
            <label className="text-[13px] font-semibold text-[#0b1c30]">Category Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Subscriptions & SaaS"
              className="w-full h-10 px-3.5 mt-1 rounded-lg bg-white border border-[#c6c6cd]/40 text-[#0b1c30] text-[13px] focus:outline-none focus:border-black"
              autoFocus
            />
          </div>

          <div>
            <label className="text-[13px] font-semibold text-[#0b1c30]">Description / Scope</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Cloud storage, software licenses"
              className="w-full h-10 px-3.5 mt-1 rounded-lg bg-white border border-[#c6c6cd]/40 text-[#0b1c30] text-[13px] focus:outline-none focus:border-black"
            />
          </div>

          <div>
            <label className="text-[13px] font-semibold text-[#0b1c30]">
              Monthly Envelope Limit ({config.currencySymbol})
            </label>
            <input
              type="number"
              step="10"
              min="10"
              required
              value={limit}
              onChange={(e) => setLimit(e.target.value)}
              placeholder="250.00"
              className="w-full h-10 px-3.5 mt-1 rounded-lg bg-white border border-[#c6c6cd]/40 text-[#0b1c30] text-[13px] focus:outline-none focus:border-black"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[13px] font-semibold text-[#0b1c30]">Icon Symbol</label>
              <select
                value={icon}
                onChange={(e) => setIcon(e.target.value)}
                className="w-full h-10 px-3 mt-1 rounded-lg bg-white border border-[#c6c6cd]/40 text-[#0b1c30] text-[13px] focus:outline-none focus:border-black cursor-pointer"
              >
                <option value="bolt">Bolt / Energy</option>
                <option value="flight">Flight / Travel</option>
                <option value="fitness_center">Fitness / Gym</option>
                <option value="devices">Electronics & Tech</option>
                <option value="school">Education / Books</option>
                <option value="celebration">Entertainment / Leisure</option>
                <option value="pets">Pets & Veterinary</option>
                <option value="savings">Investments & Vault</option>
              </select>
            </div>
            <div>
              <label className="text-[13px] font-semibold text-[#0b1c30]">Default Mode</label>
              <select className="w-full h-10 px-3 mt-1 rounded-lg bg-white border border-[#c6c6cd]/40 text-[#0b1c30] text-[13px] focus:outline-none focus:border-black cursor-pointer">
                <option>Online / Auto-draft</option>
                <option>Physical Cash</option>
              </select>
            </div>
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
              Create Envelope
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
