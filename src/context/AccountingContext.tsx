"use client";

import React, { createContext, useContext, ReactNode } from "react";
import { useProfile } from "./ProfileContext";
import { useAccountingState } from "@/hooks/useAccountingState";
import { convertAmount as currencyConvertAmount } from "@/utils/currency";

import {
  addAccountGroup as addAccountGroupService,
  updateAccountGroup as updateAccountGroupService,
  deleteAccountGroup as deleteAccountGroupService,
} from "@/services/accounting/accountGroups";
import {
  addLedger as addLedgerService,
  updateLedger as updateLedgerService,
  deleteLedger as deleteLedgerService,
} from "@/services/accounting/ledgers";
import {
  createVoucher as createVoucherService,
  updateVoucher as updateVoucherService,
  deleteVoucher as deleteVoucherService,
} from "@/services/accounting/vouchers";
import {
  addInventoryItem as addInventoryItemService,
  updateInventoryItem as updateInventoryItemService,
  deleteInventoryItem as deleteInventoryItemService,
  addWarehouse as addWarehouseService,
  updateWarehouse as updateWarehouseService,
  deleteWarehouse as deleteWarehouseService,
  addStockMovement as addStockMovementService,
  updateStockMovement as updateStockMovementService,
  deleteStockMovement as deleteStockMovementService,
} from "@/services/accounting/inventory";
import {
  addInvoice as addInvoiceService,
  updateInvoice as updateInvoiceService,
  deleteInvoice as deleteInvoiceService,
} from "@/services/accounting/invoices";
import {
  addCategory as addCategoryService,
  updateCategory as updateCategoryService,
  deleteCategory as deleteCategoryService,
} from "@/services/accounting/categories";
import {
  addBill as addBillService,
  updateBill as updateBillService,
  deleteBill as deleteBillService,
} from "@/services/accounting/bills";
import {
  addTransaction as addTransactionService,
  updateTransaction as updateTransactionService,
  deleteTransaction as deleteTransactionService,
} from "@/services/accounting/transactions";

import {
  getJournalEntries as getJournalEntriesReport,
  getLedgerAccounts as getLedgerAccountsReport,
  getProfitLossAccount as getProfitLossAccountReport,
  getBalanceSheet as getBalanceSheetReport,
  getTotalBalance as getTotalBalanceReport,
  getMonthlyIncome as getMonthlyIncomeReport,
  getMonthlyExpenses as getMonthlyExpensesReport,
  getTransactionsByMonth as getTransactionsByMonthReport,
  getExpensesByCategory as getExpensesByCategoryReport,
} from "@/reports/accounting";

