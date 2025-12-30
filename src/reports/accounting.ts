import {
  JournalEntry,
  LedgerAccount,
  ProfitLossAccount,
  BalanceSheet,
  Transaction,
  Category,
  Ledger,
  ExchangeRate,
} from "@/types/accounting";
import { format, startOfMonth, endOfMonth, addMonths, subMonths } from "date-fns";
import { convertAmount } from "@/utils/currency";

export const getJournalEntries = (
  startDate: Date,
  endDate: Date,
  vouchers: any[], // Will use actual Voucher type later
  ledgers: Ledger[],
  baseCurrency: string
): JournalEntry[] => {
  console.warn("getJournalEntries: Logic needs to be implemented based on new Voucher structure.");
  return [];
};

export const getLedgerAccounts = (
  startDate: Date,
  endDate: Date,
  vouchers: any[], // Will use actual Voucher type later
  ledgers: Ledger[],
  baseCurrency: string
): { [accountName: string]: LedgerAccount } => {
  console.warn("getLedgerAccounts: Logic needs to be implemented based on new Ledger and Voucher structure.");
  // For now, return a dummy structure for existing components to not break
  const dummyAccount: LedgerAccount = {
    name: "Cash (Dummy)",
    entries: [
      { date: format(startDate, 'yyyy-MM-dd'), description: "Opening Balance", type: "debit", amount: 1000, balance: 1000 },
      { date: format(addMonths(startDate, 1), 'yyyy-MM-dd'), description: "Dummy Income", type: "credit", amount: 500, balance: 1500 },
    ],
    finalBalance: 1500,
  };
  return { "Cash (Dummy)": dummyAccount };
};

export const getProfitLossAccount = (
  startDate: Date,
  endDate: Date,
  transactions: Transaction[],
  categories: Category[],
  baseCurrency: string,
  exchangeRates: ExchangeRate
): ProfitLossAccount => {
  const income = transactions
    .filter(
      (t) =>
        t.type === "income" &&
        new Date(t.date) >= startDate &&
        new Date(t.date) <= endDate
    )
    .reduce(
      (sum, t) => sum + convertAmount(t.amount, t.currency, baseCurrency, exchangeRates),
      0
    );
  const expenses = transactions
    .filter(
      (t) =>
        t.type === "expense" &&
        new Date(t.date) >= startDate &&
        new Date(t.date) <= endDate
    )
    .reduce(
      (sum, t) => sum + convertAmount(t.amount, t.currency, baseCurrency, exchangeRates),
      0
    );

  const incomeBreakdown = categories
    .map((cat) => ({
      category: cat.name,
      amount: transactions
        .filter(
          (t) =>
            t.type === "income" &&
            t.category === cat.id &&
            new Date(t.date) >= startDate &&
            new Date(t.date) <= endDate
        )
        .reduce(
          (sum, t) => sum + convertAmount(t.amount, t.currency, baseCurrency, exchangeRates),
          0
        ),
    }))
    .filter((item) => item.amount > 0);

  const expenseBreakdown = categories
    .map((cat) => ({
      category: cat.name,
      amount: transactions
        .filter(
          (t) =>
            t.type === "expense" &&
            t.category === cat.id &&
            new Date(t.date) >= startDate &&
            new Date(t.date) <= endDate
        )
        .reduce(
          (sum, t) => sum + convertAmount(t.amount, t.currency, baseCurrency, exchangeRates),
          0
        ),
    }))
    .filter((item) => item.amount > 0);

  return {
    period: `${format(startDate, "MMM yyyy")} - ${format(endDate, "MMM yyyy")}`,
    totalIncome: income,
    totalExpenses: expenses,
    netProfitLoss: income - expenses,
    incomeBreakdown,
    expenseBreakdown,
  };
};

