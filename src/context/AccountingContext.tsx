"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useProfile } from "./ProfileContext";
import { format, getMonth, getYear, endOfMonth, startOfMonth, addMonths, isPast, isAfter, subMonths, subYears, startOfYear, endOfYear, isSameMonth, isSameYear } from "date-fns";

// --- Core Accounting Types ---

export type TransactionType = "income" | "expense"; // Will be replaced by VoucherType concept

export interface AccountGroup {
  id: string;
  name: string; // e.g., Assets, Liabilities, Income, Expenses
  parentGroupId?: string; // For hierarchical grouping
  type: "asset" | "liability" | "equity" | "income" | "expense";
}

export interface Ledger {
  id: string;
  profileId: string;
  name: string; // e.g., Cash, Bank A/c, Sales, Purchases, Customer A, Vendor B
  accountGroupId: string; // Links to an AccountGroup
  initialBalance: number; // Opening balance for the ledger
  currency: string;
  isContraAccount?: boolean; // e.g., for Cash/Bank in Contra vouchers
}

export type VoucherType = "Contra" | "Payment" | "Receipt" | "Journal" | "Sales" | "Purchase" | "Credit Note" | "Debit Note";

export interface VoucherEntry {
  ledgerId: string;
  amount: number;
  type: "debit" | "credit";
  description?: string;
}

export interface Voucher {
  id: string;
  profileId: string;
  voucherTypeId: string; // Links to a VoucherType
  date: string;
  narration: string; // Overall description for the voucher
  entries: VoucherEntry[]; // Double-entry principle: sum of debits must equal sum of credits
  currency: string;
  reference?: string; // e.g., Invoice number, Cheque number
}

export interface InventoryItem {
  id: string;
  profileId: string;
  name: string;
  description?: string;
  unit: string; // e.g., Pcs, Kg, Liters
  hsnSacCode?: string; // For GST compliance
  costPrice: number;
  sellingPrice: number;
  valuationMethod: "FIFO" | "LIFO" | "Weighted Average";
  reorderLevel?: number;
}

export interface Warehouse {
  id: string;
  profileId: string;
  name: string;
  location?: string;
}

export interface StockMovement {
  id: string;
  profileId: string;
  itemId: string;
  warehouseId: string;
  date: string;
  quantity: number;
  type: "in" | "out"; // Purchase, Sale, Transfer, Adjustment
  referenceVoucherId?: string; // Link to a Purchase/Sales voucher
}

export interface Invoice {
  id: string;
  profileId: string;
  invoiceNumber: string;
  date: string;
  dueDate: string;
  customerId: string; // Ledger ID of the customer
  items: { itemId: string; quantity: number; price: number; gstRate: number }[];
  totalAmount: number;
  totalGST: number;
  currency: string;
  status: "draft" | "sent" | "paid" | "overdue";
  paymentGatewayIntegration?: { type: string; status: string; transactionId?: string };
}

