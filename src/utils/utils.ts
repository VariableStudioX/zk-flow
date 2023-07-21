import { Transaction, TransactionData } from '../services/explorer.ts';

const getTimeAgo = (date: string) => {
  const seconds = (new Date().getTime() - new Date(date).getTime()) / 1000;

  if (seconds < 60) {
    return Math.round(seconds) + ' second' + (seconds === 1 ? '' : 's') + ' ago';
  }

  const minutes = seconds / 60;
  if (minutes < 60) {
    return Math.round(minutes) + ' minute' + (minutes === 1 ? '' : 's') + ' ago';
  }

  const hours = minutes / 60;
  if (hours < 24) {
    return Math.round(hours) + ' hour' + (hours === 1 ? '' : 's') + ' ago';
  }

  const days = hours / 24;
  return Math.round(days) + ' day' + (days === 1 ? '' : 's') + ' ago';
};

const countAllTransactionPeriods = (
  address: string,
  transactions: Transaction[],
): {
  days: number;
  weeks: number;
  months: number;
} => {
  const uniqueDays: Set<string> = new Set();
  const uniqueWeeks: Set<string> = new Set();
  const uniqueMonths: Set<string> = new Set();

  transactions.forEach((transaction) => {
    if (transaction.from.toLowerCase() !== address.toLowerCase()) return;

    const timestamp = new Date(transaction.receivedAt);
    const year = timestamp.getFullYear();
    const month = timestamp.getMonth();
    const day = timestamp.getDate();
    const week = getWeekNumber(timestamp);

    uniqueDays.add(`${year}-${month}-${day}`);
    uniqueWeeks.add(`${year}-${week}`);
    uniqueMonths.add(`${year}-${month}`);
  });

  return {
    days: uniqueDays.size,
    weeks: uniqueWeeks.size,
    months: uniqueMonths.size,
  };
};

const countTransactionPeriods = (
  address: string,
  transactions: Transaction[],
  protocol: string,
  addresses: string[] = [],
): {
  days: number;
  weeks: number;
  months: number;
} => {
  address;
  protocol;
  const uniqueDays: Set<string> = new Set();
  const uniqueWeeks: Set<string> = new Set();
  const uniqueMonths: Set<string> = new Set();

  transactions.forEach((transaction) => {
    if (
      protocol !== 'zksynceraportal' &&
      !addresses.includes(transaction.to.toLowerCase()) &&
      !addresses.includes(transaction.from.toLowerCase())
    )
      return;

    if (protocol === 'zksynceraportal') {
      if (
        !transaction.data.startsWith('0x51cff8d9') &&
        !(transaction.to.toLowerCase() === address.toLowerCase() && transaction.isL1Originated)
      )
        return;
    }
    const timestamp = new Date(transaction.receivedAt);
    const year = timestamp.getFullYear();
    const month = timestamp.getMonth();
    const day = timestamp.getDate();
    const week = getWeekNumber(timestamp);

    uniqueDays.add(`${year}-${month}-${day}`);
    uniqueWeeks.add(`${year}-${week}`);
    uniqueMonths.add(`${year}-${month}`);
  });

  return {
    days: uniqueDays.size,
    weeks: uniqueWeeks.size,
    months: uniqueMonths.size,
  };
};

const getWeekNumber = (date: Date): string => {
  const year = date.getFullYear();
  const oneJan = new Date(year, 0, 1);
  const dayIndex = (date.getDay() + 6) % 7;
  const daysSinceFirstDay = Math.floor((date.getTime() - oneJan.getTime()) / 86400000);
  const weekIndex = Math.floor((daysSinceFirstDay + oneJan.getDay() - dayIndex) / 7);

  return `${year}-${weekIndex}`;
};
const dataTransform = (address: string, transactions: Transaction[], index: number): TransactionData => {
  const orginTransactions = [...transactions];

  let interactions = 0;
  let interactionsChange = 0;

  let fees = 0;
  let feesChange = 0;

  let volume = 0;
  let volumeChange = 0;

  transactions.forEach((transaction) => {
    
    // interactions
    if (transaction.from.toLowerCase() === address.toLowerCase()) {
      interactions = interactions + 1;
      if (new Date(transaction.receivedAt).getTime() >= new Date().getTime() - 86400 * 7 * 1000) {
        interactionsChange = interactionsChange + 1;
      }
    }

    // volume
    const transfers = transaction.transfers.sort(
      (a, b) =>
        parseInt(b.amount) * 10 ** -b.token.decimals * b.token.price -
        parseInt(a.amount) * 10 ** -a.token.decimals * a.token.price,
    );
    if (transfers.length === 0) return;
    const tmpVolume = parseInt(transfers[0].amount) * 10 ** -transfers[0].token.decimals * transfers[0].token.price;
    volume = volume + tmpVolume;
    if (new Date(transaction.receivedAt).getTime() >= new Date().getTime() - 86400 * 7 * 1000) {
      volumeChange = volumeChange + tmpVolume;
    }

    // fee
    const tmpFees = parseInt(transaction.fee, 16) * 10 ** -18 * transaction.ethValue;
    fees = fees + tmpFees;
    if (new Date(transaction.receivedAt).getTime() >= new Date().getTime() - 86400 * 7 * 1000) {
      feesChange = feesChange + tmpFees;
    }
  });

  return {
    transactions: orginTransactions,
    interactions,
    interactions7Change: interactionsChange,
    volume,
    volume7Change: volumeChange,
    fees,
    fees7Change: feesChange,
    index,
    address
  };
};
export { getTimeAgo, countTransactionPeriods, getWeekNumber, countAllTransactionPeriods, dataTransform };