export const getBalanceSheet = (
  endDate: Date,
  ledgers: Ledger[],
  baseCurrency: string,
  exchangeRates: ExchangeRate
): BalanceSheet => {
  console.warn("getBalanceSheet: Logic needs to be implemented based on new Ledger structure.");
  // Dummy data for now
  const totalAssets = 10000;
  const totalLiabilities = 3000;
  const equity = totalAssets - totalLiabilities;

  return {
    date: format(endDate, "PPP"),
    assets: [
      { name: "Cash", amount: 2000 },
      { name: "Bank", amount: 5000 },
      { name: "Investments", amount: 3000 },
    ],
    totalAssets,
    liabilities: [
      { name: "Credit Card Debt", amount: 1500 },
      { name: "Loans", amount: 1500 },
    ],
    totalLiabilities,
    equity,
  };
};

export const getTotalBalance = (
  ledgers: Ledger[],
  baseCurrency: string,
  exchangeRates: ExchangeRate
): number => {
  return ledgers.reduce(
    (total, ledger) =>
      total + convertAmount(ledger.initialBalance, ledger.currency, baseCurrency, exchangeRates),
    0
  );
};

export const getMonthlyIncome = (
  transactions: Transaction[],
  baseCurrency: string,
  exchangeRates: ExchangeRate
): number => {
  const now = new Date();
  const start = startOfMonth(now);
  const end = endOfMonth(now);
  return transactions
    .filter(
      (t) =>
        t.type === "income" &&
        new Date(t.date) >= start &&
        new Date(t.date) <= end
    )
    .reduce(
      (sum, t) => sum + convertAmount(t.amount, t.currency, baseCurrency, exchangeRates),
      0
    );
};

export const getMonthlyExpenses = (
  transactions: Transaction[],
  baseCurrency: string,
  exchangeRates: ExchangeRate
): number => {
  const now = new Date();
  const start = startOfMonth(now);
  const end = endOfMonth(now);
  return transactions
    .filter(
      (t) =>
        t.type === "expense" &&
        new Date(t.date) >= start &&
        new Date(t.date) <= end
    )
    .reduce(
      (sum, t) => sum + convertAmount(t.amount, t.currency, baseCurrency, exchangeRates),
      0
    );
};

export const getTransactionsByMonth = (
  months: number,
  transactions: Transaction[],
  baseCurrency: string,
  exchangeRates: ExchangeRate
) => {
  const data = [];
  const today = new Date();
  for (let i = months - 1; i >= 0; i--) {
    const monthDate = subMonths(today, i);
    const start = startOfMonth(monthDate);
    const end = endOfMonth(monthDate);

    const income = transactions
      .filter(
        (t) =>
          t.type === "income" &&
          new Date(t.date) >= start &&
          new Date(t.date) <= end
      )
      .reduce(
        (sum, t) => sum + convertAmount(t.amount, t.currency, baseCurrency, exchangeRates),
        0
      );

    const expenses = transactions
      .filter(
        (t) =>
          t.type === "expense" &&
          new Date(t.date) >= start &&
          new Date(t.date) <= end
      )
      .reduce(
        (sum, t) => sum + convertAmount(t.amount, t.currency, baseCurrency, exchangeRates),
        0
      );

    data.push({
      month: format(monthDate, "MMM yy"),
      income: parseFloat(income.toFixed(2)),
      expenses: parseFloat(expenses.toFixed(2)),
    });
  }
  return data;
};

export const getExpensesByCategory = (
  transactions: Transaction[],
  categories: Category[],
  baseCurrency: string,
  exchangeRates: ExchangeRate
) => {
  const expenseMap = new Map<string, { name: string; value: number; color: string }>();
  const now = new Date();
  const start = startOfMonth(now);
  const end = endOfMonth(now);

  transactions
    .filter(
      (t) =>
        t.type === "expense" &&
        new Date(t.date) >= start &&
        new Date(t.date) <= end
    )
    .forEach((t) => {
      const category = categories.find((c) => c.id === t.category);
      if (category) {
        const current = expenseMap.get(category.name) || {
          name: category.name,
          value: 0,
          color: category.color,
        };
        current.value += convertAmount(t.amount, t.currency, baseCurrency, exchangeRates);
        expenseMap.set(category.name, current);
      }
    });
  return Array.from(expenseMap.values()).filter((item) => item.value > 0);
};