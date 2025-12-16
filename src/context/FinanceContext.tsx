"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useProfile } from "./ProfileContext";
import { format, getMonth, getYear, endOfMonth, startOfMonth, addMonths, isPast, isAfter, subMonths, subYears, startOfYear, endOfYear } from "date-fns";

// Types
export type TransactionType = "income" | "expense";

export interface Category {
  id: string;
  name: string;
  color: string;
  icon: string;
}

export interface Transaction {
  id: string;
  profileId: string;
  amount: number;
  date: string;
  description: string;
  type: TransactionType;
  category: string;
  currency: string;
}

export interface Bill {
  id: string;
  profileId: string;
  name: string;
  amount: number;
  dueDate: string;
  isPaid: boolean;
  currency: string;
}

export interface ExchangeRate {
  [key: string]: number;
}

// New types for financial statements
export interface JournalEntry {
  id: string;
  date: string;
  description: string;
  debitAccount: string;
  creditAccount: string;
  amount: number;
  currency: string;
}

export interface LedgerEntry {
  date: string;
  description: string;
  type: "debit" | "credit";
  amount: number;
  balance: number;
}

export interface LedgerAccount {
  name: string;
  entries: LedgerEntry[];
  finalBalance: number;
}

export interface ProfitLossAccount {
  period: string;
  totalIncome: number;
  totalExpenses: number;
  netProfitLoss: number;
  incomeBreakdown: { category: string; amount: number }[];
  expenseBreakdown: { category: string; amount: number }[];
}

export interface BalanceSheet {
  date: string;
  assets: { name: string; amount: number }[];
  totalAssets: number;
  liabilities: { name: string; amount: number }[];
  totalLiabilities: number;
  equity: number;
}

// Default categories
const defaultCategories: Category[] = [
  { id: "1", name: "Food", color: "bg-red-500", icon: "Utensils" },
  { id: "2", name: "Rent", color: "bg-blue-500", icon: "Home" },
  { id: "3", name: "Transport", color: "bg-green-500", icon: "Car" },
  { id: "4", name: "Salary", color: "bg-teal-500", icon: "Briefcase" },
  { id: "5", name: "Entertainment", color: "bg-purple-500", icon: "Film" },
  { id: "6", name: "Shopping", color: "bg-pink-500", icon: "ShoppingCart" },
  { id: "7", name: "Health", color: "bg-orange-500", icon: "Heart" },
  { id: "8", name: "Education", color: "bg-indigo-500", icon: "Book" },
];

// Default exchange rates (base: USD)
const defaultExchangeRates: ExchangeRate = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.79,
  JPY: 148.5,
  INR: 83.3,
  CAD: 1.36,
  AUD: 1.52,
};

