"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

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
  amount: number;
  date: string;
  description: string;
  type: TransactionType;
  category: string;
  currency: string;
}

export interface Bill {
  id: string;
  name: string;
  amount: number;
  dueDate: string;
  isPaid: boolean;
  currency: string;
}

export interface ExchangeRate {
  [key: string]: number;
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
  addTransaction: (transaction: Omit<Transaction, "id">) => void;
  updateTransaction: (id: string, transaction: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
  addCategory: (category: Omit<Category, "id">) => void;
  updateCategory: (id: string, category: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
  addBill: (bill: Omit<Bill, "id">) => void;
  updateBill: (id: string, bill: Partial<Bill>) => void;
  deleteBill: (id: string) => void;
  setBaseCurrency: (currency: string) => void;
  convertAmount: (amount: number, fromCurrency: string, toCurrency: string) => number;
  getTotalBalance: () => number;
  getMonthlyIncome: () => number;
  getMonthlyExpenses: () => number;
  getTransactionsByMonth: (months: number) => { income: number; expenses: number; month: string }[];
  getExpensesByCategory: () => { name: string; value: number; color: string }[];
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

export const FinanceProvider = ({ children }: { children: ReactNode }) => {
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

  // Transaction functions
  const addTransaction = (transaction: Omit<Transaction, "id">) => {
    const newTransaction = {
      ...transaction,
      id: Date.now().toString(),
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

  // Category functions
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
  const addBill = (bill: Omit<Bill, "id">) => {
    const newBill = {
      ...bill,
      id: Date.now().toString(),
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
    return transactions.reduce((total, transaction) => {
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

    return transactions
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

    return transactions
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
      
      const monthTransactions = transactions.filter(transaction => {
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
    const expenseTransactions = transactions.filter(t => t.type === "expense");
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

  return (
    <FinanceContext.Provider
      value={{
        transactions,
        categories,
        bills,
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