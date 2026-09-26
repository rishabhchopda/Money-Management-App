import React from 'react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenAddTransaction: () => void;
  onOpenExportStatement: () => void;
  onOpenSettings: () => void;
  onOpenSupport: () => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  onOpenAddTransaction,
  onOpenExportStatement,
  onOpenSettings,
  onOpenSupport,
  isMobileOpen,
  setIsMobileOpen,
}) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
    { id: 'daily-breakdown', label: 'Daily Breakdown', icon: 'calendar_today' },
    { id: 'categories-budgets', label: 'Categories & Budgets', icon: 'pie_chart' },
    { id: 'cash-vs-online', label: 'Cash vs. Online', icon: 'payments' },
    { id: 'pdf-export', label: 'PDF Reports & Export', icon: 'picture_as_pdf', isAction: true },
  ];

  const handleNavClick = (item: typeof navItems[0]) => {
    if (item.id === 'pdf-export') {
      onOpenExportStatement();
    } else {
      setActiveTab(item.id);
      const element = document.getElementById(item.id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
    setIsMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-[#0b1c30]/40 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      <aside
        className={`h-screen w-[260px] fixed top-0 left-0 flex flex-col justify-between bg-white border-r border-[#c6c6cd]/30 shadow-sm z-50 transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-4 flex flex-col gap-6">
          {/* Header Brand & Profile */}
          <div className="flex items-center justify-between px-2 py-1">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-black text-white flex items-center justify-center shadow-sm">
                <span className="material-symbols-outlined text-xl">account_balance_wallet</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[18px] font-bold text-[#0b1c30] tracking-tight font-display">Aura Money</span>
                <span className="text-[12px] text-[#45464d]">Premium Wealth</span>
              </div>
            </div>
            {/* Mobile close button */}
            <button
              className="lg:hidden p-1.5 text-[#45464d] hover:bg-[#e5eeff] rounded-lg"
              onClick={() => setIsMobileOpen(false)}
            >
              <span className="material-symbols-outlined text-lg">close</span>
            </button>
          </div>

          {/* Quick Action: CTA Add Transaction */}
          <button
            onClick={onOpenAddTransaction}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-black text-white text-[13px] font-medium shadow-sm hover:opacity-90 active:scale-[0.98] transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-lg">add</span>
            <span>Add Transaction</span>
          </button>

          {/* Primary Navigation Tabs */}
          <nav className="flex flex-col gap-1.5">
            {navItems.map((item) => {
              const isActive = activeTab === item.id && !item.isAction;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all duration-150 cursor-pointer ${
                    isActive
                      ? 'bg-[#e5eeff] text-[#0b1c30] font-semibold shadow-xs'
                      : 'text-[#45464d] font-normal hover:bg-[#eff4ff] hover:text-[#0b1c30]'
                  }`}
                >
                  <span
                    className={`material-symbols-outlined text-xl ${
                      isActive ? 'text-black' : 'text-[#76777d]'
                    }`}
                  >
                    {item.icon}
                  </span>
                  <span className="text-[13px]">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-[#c6c6cd]/20 flex flex-col gap-1">
          <button
            onClick={onOpenSettings}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-[#45464d] hover:bg-[#eff4ff] hover:text-[#0b1c30] transition-colors text-left w-full cursor-pointer"
          >
            <span className="material-symbols-outlined text-xl">settings</span>
            <span className="text-[13px] font-medium">Settings</span>
          </button>
          <button
            onClick={onOpenSupport}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-[#45464d] hover:bg-[#eff4ff] hover:text-[#0b1c30] transition-colors text-left w-full cursor-pointer"
          >
            <span className="material-symbols-outlined text-xl">help</span>
            <span className="text-[13px] font-medium">Support</span>
          </button>

          {/* Current Profile Mini-Widget */}
          <div className="mt-2 pt-3 border-t border-[#c6c6cd]/15 flex items-center justify-between px-2">
            <div className="flex items-center gap-2.5">
              <img
                className="w-8 h-8 rounded-full border border-[#c6c6cd] object-cover"
                alt="Alex Sinclair"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuD1nCoZEdJMsvyasvR15lFCHE9udOJ-r_2UGoHbEaSjVAULLFo93YnpctmmSW2cXH9_Wt5WK326VMToh3aZuHFw5voiorM9gFLkyDKMYq9LIyW2YoGLeaSF3Fsx9T41LiFH_t6_lO5gmLDrOjnNCJMjOyDJQJbODUl5iWHU-59Mpdg00yPDHrR44eUVcA02CxedgEAVIm8D0U4JLihjyl2F8r8X0AWRsOhYyxz1rBsDe6Z-jVxc5ySj"
              />
              <div className="flex flex-col">
                <span className="text-[13px] font-semibold text-[#0b1c30]">Alex Sinclair</span>
                <span className="text-[11px] text-[#45464d]">Tier-1 Private</span>
              </div>
            </div>
            <button
              onClick={onOpenSettings}
              className="p-1 hover:bg-[#eff4ff] rounded text-[#45464d]"
              title="Profile Options"
            >
              <span className="material-symbols-outlined text-base">more_vert</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