// Existing types (will be integrated into new accounting system over time)
export interface Category {
  id: string;
  name: string;
  color: string;
  icon: string;
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

// Temporary Transaction interface for existing components
export interface Transaction {
  id: string;
  profileId: string;
  amount: number;
  date: string;
  description: string;
  type: TransactionType;
  category: string; // Category ID
  currency: string;
  accountId: string; // Ledger ID
}

export interface ExchangeRate {
  [key: string]: number;
}

// New types for financial statements (signatures kept, logic will be rewritten)
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

// --- Default Data ---

const defaultAccountGroups: AccountGroup[] = [
  { id: "ag-assets", name: "Assets", type: "asset" },
  { id: "ag-current-assets", name: "Current Assets", parentGroupId: "ag-assets", type: "asset" },
  { id: "ag-bank-accounts", name: "Bank Accounts", parentGroupId: "ag-current-assets", type: "asset" },
  { id: "ag-cash-in-hand", name: "Cash-in-Hand", parentGroupId: "ag-current-assets", type: "asset" },
  { id: "ag-liabilities", name: "Liabilities", type: "liability" },
  { id: "ag-current-liabilities", name: "Current Liabilities", parentGroupId: "ag-liabilities", type: "liability" },
  { id: "ag-duties-taxes", name: "Duties & Taxes", parentGroupId: "ag-current-liabilities", type: "liability" },
  { id: "ag-equity", name: "Equity", type: "equity" },
  { id: "ag-income", name: "Income", type: "income" },
  { id: "ag-direct-income", name: "Direct Income", parentGroupId: "ag-income", type: "income" },
  { id: "ag-indirect-income", name: "Indirect Income", parentGroupId: "ag-income", type: "income" },
  { id: "ag-expenses", name: "Expenses", type: "expense" },
  { id: "ag-direct-expenses", name: "Direct Expenses", parentGroupId: "ag-expenses", type: "expense" },
  { id: "ag-indirect-expenses", name: "Indirect Expenses", parentGroupId: "ag-expenses", type: "expense" },
];

const defaultVoucherTypes: VoucherType[] = ["Contra", "Payment", "Receipt", "Journal", "Sales", "Purchase", "Credit Note", "Debit Note"];

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

const defaultExchangeRates: ExchangeRate = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.79,
  JPY: 148.5,
  INR: 83.3,
  CAD: 1.36,
  AUD: 1.52,
};

// --- Accounting Context Type ---

interface AccountingContextType {
  // Core Accounting Entities
  accountGroups: AccountGroup[];
  ledgers: Ledger[];
  vouchers: Voucher[];
  voucherTypes: VoucherType[];
  inventoryItems: InventoryItem[];
  warehouses: Warehouse[];
  stockMovements: StockMovement[];
  invoices: Invoice[];

  // Existing entities (will be integrated)
  categories: Category[];
  bills: Bill[];
  transactions: Transaction[]; // Added for existing components

  // Global settings
  baseCurrency: string;
  exchangeRates: ExchangeRate;

  // CRUD operations for new entities
  addAccountGroup: (group: Omit<AccountGroup, "id">) => void;
  updateAccountGroup: (id: string, group: Partial<AccountGroup>) => void;
  deleteAccountGroup: (id: string) => void;

  addLedger: (ledger: Omit<Ledger, "id" | "profileId">) => void;
  updateLedger: (id: string, ledger: Partial<Ledger>) => void;
  deleteLedger: (id: string) => void;

  createVoucher: (voucher: Omit<Voucher, "id" | "profileId">) => void;
  updateVoucher: (id: string, voucher: Partial<Voucher>) => void;
  deleteVoucher: (id: string) => void;

  addInventoryItem: (item: Omit<InventoryItem, "id" | "profileId">) => void;
  updateInventoryItem: (id: string, item: Partial<InventoryItem>) => void;
  deleteInventoryItem: (id: string) => void;

  addWarehouse: (warehouse: Omit<Warehouse, "id" | "profileId">) => void;
  updateWarehouse: (id: string, warehouse: Partial<Warehouse>) => void;
  deleteWarehouse: (id: string) => void;

  addStockMovement: (movement: Omit<StockMovement, "id" | "profileId">) => void;
  updateStockMovement: (id: string, movement: Partial<StockMovement>) => void;
  deleteStockMovement: (id: string) => void;

  addInvoice: (invoice: Omit<Invoice, "id" | "profileId">) => void;
  updateInvoice: (id: string, invoice: Partial<Invoice>) => void;
  deleteInvoice: (id: string) => void;

  // CRUD for existing entities (adapted)
  addCategory: (category: Omit<Category, "id">) => void;
  updateCategory: (id: string, category: Partial<Category>) => void;
  deleteCategory: (id: string) => void;