interface FinanceContextType {
  transactions: Transaction[];
  categories: Category[];
  bills: Bill[];
  baseCurrency: string;
  exchangeRates: ExchangeRate;
  addTransaction: (transaction: Omit<Transaction, "id" | "profileId">) => void;
  updateTransaction: (id: string, transaction: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
  addCategory: (category: Omit<Category, "id">) => void;
  updateCategory: (id: string, category: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
  addBill: (bill: Omit<Bill, "id" | "profileId">) => void;
  updateBill: (id: string, bill: Partial<Bill>) => void;
  deleteBill: (id: string) => void;
  setBaseCurrency: (currency: string) => void;
  convertAmount: (amount: number, fromCurrency: string, toCurrency: string) => number;
  getTotalBalance: () => number;
  getMonthlyIncome: () => number;
  getMonthlyExpenses: () => number;
  getTransactionsByMonth: (months: number) => { income: number; expenses: number; month: string }[];
  getExpensesByCategory: () => { name: string; value: number; color: string }[];
  // New financial statement functions
  getJournalEntries: (startDate: Date, endDate: Date) => JournalEntry[];
  getLedgerAccounts: (startDate: Date, endDate: Date) => { [accountName: string]: LedgerAccount };
  getProfitLossAccount: (startDate: Date, endDate: Date) => ProfitLossAccount;
  getBalanceSheet: (endDate: Date) => BalanceSheet;
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

export const FinanceProvider = ({ children }: { children: ReactNode }) => {
  const { currentProfileId } = useProfile();
  
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem("transactions");
    return saved ? JSON.parse(saved) : [];
  });

  const [categories, setCategories] = useState<Category[]>(() => {
    const saved = localStorage.getItem("categories");
    return saved ? JSON.parse(saved) : defaultCategories;
  });

  const [bills, setBills] = useState<Bill[]>(() => {
    const saved = localStorage.getItem("bills");
    return saved ? JSON.parse(saved) : [];
  });

  const [baseCurrency, setBaseCurrency] = useState<string>(() => {
    return localStorage.getItem("baseCurrency") || "USD";
  });

  const [exchangeRates] = useState<ExchangeRate>(defaultExchangeRates);

  // Save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem("transactions", JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem("categories", JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem("bills", JSON.stringify(bills));
  }, [bills]);

  useEffect(() => {
    localStorage.setItem("baseCurrency", baseCurrency);
  }, [baseCurrency]);

  // Filter data by current profile
  const profileTransactions = transactions.filter(t => t.profileId === currentProfileId);
  const profileBills = bills.filter(b => b.profileId === currentProfileId);

  // Transaction functions
  const addTransaction = (transaction: Omit<Transaction, "id" | "profileId">) => {
    const newTransaction = {
      ...transaction,
      id: Date.now().toString(),
      profileId: currentProfileId,
    };
    setTransactions([...transactions, newTransaction]);
  };

  const updateTransaction = (id: string, updatedTransaction: Partial<Transaction>) => {
    setTransactions(
      transactions.map((transaction) =>
        transaction.id === id ? { ...transaction, ...updatedTransaction } : transaction
      )
    );
  };

  const deleteTransaction = (id: string) => {
    setTransactions(transactions.filter((transaction) => transaction.id !== id));
  };

  // Category functions (global for all profiles)
  const addCategory = (category: Omit<Category, "id">) => {
    const newCategory = {
      ...category,
      id: Date.now().toString(),
    };
    setCategories([...categories, newCategory]);
  };

  const updateCategory = (id: string, updatedCategory: Partial<Category>) => {
    setCategories(
      categories.map((category) =>
        category.id === id ? { ...category, ...updatedCategory } : category
      )
    );
  };

  const deleteCategory = (id: string) => {
    setCategories(categories.filter((category) => category.id !== id));
    // Also remove transactions with this category
    setTransactions(
      transactions.map((transaction) =>
        transaction.category === id
          ? { ...transaction, category: "" }
          : transaction
      )
    );
  };

  // Bill functions
  const addBill = (bill: Omit<Bill, "id" | "profileId">) => {
    const newBill = {
      ...bill,
      id: Date.now().toString(),
      profileId: currentProfileId,
    };
    setBills([...bills, newBill]);
  };

  const updateBill = (id: string, updatedBill: Partial<Bill>) => {
    setBills(
      bills.map((bill) => (bill.id === id ? { ...bill, ...updatedBill } : bill))
    );
  };

  const deleteBill = (id: string) => {
    setBills(bills.filter((bill) => bill.id !== id));
  };

  // Currency conversion
  const convertAmount = (amount: number, fromCurrency: string, toCurrency: string): number => {
    if (fromCurrency === toCurrency) return amount;
    
    // Convert to base currency first (USD), then to target currency
    const amountInUSD = amount / (exchangeRates[fromCurrency] || 1);
    return amountInUSD * (exchangeRates[toCurrency] || 1);
  };

  // Financial calculations
  const getTotalBalance = (): number => {
    return profileTransactions.reduce((total, transaction) => {
      const convertedAmount = convertAmount(
        transaction.amount,
        transaction.currency,
        baseCurrency
      );
      return transaction.type === "income"
        ? total + convertedAmount
        : total - convertedAmount;
    }, 0);
  };

  const getMonthlyIncome = (): number => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    return profileTransactions
      .filter((transaction) => {
        const transactionDate = new Date(transaction.date);
        return (
          transaction.type === "income" &&
          transactionDate.getMonth() === currentMonth &&
          transactionDate.getFullYear() === currentYear
        );
      })
      .reduce((total, transaction) => {
        const convertedAmount = convertAmount(
          transaction.amount,
          transaction.currency,
          baseCurrency
        );
        return total + convertedAmount;
      }, 0);
  };

  const getMonthlyExpenses = (): number => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    return profileTransactions
      .filter((transaction) => {
        const transactionDate = new Date(transaction.date);
        return (
          transaction.type === "expense" &&
          transactionDate.getMonth() === currentMonth &&
          transactionDate.getFullYear() === currentYear
        );
      })
      .reduce((total, transaction) => {
        const convertedAmount = convertAmount(
          transaction.amount,
          transaction.currency,
          baseCurrency
        );
        return total + convertedAmount;
      }, 0);
  };

  const getTransactionsByMonth = (months: number) => {
    const result = [];
    const currentDate = new Date();
    
    for (let i = months - 1; i >= 0; i--) {
      const date = new Date(currentDate);
      date.setMonth(currentDate.getMonth() - i);
      
      const month = date.toLocaleString('default', { month: 'short' });
      const year = date.getFullYear();
      
      const monthTransactions = profileTransactions.filter(transaction => {
        const transactionDate = new Date(transaction.date);
        return (
          transactionDate.getMonth() === date.getMonth() &&
          transactionDate.getFullYear() === year
        );
      });
      
      const income = monthTransactions
        .filter(t => t.type === "income")
        .reduce((sum, t) => {
          const convertedAmount = convertAmount(t.amount, t.currency, baseCurrency);
          return sum + convertedAmount;
        }, 0);
        
      const expenses = monthTransactions
        .filter(t => t.type === "expense")
        .reduce((sum, t) => {
          const convertedAmount = convertAmount(t.amount, t.currency, baseCurrency);
          return sum + convertedAmount;
        }, 0);
      
      result.push({ income, expenses, month: `${month} ${year}` });
    }
    
    return result;
  };

  const getExpensesByCategory = () => {
    const expenseTransactions = profileTransactions.filter(t => t.type === "expense");
    const categoryMap: { [key: string]: number } = {};
    
    expenseTransactions.forEach(transaction => {
      const categoryId = transaction.category;
      const category = categories.find(c => c.id === categoryId);
      
      if (category) {
        const convertedAmount = convertAmount(
          transaction.amount,
          transaction.currency,
          baseCurrency
        );
        
        if (categoryMap[category.name]) {
          categoryMap[category.name] += convertedAmount;
        } else {
          categoryMap[category.name] = convertedAmount;
        }
      }
    });
    
    return Object.entries(categoryMap).map(([name, value]) => {
      const category = categories.find(c => c.name === name);
      return {
        name,
        value,
        color: category?.color || "bg-gray-500"
      };
    });
  };

  // --- Financial Statement Generation Functions ---

  const getJournalEntries = (startDate: Date, endDate: Date): JournalEntry[] => {
    const filteredTransactions = profileTransactions.filter(t => {
      const transactionDate = new Date(t.date);
      return transactionDate >= startDate && transactionDate <= endDate;
    });

    const entries: JournalEntry[] = [];
    filteredTransactions.forEach(t => {
      const categoryName = categories.find(c => c.id === t.category)?.name || "Uncategorized";
      const convertedAmount = convertAmount(t.amount, t.currency, baseCurrency);

      if (t.type === "income") {
        entries.push({
          id: `${t.id}-debit`,
          date: t.date,
          description: t.description,
          debitAccount: "Assets: Cash/Bank", // Simplified
          creditAccount: `Income: ${categoryName}`,
          amount: convertedAmount,
          currency: baseCurrency,
        });
      } else { // expense
        entries.push({
          id: `${t.id}-credit`,
          date: t.date,
          description: t.description,
          debitAccount: `Expenses: ${categoryName}`,
          creditAccount: "Assets: Cash/Bank", // Simplified
          amount: convertedAmount,
          currency: baseCurrency,
        });
      }
    });
    return entries.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };

  const getLedgerAccounts = (startDate: Date, endDate: Date): { [accountName: string]: LedgerAccount } => {
    const journalEntries = getJournalEntries(startDate, endDate);
    const ledger: { [accountName: string]: LedgerAccount } = {};

    const addEntryToLedger = (accountName: string, entry: LedgerEntry) => {
      if (!ledger[accountName]) {
        ledger[accountName] = { name: accountName, entries: [], finalBalance: 0 };
      }
      ledger[accountName].entries.push(entry);
    };

    journalEntries.forEach(je => {
      // Debit entry
      addEntryToLedger(je.debitAccount, {
        date: je.date,
        description: je.description,
        type: "debit",
        amount: je.amount,
        balance: 0, // Will calculate later
      });

      // Credit entry
      addEntryToLedger(je.creditAccount, {
        date: je.date,
        description: je.description,
        type: "credit",
        amount: je.amount,
        balance: 0, // Will calculate later
      });
    });

    // Calculate running balances and final balances
    for (const accountName in ledger) {
      let currentBalance = 0;
      ledger[accountName].entries.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      ledger[accountName].entries.forEach(entry => {
        if (entry.type === "debit") {
          currentBalance += entry.amount;
        } else {
          currentBalance -= entry.amount;
        }
        entry.balance = currentBalance;
      });
      ledger[accountName].finalBalance = currentBalance;
    }

    return ledger;
  };

  const getProfitLossAccount = (startDate: Date, endDate: Date): ProfitLossAccount => {
    const filteredTransactions = profileTransactions.filter(t => {
      const transactionDate = new Date(t.date);
      return transactionDate >= startDate && transactionDate <= endDate;
    });

    let totalIncome = 0;
    let totalExpenses = 0;
    const incomeBreakdown: { [key: string]: number } = {};
    const expenseBreakdown: { [key: string]: number } = {};

    filteredTransactions.forEach(t => {
      const convertedAmount = convertAmount(t.amount, t.currency, baseCurrency);
      const categoryName = categories.find(c => c.id === t.category)?.name || "Uncategorized";

      if (t.type === "income") {
        totalIncome += convertedAmount;
        incomeBreakdown[categoryName] = (incomeBreakdown[categoryName] || 0) + convertedAmount;
      } else {
        totalExpenses += convertedAmount;
        expenseBreakdown[categoryName] = (expenseBreakdown[categoryName] || 0) + convertedAmount;
      }
    });

    const netProfitLoss = totalIncome - totalExpenses;

    return {
      period: `${format(startDate, 'MMM yyyy')} - ${format(endDate, 'MMM yyyy')}`,
      totalIncome,
      totalExpenses,
      netProfitLoss,
      incomeBreakdown: Object.entries(incomeBreakdown).map(([category, amount]) => ({ category, amount })),
      expenseBreakdown: Object.entries(expenseBreakdown).map(([category, amount]) => ({ category, amount })),
    };
  };

  const getBalanceSheet = (endDate: Date): BalanceSheet => {
    const transactionsUpToEndDate = profileTransactions.filter(t => {
      const transactionDate = new Date(t.date);
      return transactionDate <= endDate;
    });

    let cashBalance = 0;
    transactionsUpToEndDate.forEach(t => {
      const convertedAmount = convertAmount(t.amount, t.currency, baseCurrency);
      if (t.type === "income") {
        cashBalance += convertedAmount;
      } else {
        cashBalance -= convertedAmount;
      }
    });

    // Simplified assets: just cash balance for now
    const assets = [
      { name: "Cash & Bank", amount: cashBalance },
      // Add other assets like investments, property if applicable
    ];
    const totalAssets = assets.reduce((sum, asset) => sum + asset.amount, 0);

    // Simplified liabilities: outstanding bills
    const outstandingBills = profileBills.filter(bill => !bill.isPaid && new Date(bill.dueDate) <= endDate);
    const totalOutstandingBills = outstandingBills.reduce((sum, bill) => 
      sum + convertAmount(bill.amount, bill.currency, baseCurrency), 0);

    const liabilities = [
      { name: "Outstanding Bills", amount: totalOutstandingBills },
      // Add other liabilities like loans, credit card debt
    ];
    const totalLiabilities = liabilities.reduce((sum, liability) => sum + liability.amount, 0);

    const equity = totalAssets - totalLiabilities;

    return {
      date: format(endDate, 'PPP'),
      assets,
      totalAssets,
      liabilities,
      totalLiabilities,
      equity,
    };
  };

  return (
    <FinanceContext.Provider
      value={{
        transactions: profileTransactions,
        categories,
        bills: profileBills,
        baseCurrency,
        exchangeRates,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        addCategory,
        updateCategory,
        deleteCategory,
        addBill,
        updateBill,
        deleteBill,
        setBaseCurrency,
        convertAmount,
        getTotalBalance,
        getMonthlyIncome,
        getMonthlyExpenses,
        getTransactionsByMonth,
        getExpensesByCategory,
        getJournalEntries,
        getLedgerAccounts,
        getProfitLossAccount,
        getBalanceSheet,
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
};

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (context === undefined) {
    throw new Error("useFinance must be used within a FinanceProvider");
  }
  return context;
};