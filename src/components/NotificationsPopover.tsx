import React from 'react';

interface NotificationsPopoverProps {
  isOpen: boolean;
  onClose: () => void;
  onClear: () => void;
  currencySymbol: string;
}

export const NotificationsPopover: React.FC<NotificationsPopoverProps> = ({
  isOpen,
  onClose,
  onClear,
  currencySymbol,
}) => {
  if (!isOpen) return null;

  const notifications = [
    {
      id: 'notif-1',
      title: 'Over-Pacing Threshold Alert',
      message: `Dining & Coffee exceeded budget envelope by ${currencySymbol}20.00.`,
      time: '12m ago',
      type: 'warning',
      icon: 'warning',
    },
    {
      id: 'notif-2',
      title: 'Ledger Synchronized',
      message: 'Bank reconciliation completed with 64 transactions verified.',
      time: '2m ago',
      type: 'success',
      icon: 'check_circle',
    },
    {
      id: 'notif-3',
      title: 'Safe Health Status',
      message: `${currencySymbol}1,659.50 reserve remaining for 11 days.`,
      time: '1h ago',
      type: 'info',
      icon: 'shield',
    },
  ];

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div className="absolute right-4 sm:right-8 top-16 z-50 w-80 sm:w-96 bg-white border border-[#c6c6cd]/40 rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="p-4 border-b border-[#c6c6cd]/20 flex items-center justify-between bg-[#eff4ff]/40">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-black text-lg">notifications</span>
            <span className="text-[14px] font-bold text-[#0b1c30] font-display">Notifications</span>
          </div>
          <button
            onClick={onClear}
            className="text-[11px] text-[#45464d] hover:text-black font-medium cursor-pointer"
          >
            Mark all read
          </button>
        </div>

        <div className="divide-y divide-[#c6c6cd]/15 max-h-80 overflow-y-auto custom-scroll">
          {notifications.map((n) => (
            <div key={n.id} className="p-3.5 hover:bg-[#eff4ff]/50 transition-colors flex items-start gap-3">
              <span
                className={`material-symbols-outlined text-lg mt-0.5 shrink-0 ${
                  n.type === 'warning'
                    ? 'text-[#ba1a1a]'
                    : n.type === 'success'
                    ? 'text-[#006c49]'
                    : 'text-[#131b2e]'
                }`}
              >
                {n.icon}
              </span>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-[12px] font-bold text-[#0b1c30]">{n.title}</h4>
                  <span className="text-[10px] text-[#76777d]">{n.time}</span>
                </div>
                <p className="text-[11px] text-[#45464d] mt-0.5 leading-normal">{n.message}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};
