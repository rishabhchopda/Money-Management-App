import { Transaction, DailyData, Category } from '../types/finance';

/**
 * Dynamically computes daily velocity data for the given number of days leading up to today.
 */
export function getDailyVelocityData(daysCount: number, transactions: Transaction[]): DailyData[] {
  const result: DailyData[] = [];
  const today = new Date();
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  for (let i = daysCount - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(today.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];

    const isToday = i === 0;
    const dayLabel = isToday
      ? 'Today'
      : `${dayNames[d.getDay()]} ${String(d.getDate()).padStart(2, '0')}`;

    // Filter transactions for this specific date
    const dayTx = transactions.filter((tx) => tx.date === dateStr);
    const total = dayTx.reduce((sum, tx) => sum + tx.amount, 0);
    const online = dayTx
      .filter((tx) => tx.modality !== 'cash')
      .reduce((sum, tx) => sum + tx.amount, 0);
    const cash = dayTx
      .filter((tx) => tx.modality === 'cash')
      .reduce((sum, tx) => sum + tx.amount, 0);

    result.push({
      dayLabel,
      date: dateStr,
      total,
      online,
      cash,
      isToday,
    });
  }

  return result;
}

/**
 * Calculates category spending directly from the transaction list.
 */
export function calculateCategorySpending(
  baseCategories: Category[],
  transactions: Transaction[]
): Category[] {
  return baseCategories.map((cat) => {
    const catTx = transactions.filter((tx) => tx.category === cat.name);
    const spent = catTx.reduce((sum, tx) => sum + tx.amount, 0);
    const cashSpent = catTx
      .filter((tx) => tx.modality === 'cash')
      .reduce((sum, tx) => sum + tx.amount, 0);
    const onlineSpent = catTx
      .filter((tx) => tx.modality !== 'cash')
      .reduce((sum, tx) => sum + tx.amount, 0);

    return {
      ...cat,
      spent,
      cashSpent,
      onlineSpent,
    };
  });
}

/**
 * Calculates current month cycle info based on today's date.
 */
export function getCurrentCycleInfo() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const totalDaysInMonth = new Date(year, month + 1, 0).getDate();
  const currentDay = now.getDate();
  const daysRemaining = Math.max(1, totalDaysInMonth - currentDay);

  const monthShort = monthNames[month].slice(0, 3);
  const cycle = `${monthShort} 1 - ${monthShort} ${totalDaysInMonth}`;
  const selectedMonth = `${monthNames[month]} ${year}`;

  return {
    cycle,
    totalCycleDays: totalDaysInMonth,
    cycleDaysRemaining: daysRemaining,
    selectedMonth,
  };
}
