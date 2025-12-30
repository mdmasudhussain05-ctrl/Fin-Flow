import { AccountGroup, Category, ExchangeRate, VoucherType } from "@/types/accounting";

export const defaultAccountGroups: AccountGroup[] = [
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

export const defaultVoucherTypes: VoucherType[] = ["Contra", "Payment", "Receipt", "Journal", "Sales", "Purchase", "Credit Note", "Debit Note"];

export const defaultCategories: Category[] = [
  { id: "1", name: "Food", color: "bg-red-500", icon: "Utensils" },
  { id: "2", name: "Rent", color: "bg-blue-500", icon: "Home" },
  { id: "3", name: "Transport", color: "bg-green-500", icon: "Car" },
  { id: "4", name: "Salary", color: "bg-teal-500", icon: "Briefcase" },
  { id: "5", name: "Entertainment", color: "bg-purple-500", icon: "Film" },
  { id: "6", name: "Shopping", color: "bg-pink-500", icon: "ShoppingCart" },
  { id: "7", name: "Health", color: "bg-orange-500", icon: "Heart" },
  { id: "8", name: "Education", color: "bg-indigo-500", icon: "Book" },
];

export const defaultExchangeRates: ExchangeRate = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.79,
  JPY: 148.5,
  INR: 83.3,
  CAD: 1.36,
  AUD: 1.52,
};