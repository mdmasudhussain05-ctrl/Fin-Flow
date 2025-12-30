import { useState, useEffect } from "react";
import { useProfile } from "@/context/ProfileContext";
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
} from "@/types/accounting";
import {
  defaultAccountGroups,
  defaultVoucherTypes,
  defaultCategories,
  defaultExchangeRates,
} from "@/data/accounting";

interface AccountingState {
  accountGroups: AccountGroup[];
  setAccountGroups: React.Dispatch<React.SetStateAction<AccountGroup[]>>;
  ledgers: Ledger[];
  setLedgers: React.Dispatch<React.SetStateAction<Ledger[]>>;
  vouchers: Voucher[];
  setVouchers: React.Dispatch<React.SetStateAction<Voucher[]>>;
  inventoryItems: InventoryItem[];
  setInventoryItems: React.Dispatch<React.SetStateAction<InventoryItem[]>>;
  warehouses: Warehouse[];
  setWarehouses: React.Dispatch<React.SetStateAction<Warehouse[]>>;
  stockMovements: StockMovement[];
  setStockMovements: React.Dispatch<React.SetStateAction<StockMovement[]>>;
  invoices: Invoice[];
  setInvoices: React.Dispatch<React.SetStateAction<Invoice[]>>;
  categories: Category[];
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
  bills: Bill[];
  setBills: React.Dispatch<React.SetStateAction<Bill[]>>;
  transactions: Transaction[];
  setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>;
  baseCurrency: string;
  setBaseCurrency: React.Dispatch<React.SetStateAction<string>>;
  exchangeRates: ExchangeRate;
  voucherTypes: VoucherType[];
}

export const useAccountingState = (): AccountingState => {
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

  const [categories, setCategories] = useState<Category[]>(() => {
    const saved = localStorage.getItem("categories");
    return saved ? JSON.parse(saved) : defaultCategories;
  });

  const [bills, setBills] = useState<Bill[]>(() => {
    const saved = localStorage.getItem("bills");
    return saved ? JSON.parse(saved) : [];
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem("transactions");
    return saved ? JSON.parse(saved) : [];
  });

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
  useEffect(() => { localStorage.setItem("transactions", JSON.stringify(transactions)); }, [transactions]);
  useEffect(() => { localStorage.setItem("baseCurrency", baseCurrency); }, [baseCurrency]);

  return {
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
  };
};