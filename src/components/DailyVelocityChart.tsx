import React, { useState } from 'react';
import { DailyData, BudgetConfig } from '../types/finance';

interface DailyVelocityChartProps {
  data7Days: DailyData[];
  data14Days: DailyData[];
  data30Days: DailyData[];
  config: BudgetConfig;
}

export const DailyVelocityChart: React.FC<DailyVelocityChartProps> = ({
  data7Days,
  data14Days,
  data30Days,
  config,
}) => {
  const [timeRange, setTimeRange] = useState<'7' | '14' | 'month'>('7');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Selected dataset
  const activeData =
    timeRange === '7' ? data7Days : timeRange === '14' ? data14Days : data30Days;

  // Maximum value for scaling the bars relative to max height
  const highestTotal = Math.max(0, ...activeData.map((d) => d.total));
  const maxVal = Math.max(highestTotal, config.baselineDailyCap * 1.25, 100);

  // Calculate daily average
  const totalDaysWithSpend = activeData.reduce((acc, curr) => acc + curr.total, 0);
  const dailyAverage = totalDaysWithSpend / (activeData.length || 1);
  const baselineCap = config.baselineDailyCap;

  // Today's run-rate delta
  const todayItem = activeData.find((d) => d.isToday) || activeData[activeData.length - 1];
  const todayTotal = todayItem ? todayItem.total : 0;
  const todayDelta = baselineCap - todayTotal;
  const isUnderDailyCeiling = todayDelta >= 0;

  return (
    <section id="daily-breakdown" className="bg-white border border-[#c6c6cd]/30 rounded-xl p-6 shadow-2xs">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-5 border-b border-[#c6c6cd]/20 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-black">calendar_month</span>
            <h2 className="text-[18px] font-bold text-[#0b1c30] font-display">Daily Velocity &amp; Timeline</h2>
          </div>
          <p className="text-[12px] text-[#45464d] mt-0.5">
            Continuous pacing metric benchmarked against daily baseline allowance.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="bg-[#eff4ff] px-3 py-1.5 rounded-lg border border-[#c6c6cd]/20 flex items-center gap-3 text-[12px] text-[#45464d]">
            <div>
              Daily Average: <span className="font-bold text-[#0b1c30]">{config.currencySymbol}{dailyAverage.toFixed(2)} / day</span>
            </div>
            {baselineCap > 0 && (
              <>
                <div className="h-4 w-[1px] bg-[#c6c6cd]/40"></div>
                <div>
                  Baseline Cap: <span className="font-semibold text-[#006c49]">{config.currencySymbol}{baselineCap.toFixed(2)} / day</span>
                </div>
              </>
            )}
          </div>

          {/* Segmented Pill Range Switcher */}
          <div className="flex items-center bg-[#e5eeff] p-1 rounded-lg">
            <button
              onClick={() => setTimeRange('7')}
              className={`px-3 py-1 rounded-md text-[11px] font-semibold transition-all cursor-pointer ${
                timeRange === '7'
                  ? 'bg-white text-[#0b1c30] shadow-xs'
                  : 'text-[#45464d] hover:text-[#0b1c30]'
              }`}
            >
              7 Days
            </button>
            <button
              onClick={() => setTimeRange('14')}
              className={`px-3 py-1 rounded-md text-[11px] font-semibold transition-all cursor-pointer ${
                timeRange === '14'
                  ? 'bg-white text-[#0b1c30] shadow-xs'
                  : 'text-[#45464d] hover:text-[#0b1c30]'
              }`}
            >
              14 Days
            </button>
            <button
              onClick={() => setTimeRange('month')}
              className={`px-3 py-1 rounded-md text-[11px] font-semibold transition-all cursor-pointer ${
                timeRange === 'month'
                  ? 'bg-white text-[#0b1c30] shadow-xs'
                  : 'text-[#45464d] hover:text-[#0b1c30]'
              }`}
            >
              Month
            </button>
          </div>
        </div>
      </div>

      {/* Visual Bar Chart */}
      <div className="mt-6">
        <div className="h-48 w-full flex items-end justify-between gap-1 sm:gap-2.5 pt-6 pb-2 px-1 relative">
          {/* Baseline Cap Reference Line (only if cap > 0) */}
          {baselineCap > 0 && (
            <div
              className="absolute left-0 right-0 border-t border-dashed border-[#006c49]/40 z-0 pointer-events-none flex justify-end"
              style={{ bottom: `${Math.min(85, (baselineCap / maxVal) * 85) + 24}px` }}
            >
              <span className="text-[10px] text-[#006c49] font-medium px-1 bg-white/80 rounded -translate-y-1/2">
                Cap: {config.currencySymbol}{baselineCap.toFixed(0)}
              </span>
            </div>
          )}

          {activeData.map((item, idx) => {
            const hasSpend = item.total > 0;
            const heightPercent = hasSpend
              ? Math.max(16, Math.min(95, (item.total / maxVal) * 100))
              : 6; // Minimal clean baseline marker when 0

            const isOverPacing = baselineCap > 0 ? item.total > baselineCap : item.total > 150;
            const onlineRatio = hasSpend ? (item.online / item.total) * 100 : 0;
            const isHovered = hoveredIndex === idx;

            return (
              <div
                key={item.date + idx}
                className="flex-1 flex flex-col items-center gap-2 group relative z-10"
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {/* Floating tooltip/amount on hover */}
                <div
                  className={`text-[11px] sm:text-[12px] font-bold transition-all duration-200 truncate ${
                    item.isToday
                      ? 'text-[#006c49] opacity-100 font-bold'
                      : isOverPacing
                      ? 'text-[#ba1a1a] opacity-0 group-hover:opacity-100'
                      : 'text-[#0b1c30] opacity-0 group-hover:opacity-100'
                  }`}
                >
                  {hasSpend ? `${config.currencySymbol}${item.total.toFixed(0)}` : '—'}
                </div>

                {/* Bar */}
                <div
                  className={`w-full max-w-[44px] rounded-t-lg transition-all duration-300 relative flex flex-col justify-end overflow-hidden ${
                    item.isToday
                      ? 'bg-[#6cf8bb]/30 border-2 border-[#006c49] shadow-xs'
                      : isOverPacing
                      ? 'bg-[#ffdad6]/60 border border-[#ba1a1a]/40'
                      : hasSpend
                      ? 'bg-[#e5eeff] group-hover:bg-[#dce9ff]'
                      : 'bg-[#e5eeff]/70 group-hover:bg-[#dce9ff]'
                  }`}
                  style={{ height: `${heightPercent}%` }}
                >
                  {/* Inside fill representing online transactions velocity */}
                  {hasSpend && (
                    <div
                      className={`w-full transition-all ${
                        item.isToday
                          ? 'bg-[#006c49]'
                          : isOverPacing
                          ? 'bg-[#ba1a1a]'
                          : 'bg-black'
                      }`}
                      style={{ height: `${onlineRatio}%` }}
                      title={`Online: ${config.currencySymbol}${item.online.toFixed(2)} | Cash: ${config.currencySymbol}${item.cash.toFixed(2)}`}
                    />
                  )}
                </div>

                {/* Day label */}
                <span
                  className={`text-[10px] sm:text-[11px] transition-colors whitespace-nowrap ${
                    item.isToday
                      ? 'text-[#006c49] font-bold flex items-center gap-0.5'
                      : isOverPacing
                      ? 'text-[#ba1a1a] font-semibold'
                      : 'text-[#45464d]'
                  }`}
                >
                  {item.dayLabel}
                </span>

                {/* Detail card on hover */}
                {isHovered && (
                  <div className="absolute -top-16 bg-[#131b2e] text-white p-2 rounded-lg text-[10px] shadow-lg whitespace-nowrap z-30 pointer-events-none">
                    <p className="font-semibold">{item.date} {item.isToday ? '(Today)' : ''}</p>
                    {hasSpend ? (
                      <>
                        <p className="text-[#6cf8bb]">Total: {config.currencySymbol}{item.total.toFixed(2)}</p>
                        <p className="text-[#c6c6cd]">
                          Online: {config.currencySymbol}{item.online.toFixed(2)} • Cash: {config.currencySymbol}{item.cash.toFixed(2)}
                        </p>
                      </>
                    ) : (
                      <p className="text-[#c6c6cd]">No expenses recorded</p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom Legend & Daily Strip */}
        <div className="mt-4 pt-3 border-t border-[#c6c6cd]/15 flex flex-wrap items-center justify-between gap-4 text-[12px] text-[#45464d]">
          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-2xs bg-black inline-block"></span>
              Online / Card Velocity
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-2xs bg-[#e5eeff] inline-block border border-[#c6c6cd]/40"></span>
              Cash Transactions
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-2xs bg-[#ba1a1a] inline-block"></span>
              Over-Pacing Alert
            </span>
          </div>
          <div>
            Today's run-rate:{' '}
            <span className={`font-semibold ${isUnderDailyCeiling ? 'text-[#006c49]' : 'text-[#ba1a1a]'}`}>
              {baselineCap > 0
                ? isUnderDailyCeiling
                  ? `${config.currencySymbol}${todayDelta.toFixed(2)} under daily ceiling`
                  : `${config.currencySymbol}${Math.abs(todayDelta).toFixed(2)} over daily ceiling`
                : `${config.currencySymbol}${todayTotal.toFixed(2)} spent today`}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