import {
  AccountGroup,
  Ledger,
  Voucher,
  InventoryItem,
  Warehouse,
  StockMovement,
  Invoice,
  Category,
  Bill,
  Transaction,
  ExchangeRate,
  VoucherType,
  JournalEntry,
  LedgerAccount,
  ProfitLossAccount,
  BalanceSheet,
} from "@/types/accounting";

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
  transactions: Transaction[];

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

  addTransaction: (transaction: Omit<Transaction, "id" | "profileId">) => void;
  updateTransaction: (id: string, transaction: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;

  // Global settings functions
  setBaseCurrency: (currency: string) => void;
  convertAmount: (amount: number, fromCurrency: string, toCurrency: string) => number;

  // Reporting functions
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
  
  const {
    accountGroups, setAccountGroups,
    ledgers, setLedgers,
    vouchers, setVouchers,
    inventoryItems, setInventoryItems,
    warehouses, setWarehouses,
    stockMovements, setStockMovements,
    invoices, setInvoices,
    categories, setCategories,
    bills, setBills,
    transactions, setTransactions,
    baseCurrency, setBaseCurrency,
    exchangeRates,
    voucherTypes,
  } = useAccountingState();

  // --- Profile-specific filtering ---
  const profileLedgers = ledgers.filter(l => l.profileId === currentProfileId);
  const profileVouchers = vouchers.filter(v => v.profileId === currentProfileId);
  const profileBills = bills.filter(b => b.profileId === currentProfileId);
  const profileTransactions = transactions.filter(t => t.profileId === currentProfileId);
  const profileInventoryItems = inventoryItems.filter(item => item.profileId === currentProfileId);
  const profileWarehouses = warehouses.filter(wh => wh.profileId === currentProfileId);
  const profileStockMovements = stockMovements.filter(sm => sm.profileId === currentProfileId);
  const profileInvoices = invoices.filter(inv => inv.profileId === currentProfileId);

  // --- CRUD Operations ---
  const addAccountGroup = (group: Omit<AccountGroup, "id">) => addAccountGroupService(group, setAccountGroups);
  const updateAccountGroup = (id: string, group: Partial<AccountGroup>) => updateAccountGroupService(id, group, setAccountGroups);
  const deleteAccountGroup = (id: string) => deleteAccountGroupService(id, setAccountGroups);

  const addLedger = (ledger: Omit<Ledger, "id" | "profileId">) => addLedgerService(ledger, currentProfileId, setLedgers);
  const updateLedger = (id: string, ledger: Partial<Ledger>) => updateLedgerService(id, ledger, setLedgers);
  const deleteLedger = (id: string) => deleteLedgerService(id, setLedgers);

  const createVoucher = (voucher: Omit<Voucher, "id" | "profileId">) => createVoucherService(voucher, currentProfileId, setVouchers);
  const updateVoucher = (id: string, voucher: Partial<Voucher>) => updateVoucherService(id, voucher, setVouchers);
  const deleteVoucher = (id: string) => deleteVoucherService(id, setVouchers);

  const addInventoryItem = (item: Omit<InventoryItem, "id" | "profileId">) => addInventoryItemService(item, currentProfileId, setInventoryItems);
  const updateInventoryItem = (id: string, item: Partial<InventoryItem>) => updateInventoryItemService(id, item, setInventoryItems);
  const deleteInventoryItem = (id: string) => deleteInventoryItemService(id, setInventoryItems);

  const addWarehouse = (warehouse: Omit<Warehouse, "id" | "profileId">) => addWarehouseService(warehouse, currentProfileId, setWarehouses);
  const updateWarehouse = (id: string, warehouse: Partial<Warehouse>) => updateWarehouseService(id, warehouse, setWarehouses);
  const deleteWarehouse = (id: string) => deleteWarehouseService(id, setWarehouses);

  const addStockMovement = (movement: Omit<StockMovement, "id" | "profileId">) => addStockMovementService(movement, currentProfileId, setStockMovements);
  const updateStockMovement = (id: string, movement: Partial<StockMovement>) => updateStockMovementService(id, movement, setStockMovements);
  const deleteStockMovement = (id: string) => deleteStockMovementService(id, setStockMovements);

  const addInvoice = (invoice: Omit<Invoice, "id" | "profileId">) => addInvoiceService(invoice, currentProfileId, setInvoices);
  const updateInvoice = (id: string, invoice: Partial<Invoice>) => updateInvoiceService(id, invoice, setInvoices);
  const deleteInvoice = (id: string) => deleteInvoiceService(id, setInvoices);

  const addCategory = (category: Omit<Category, "id">) => addCategoryService(category, setCategories);
  const updateCategory = (id: string, updatedCategory: Partial<Category>) => updateCategoryService(id, updatedCategory, setCategories);
  const deleteCategory = (id: string) => deleteCategoryService(id, setCategories);

  const addBill = (bill: Omit<Bill, "id" | "profileId">) => addBillService(bill, currentProfileId, setBills);
  const updateBill = (id: string, updatedBill: Partial<Bill>) => updateBillService(id, updatedBill, setBills);
  const deleteBill = (id: string) => deleteBillService(id, setBills);

  const addTransaction = (transaction: Omit<Transaction, "id" | "profileId">) => addTransactionService(transaction, currentProfileId, setTransactions);
  const updateTransaction = (id: string, updatedTransaction: Partial<Transaction>) => updateTransactionService(id, updatedTransaction, setTransactions);
  const deleteTransaction = (id: string) => deleteTransactionService(id, setTransactions);

  // --- Global Settings Functions ---
  const convertAmount = (amount: number, fromCurrency: string, toCurrency: string): number => 
    currencyConvertAmount(amount, fromCurrency, toCurrency, exchangeRates);

  // --- Reporting Functions ---
  const getJournalEntries = (startDate: Date, endDate: Date): JournalEntry[] => 
    getJournalEntriesReport(startDate, endDate, profileVouchers, profileLedgers, baseCurrency);

  const getLedgerAccounts = (startDate: Date, endDate: Date): { [accountName: string]: LedgerAccount } => 
    getLedgerAccountsReport(startDate, endDate, profileVouchers, profileLedgers, baseCurrency);

  const getProfitLossAccount = (startDate: Date, endDate: Date): ProfitLossAccount => 
    getProfitLossAccountReport(startDate, endDate, profileTransactions, categories, baseCurrency, exchangeRates);

  const getBalanceSheet = (endDate: Date): BalanceSheet => 
    getBalanceSheetReport(endDate, profileLedgers, baseCurrency, exchangeRates);
  
  const getTotalBalance = (): number => 
    getTotalBalanceReport(profileLedgers, baseCurrency, exchangeRates);

  const getMonthlyIncome = (): number => 
    getMonthlyIncomeReport(profileTransactions, baseCurrency, exchangeRates);

  const getMonthlyExpenses = (): number => 
    getMonthlyExpensesReport(profileTransactions, baseCurrency, exchangeRates);

  const getTransactionsByMonth = (months: number) => 
    getTransactionsByMonthReport(months, profileTransactions, baseCurrency, exchangeRates);

  const getExpensesByCategory = () => 
    getExpensesByCategoryReport(profileTransactions, categories, baseCurrency, exchangeRates);

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
        transactions: profileTransactions,
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
        addTransaction,
        updateTransaction,
        deleteTransaction,
        setBaseCurrency,
        convertAmount,
        getJournalEntries,
        getLedgerAccounts,
        getProfitLossAccount,
        getBalanceSheet,
        getTotalBalance,
        getMonthlyIncome,
        getMonthlyExpenses,
        getTransactionsByMonth,
        getExpensesByCategory,
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