  addBill: (bill: Omit<Bill, "id" | "profileId">) => void;
  updateBill: (id: string, bill: Partial<Bill>) => void;
  deleteBill: (id: string) => void;

  addTransaction: (transaction: Omit<Transaction, "id" | "profileId">) => void; // Added
  updateTransaction: (id: string, transaction: Partial<Transaction>) => void; // Added
  deleteTransaction: (id: string) => void; // Added

  // Global settings functions
  setBaseCurrency: (currency: string) => void;
  convertAmount: (amount: number, fromCurrency: string, toCurrency: string) => number;

  // Reporting functions (placeholders for now)
  getJournalEntries: (startDate: Date, endDate: Date) => JournalEntry[];
  getLedgerAccounts: (startDate: Date, endDate: Date) => { [accountName: string]: LedgerAccount };
  getProfitLossAccount: (startDate: Date, endDate: Date) => ProfitLossAccount;
  getBalanceSheet: (endDate: Date) => BalanceSheet;
  
  // Placeholder for existing finance functions (will be removed/refactored)
  getTotalBalance: () => number;
  getMonthlyIncome: () => number;
  getMonthlyExpenses: () => number;
  getTransactionsByMonth: (months: number) => { income: number; expenses: number; month: string }[];
  getExpensesByCategory: () => { name: string; value: number; color: string }[];
}

const AccountingContext = createContext<AccountingContextType | undefined>(undefined);

