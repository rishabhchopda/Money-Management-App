import React from 'react';
import { Category, BudgetConfig } from '../types/finance';

interface CategoryGridProps {
  categories: Category[];
  config: BudgetConfig;
  onOpenAddCategory: () => void;
  onSelectCategoryFilter: (categoryName: string) => void;
}

export const CategoryGrid: React.FC<CategoryGridProps> = ({
  categories,
  config,
  onOpenAddCategory,
  onSelectCategoryFilter,
}) => {
  return (
    <section id="categories-budgets" className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-black">pie_chart</span>
            <h2 className="text-[18px] font-bold text-[#0b1c30] font-display">Categories &amp; Envelopes</h2>
          </div>
          <p className="text-[12px] text-[#45464d] mt-0.5">
            Allocated envelope caps, current month utilization, and channel proportions.
          </p>
        </div>
        <button
          onClick={onOpenAddCategory}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white border border-[#c6c6cd]/40 text-[#0b1c30] hover:bg-[#eff4ff] transition-colors shadow-2xs text-[13px] font-medium cursor-pointer self-start sm:self-auto"
        >
          <span className="material-symbols-outlined text-lg text-black">add_circle</span>
          <span>Add New Category</span>
        </button>
      </div>

      {/* Category Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {categories.map((cat) => {
          const isOverBudget = cat.spent > cat.limit;
          const variance = cat.limit - cat.spent;
          const percentage = Math.min(100, (cat.spent / (cat.limit || 1)) * 100);

          return (
            <div
              key={cat.id}
              className={`bg-white border rounded-xl p-5 shadow-2xs hover:border-[#76777d] transition-all cursor-pointer group ${
                isOverBudget ? 'border-[#ba1a1a]/30' : 'border-[#c6c6cd]/30'
              }`}
              onClick={() => onSelectCategoryFilter(cat.name)}
              title="Click to filter transactions for this category"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
                      isOverBudget
                        ? 'bg-[#ffdad6]/60 text-[#ba1a1a]'
                        : 'bg-[#e5eeff] text-black group-hover:bg-[#dce9ff]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-xl">{cat.icon}</span>
                  </div>
                  <div>
                    <h3 className="text-[13px] font-bold text-[#0b1c30]">{cat.name}</h3>
                    <span className="text-[12px] text-[#45464d]">{cat.description}</span>
                  </div>
                </div>

                {isOverBudget ? (
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#ffdad6] text-[#93000a] font-bold">
                    Over by {config.currencySymbol}{Math.abs(variance).toFixed(0)}
                  </span>
                ) : (
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#6cf8bb] text-[#00714d] font-semibold">
                    {config.currencySymbol}{variance.toFixed(0)} left
                  </span>
                )}
              </div>

              <div className="mt-4 flex items-baseline justify-between">
                <span
                  className={`text-[18px] font-bold font-display ${
                    isOverBudget ? 'text-[#ba1a1a]' : 'text-[#0b1c30]'
                  }`}
                >
                  {config.currencySymbol}{cat.spent.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
                <span className="text-[12px] text-[#45464d]">
                  Limit: {config.currencySymbol}{cat.limit.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>

              {/* Progress Bar */}
              <div className="mt-2 w-full bg-[#e5eeff] h-2 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    isOverBudget ? 'bg-[#ba1a1a]' : 'bg-black'
                  }`}
                  style={{ width: `${percentage}%` }}
                />
              </div>

              {/* Cash vs Online within Category */}
              <div className="mt-4 pt-3 border-t border-[#c6c6cd]/15 flex items-center justify-between text-[12px] text-[#45464d]">
                <span className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-sm">payments</span> Cash: {config.currencySymbol}
                  {cat.cashSpent.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-sm">credit_card</span> Online: {config.currencySymbol}
                  {cat.onlineSpent.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
