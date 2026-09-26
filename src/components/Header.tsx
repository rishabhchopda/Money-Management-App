import React from 'react';

interface HeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedMonth: string;
  setSelectedMonth: (month: string) => void;
  onOpenAddTransaction: () => void;
  onOpenExportStatement: () => void;
  onOpenNotifications: () => void;
  onOpenSupport: () => void;
  unreadNotifications: number;
  onToggleMobileMenu: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  searchQuery,
  setSearchQuery,
  selectedMonth,
  setSelectedMonth,
  onOpenAddTransaction,
  onOpenExportStatement,
  onOpenNotifications,
  onOpenSupport,
  unreadNotifications,
  onToggleMobileMenu,
}) => {
  const months = ['August 2024', 'September 2024', 'October 2024', 'November 2024'];
  const currentIndex = months.indexOf(selectedMonth);

  const handlePrevMonth = () => {
    if (currentIndex > 0) {
      setSelectedMonth(months[currentIndex - 1]);
    }
  };

  const handleNextMonth = () => {
    if (currentIndex < months.length - 1) {
      setSelectedMonth(months[currentIndex + 1]);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#f8f9ff]/85 backdrop-blur-md border-b border-[#c6c6cd]/30 flex justify-between items-center h-16 px-4 md:px-8 pl-4 lg:pl-[284px] w-full transition-all">
      {/* Left: Mobile hamburger & Search input */}
      <div className="flex items-center gap-3 md:gap-4 flex-1 max-w-md">
        <button
          onClick={onToggleMobileMenu}
          className="lg:hidden p-2 rounded-lg text-[#0b1c30] hover:bg-[#e5eeff] transition-colors"
          title="Open Menu"
        >
          <span className="material-symbols-outlined text-xl">menu</span>
        </button>

        <div className="relative w-full">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#76777d] text-lg pointer-events-none">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search transactions, categories, tags..."
            className="w-full h-10 pl-9 pr-8 rounded-lg bg-white border border-[#c6c6cd]/40 text-[#0b1c30] text-[13px] focus:outline-none focus:border-black placeholder:text-[#76777d] shadow-2xs transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#76777d] hover:text-[#0b1c30] p-1"
            >
              <span className="material-symbols-outlined text-sm">close</span>
            </button>
          )}
        </div>
      </div>

      {/* Center Context Pill: Month Selector */}
      <div className="hidden lg:flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-[#c6c6cd]/40 shadow-xs">
        <button
          onClick={handlePrevMonth}
          disabled={currentIndex <= 0}
          className="p-1 hover:bg-[#e5eeff] disabled:opacity-40 disabled:hover:bg-transparent rounded transition-colors text-[#45464d] cursor-pointer"
          title="Previous Cycle"
        >
          <span className="material-symbols-outlined text-sm">chevron_left</span>
        </button>
        <span className="text-[13px] font-semibold text-[#0b1c30] px-1 font-display">
          {selectedMonth}
        </span>
        <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#6cf8bb] text-[#00714d] font-semibold">
          Active Cycle
        </span>
        <button
          onClick={handleNextMonth}
          disabled={currentIndex >= months.length - 1}
          className="p-1 hover:bg-[#e5eeff] disabled:opacity-40 disabled:hover:bg-transparent rounded transition-colors text-[#45464d] cursor-pointer"
          title="Next Cycle"
        >
          <span className="material-symbols-outlined text-sm">chevron_right</span>
        </button>
      </div>

      {/* Right Trailing Actions */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Export Statement button */}
        <button
          onClick={onOpenExportStatement}
          className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white border border-[#c6c6cd]/40 text-[#0b1c30] hover:bg-[#eff4ff] transition-colors shadow-2xs text-[13px] font-medium cursor-pointer"
        >
          <span className="material-symbols-outlined text-base text-black">picture_as_pdf</span>
          <span>Export Statement</span>
        </button>

        {/* Notifications */}
        <button
          onClick={onOpenNotifications}
          className="w-10 h-10 rounded-lg flex items-center justify-center text-[#45464d] hover:bg-[#e5eeff] transition-colors relative cursor-pointer"
          title="Notifications"
        >
          <span className="material-symbols-outlined text-xl">notifications</span>
          {unreadNotifications > 0 && (
            <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-[#ba1a1a] ring-2 ring-[#f8f9ff]"></span>
          )}
        </button>

        {/* Help & Guides */}
        <button
          onClick={onOpenSupport}
          className="w-10 h-10 rounded-lg flex items-center justify-center text-[#45464d] hover:bg-[#e5eeff] transition-colors cursor-pointer"
          title="Help & Guides"
        >
          <span className="material-symbols-outlined text-xl">help</span>
        </button>

        {/* Mandatory Trailing Primary Action */}
        <button
          onClick={onOpenAddTransaction}
          className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-lg bg-black text-white text-[13px] font-semibold hover:opacity-90 active:scale-[0.98] transition-all shadow-xs cursor-pointer"
        >
          <span className="material-symbols-outlined text-base">add</span>
          <span className="hidden xs:inline">Add Transaction</span>
          <span className="xs:hidden">Add</span>
        </button>
      </div>
    </header>
  );
};