export const AccountingProvider = ({ children }: { children: ReactNode }) => {
  const { currentProfileId } = useProfile();
  
  // --- State for Core Accounting Entities ---
  const [accountGroups, setAccountGroups] = useState<AccountGroup[]>(() => {
    const saved = localStorage.getItem("accountGroups");
    return saved ? JSON.parse(saved) : defaultAccountGroups;
  });

  const [ledgers, setLedgers] = useState<Ledger[]>(() => {
    const saved = localStorage.getItem("ledgers");
    return saved ? JSON.parse(saved) : [];
  });

  const [vouchers, setVouchers] = useState<Voucher[]>(() => {
    const saved = localStorage.getItem("vouchers");
    return saved ? JSON.parse(saved) : [];
  });

  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>(() => {
    const saved = localStorage.getItem("inventoryItems");
    return saved ? JSON.parse(saved) : [];
  });

  const [warehouses, setWarehouses] = useState<Warehouse[]>(() => {
    const saved = localStorage.getItem("warehouses");
    return saved ? JSON.parse(saved) : [];
  });

  const [stockMovements, setStockMovements] = useState<StockMovement[]>(() => {
    const saved = localStorage.getItem("stockMovements");
    return saved ? JSON.parse(saved) : [];
  });

  const [invoices, setInvoices] = useState<Invoice[]>(() => {
    const saved = localStorage.getItem("invoices");
    return saved ? JSON.parse(saved) : [];
  });

  // --- State for Existing Entities (will be integrated) ---
  const [categories, setCategories] = useState<Category[]>(() => {
    const saved = localStorage.getItem("categories");
    return saved ? JSON.parse(saved) : defaultCategories;
  });

  const [bills, setBills] = useState<Bill[]>(() => {
    const saved = localStorage.getItem("bills");
    return saved ? JSON.parse(saved) : [];
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => { // Added
    const saved = localStorage.getItem("transactions");
    return saved ? JSON.parse(saved) : [];
  });

  // --- Global Settings State ---
  const [baseCurrency, setBaseCurrency] = useState<string>(() => {
    return localStorage.getItem("baseCurrency") || "INR";
  });

  const [exchangeRates] = useState<ExchangeRate>(defaultExchangeRates);
  const [voucherTypes] = useState<VoucherType[]>(defaultVoucherTypes);

  // --- Persistence Effects ---
  useEffect(() => { localStorage.setItem("accountGroups", JSON.stringify(accountGroups)); }, [accountGroups]);
  useEffect(() => { localStorage.setItem("ledgers", JSON.stringify(ledgers)); }, [ledgers]);
  useEffect(() => { localStorage.setItem("vouchers", JSON.stringify(vouchers)); }, [vouchers]);
  useEffect(() => { localStorage.setItem("inventoryItems", JSON.stringify(inventoryItems)); }, [inventoryItems]);
  useEffect(() => { localStorage.setItem("warehouses", JSON.stringify(warehouses)); }, [warehouses]);
  useEffect(() => { localStorage.setItem("stockMovements", JSON.stringify(stockMovements)); }, [stockMovements]);
  useEffect(() => { localStorage.setItem("invoices", JSON.stringify(invoices)); }, [invoices]);
  useEffect(() => { localStorage.setItem("categories", JSON.stringify(categories)); }, [categories]);
  useEffect(() => { localStorage.setItem("bills", JSON.stringify(bills)); }, [bills]);
  useEffect(() => { localStorage.setItem("transactions", JSON.stringify(transactions)); }, [transactions]); // Added
  useEffect(() => { localStorage.setItem("baseCurrency", baseCurrency); }, [baseCurrency]);

  // --- Profile-specific filtering (for ledgers, vouchers, etc.) ---
  const profileLedgers = ledgers.filter(l => l.profileId === currentProfileId);
  const profileVouchers = vouchers.filter(v => v.profileId === currentProfileId);
  const profileBills = bills.filter(b => b.profileId === currentProfileId);
  const profileTransactions = transactions.filter(t => t.profileId === currentProfileId); // Added
  const profileInventoryItems = inventoryItems.filter(item => item.profileId === currentProfileId);
  const profileWarehouses = warehouses.filter(wh => wh.profileId === currentProfileId);
  const profileStockMovements = stockMovements.filter(sm => sm.profileId === currentProfileId);
  const profileInvoices = invoices.filter(inv => inv.profileId === currentProfileId);

  // --- CRUD Operations for New Entities ---

  const addAccountGroup = (group: Omit<AccountGroup, "id">) => {
    const newGroup = { ...group, id: `ag-${Date.now()}` };
    setAccountGroups(prev => [...prev, newGroup]);
  };
  const updateAccountGroup = (id: string, group: Partial<AccountGroup>) => {
    setAccountGroups(prev => prev.map(g => g.id === id ? { ...g, ...group } : g));
  };
  const deleteAccountGroup = (id: string) => {
    setAccountGroups(prev => prev.filter(g => g.id !== id && g.parentGroupId !== id)); // Also remove children
  };

  const addLedger = (ledger: Omit<Ledger, "id" | "profileId">) => {
    const newLedger = { ...ledger, id: `l-${Date.now()}`, profileId: currentProfileId };
    setLedgers(prev => [...prev, newLedger]);
  };
  const updateLedger = (id: string, ledger: Partial<Ledger>) => {
    setLedgers(prev => prev.map(l => l.id === id ? { ...l, ...ledger } : l));
  };
  const deleteLedger = (id: string) => {
    setLedgers(prev => prev.filter(l => l.id !== id));
    // TODO: Handle associated vouchers/transactions
  };

  const createVoucher = (voucher: Omit<Voucher, "id" | "profileId">) => {
    // Basic validation: sum of debits must equal sum of credits
    const totalDebits = voucher.entries.filter(e => e.type === "debit").reduce((sum, e) => sum + e.amount, 0);
    const totalCredits = voucher.entries.filter(e => e.type === "credit").reduce((sum, e) => sum + e.amount, 0);

    if (totalDebits !== totalCredits) {
      console.error("Voucher creation failed: Debits and Credits do not match.");
      return;
    }

    const newVoucher = { ...voucher, id: `v-${Date.now()}`, profileId: currentProfileId };
    setVouchers(prev => [...prev, newVoucher]);
  };
  const updateVoucher = (id: string, voucher: Partial<Voucher>) => {
    setVouchers(prev => prev.map(v => v.id === id ? { ...v, ...voucher } : v));
  };
  const deleteVoucher = (id: string) => {
    setVouchers(prev => prev.filter(v => v.id !== id));
  };

  const addInventoryItem = (item: Omit<InventoryItem, "id" | "profileId">) => {
    const newItem = { ...item, id: `item-${Date.now()}`, profileId: currentProfileId };
    setInventoryItems(prev => [...prev, newItem]);
  };
  const updateInventoryItem = (id: string, item: Partial<InventoryItem>) => {
    setInventoryItems(prev => prev.map(i => i.id === id ? { ...i, ...item } : i));
  };
  const deleteInventoryItem = (id: string) => {
    setInventoryItems(prev => prev.filter(i => i.id !== id));
  };

  const addWarehouse = (warehouse: Omit<Warehouse, "id" | "profileId">) => {
    const newWarehouse = { ...warehouse, id: `wh-${Date.now()}`, profileId: currentProfileId };
    setWarehouses(prev => [...prev, newWarehouse]);
  };
  const updateWarehouse = (id: string, warehouse: Partial<Warehouse>) => {
    setWarehouses(prev => prev.map(wh => wh.id === id ? { ...wh, ...warehouse } : wh));
  };
  const deleteWarehouse = (id: string) => {
    setWarehouses(prev => prev.filter(wh => wh.id !== id));
  };

  const addStockMovement = (movement: Omit<StockMovement, "id" | "profileId">) => {
    const newMovement = { ...movement, id: `sm-${Date.now()}`, profileId: currentProfileId };
    setStockMovements(prev => [...prev, newMovement]);
  };
  const updateStockMovement = (id: string, movement: Partial<StockMovement>) => {
    setStockMovements(prev => prev.map(sm => sm.id === id ? { ...sm, ...movement } : sm));
  };
  const deleteStockMovement = (id: string) => {
    setStockMovements(prev => prev.filter(sm => sm.id !== id));
  };

  const addInvoice = (invoice: Omit<Invoice, "id" | "profileId">) => {
    const newInvoice = { ...invoice, id: `inv-${Date.now()}`, profileId: currentProfileId };
    setInvoices(prev => [...prev, newInvoice]);
  };
  const updateInvoice = (id: string, invoice: Partial<Invoice>) => {
    setInvoices(prev => prev.map(inv => inv.id === id ? { ...inv, ...invoice } : inv));
  };
  const deleteInvoice = (id: string) => {
    setInvoices(prev => prev.filter(inv => inv.id !== id));
  };

  // --- CRUD for Existing Entities (adapted) ---
  const addCategory = (category: Omit<Category, "id">) => {
    const newCategory = { ...category, id: `cat-${Date.now()}` };
    setCategories(prev => [...prev, newCategory]);
  };
  const updateCategory = (id: string, updatedCategory: Partial<Category>) => {
    setCategories(prev => prev.map(c => c.id === id ? { ...c, ...updatedCategory } : c));
  };
  const deleteCategory = (id: string) => {
    setCategories(prev => prev.filter(c => c.id !== id));
    // TODO: Reassign categories in vouchers/transactions
  };

  const addBill = (bill: Omit<Bill, "id" | "profileId">) => {
    const newBill = { ...bill, id: `bill-${Date.now()}`, profileId: currentProfileId };
    setBills(prev => [...prev, newBill]);
  };
  const updateBill = (id: string, updatedBill: Partial<Bill>) => {
    setBills(prev => prev.map(b => b.id === id ? { ...b, ...updatedBill } : b));
  };
  const deleteBill = (id: string) => {
    setBills(prev => prev.filter(b => b.id !== id));
  };

  const addTransaction = (transaction: Omit<Transaction, "id" | "profileId">) => {
    const newTransaction = { ...transaction, id: `t-${Date.now()}`, profileId: currentProfileId };
    setTransactions(prev => [...prev, newTransaction]);
  };

  const updateTransaction = (id: string, updatedTransaction: Partial<Transaction>) => {
    setTransactions(prev => prev.map(t => t.id === id ? { ...t, ...updatedTransaction } : t));
  };

  const deleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  // --- Global Settings Functions ---
  const convertAmount = (amount: number, fromCurrency: string, toCurrency: string): number => {
    if (fromCurrency === toCurrency) return amount;
    const amountInUSD = amount / (exchangeRates[fromCurrency] || 1);
    return amountInUSD * (exchangeRates[toCurrency] || 1);
  };

  // --- Reporting Functions (Placeholders) ---
  const getJournalEntries = (startDate: Date, endDate: Date): JournalEntry[] => {
    console.warn("getJournalEntries: Logic needs to be implemented based on new Voucher structure.");
    return [];
  };

  const getLedgerAccounts = (startDate: Date, endDate: Date): { [accountName: string]: LedgerAccount } => {
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

  const getProfitLossAccount = (startDate: Date, endDate: Date): ProfitLossAccount => {
    console.warn("getProfitLossAccount: Logic needs to be implemented based on new Ledger and Voucher structure.");
    const income = profileTransactions.filter(t => t.type === 'income' && new Date(t.date) >= startDate && new Date(t.date) <= endDate)
                                     .reduce((sum, t) => sum + convertAmount(t.amount, t.currency, baseCurrency), 0);
    const expenses = profileTransactions.filter(t => t.type === 'expense' && new Date(t.date) >= startDate && new Date(t.date) <= endDate)
                                      .reduce((sum, t) => sum + convertAmount(t.amount, t.currency, baseCurrency), 0);
    
    const incomeBreakdown = categories.map(cat => ({
      category: cat.name,
      amount: profileTransactions.filter(t => t.type === 'income' && t.category === cat.id && new Date(t.date) >= startDate && new Date(t.date) <= endDate)
                                 .reduce((sum, t) => sum + convertAmount(t.amount, t.currency, baseCurrency), 0)
    })).filter(item => item.amount > 0);

    const expenseBreakdown = categories.map(cat => ({
      category: cat.name,
      amount: profileTransactions.filter(t => t.type === 'expense' && t.category === cat.id && new Date(t.date) >= startDate && new Date(t.date) <= endDate)
                                 .reduce((sum, t) => sum + convertAmount(t.amount, t.currency, baseCurrency), 0)
    })).filter(item => item.amount > 0);

    return {
      period: `${format(startDate, 'MMM yyyy')} - ${format(endDate, 'MMM yyyy')}`,
      totalIncome: income,
      totalExpenses: expenses,
      netProfitLoss: income - expenses,
      incomeBreakdown,
      expenseBreakdown,
    };
  };

  const getBalanceSheet = (endDate: Date): BalanceSheet => {
    console.warn("getBalanceSheet: Logic needs to be implemented based on new Ledger structure.");
    // Dummy data for now
    const totalAssets = 10000;
    const totalLiabilities = 3000;
    const equity = totalAssets - totalLiabilities;

    return {
      date: format(endDate, 'PPP'),
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

  // --- Placeholder for existing finance functions (will be removed/refactored) ---
  const getTotalBalance = (): number => {
    // Sum of all ledger initial balances (simplified for now)
    return profileLedgers.reduce((total, ledger) => total + convertAmount(ledger.initialBalance, ledger.currency, baseCurrency), 0);
  };

  const getMonthlyIncome = (): number => {
    const now = new Date();
    const start = startOfMonth(now);
    const end = endOfMonth(now);
    return profileTransactions
      .filter(t => t.type === 'income' && new Date(t.date) >= start && new Date(t.date) <= end)
      .reduce((sum, t) => sum + convertAmount(t.amount, t.currency, baseCurrency), 0);
  };

  const getMonthlyExpenses = (): number => {
    const now = new Date();
    const start = startOfMonth(now);
    const end = endOfMonth(now);
    return profileTransactions
      .filter(t => t.type === 'expense' && new Date(t.date) >= start && new Date(t.date) <= end)
      .reduce((sum, t) => sum + convertAmount(t.amount, t.currency, baseCurrency), 0);
  };

  const getTransactionsByMonth = (months: number) => {
    const data = [];
    const today = new Date();
    for (let i = months - 1; i >= 0; i--) {
      const monthDate = subMonths(today, i);
      const start = startOfMonth(monthDate);
      const end = endOfMonth(monthDate);

      const income = profileTransactions
        .filter(t => t.type === 'income' && new Date(t.date) >= start && new Date(t.date) <= end)
        .reduce((sum, t) => sum + convertAmount(t.amount, t.currency, baseCurrency), 0);

      const expenses = profileTransactions
        .filter(t => t.type === 'expense' && new Date(t.date) >= start && new Date(t.date) <= end)
        .reduce((sum, t) => sum + convertAmount(t.amount, t.currency, baseCurrency), 0);

      data.push({
        month: format(monthDate, 'MMM yy'),
        income: parseFloat(income.toFixed(2)),
        expenses: parseFloat(expenses.toFixed(2)),
      });
    }
    return data;
  };

  const getExpensesByCategory = () => {
    const expenseMap = new Map<string, { name: string; value: number; color: string }>();
    const now = new Date();
    const start = startOfMonth(now);
    const end = endOfMonth(now);

    profileTransactions
      .filter(t => t.type === 'expense' && new Date(t.date) >= start && new Date(t.date) <= end)
      .forEach(t => {
        const category = categories.find(c => c.id === t.category);
        if (category) {
          const current = expenseMap.get(category.name) || { name: category.name, value: 0, color: category.color };
          current.value += convertAmount(t.amount, t.currency, baseCurrency);
          expenseMap.set(category.name, current);
        }
      });
    return Array.from(expenseMap.values()).filter(item => item.value > 0);
  };

  return (
    <AccountingContext.Provider
      value={{
        accountGroups,
        ledgers: profileLedgers,
        vouchers: profileVouchers,
        voucherTypes,
        inventoryItems: profileInventoryItems,
        warehouses: profileWarehouses,
        stockMovements: profileStockMovements,
        invoices: profileInvoices,
        categories,
        bills: profileBills,
        transactions: profileTransactions, // Added
        baseCurrency,
        exchangeRates,
        addAccountGroup,
        updateAccountGroup,
        deleteAccountGroup,
        addLedger,
        updateLedger,
        deleteLedger,
        createVoucher,
        updateVoucher,
        deleteVoucher,
        addInventoryItem,
        updateInventoryItem,
        deleteInventoryItem,
        addWarehouse,
        updateWarehouse,
        deleteWarehouse,
        addStockMovement,
        updateStockMovement,
        deleteStockMovement,
        addInvoice,
        updateInvoice,
        deleteInvoice,
        addCategory,
        updateCategory,
        deleteCategory,
        addBill,
        updateBill,
        deleteBill,
        addTransaction, // Added
        updateTransaction, // Added
        deleteTransaction, // Added
        setBaseCurrency,
        convertAmount,
        getJournalEntries,
        getLedgerAccounts,
        getProfitLossAccount,
        getBalanceSheet,
        getTotalBalance, // Placeholder
        getMonthlyIncome, // Placeholder
        getMonthlyExpenses, // Placeholder
        getTransactionsByMonth, // Placeholder
        getExpensesByCategory, // Placeholder
      }}
    >
      {children}
    </AccountingContext.Provider>
  );
};

export const useAccounting = () => {
  const context = useContext(AccountingContext);
  if (context === undefined) {
    throw new Error("useAccounting must be used within an AccountingProvider");
  }
  return context;
};