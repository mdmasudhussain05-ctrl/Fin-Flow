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