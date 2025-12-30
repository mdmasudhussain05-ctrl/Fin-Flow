import { Transaction } from "@/types/accounting";

export const addTransaction = (
  transaction: Omit<Transaction, "id" | "profileId">,
  profileId: string,
  setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>
) => {
  const newTransaction = { ...transaction, id: `t-${Date.now()}`, profileId };
  setTransactions((prev) => [...prev, newTransaction]);
};

export const updateTransaction = (
  id: string,
  updatedTransaction: Partial<Transaction>,
  setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>
) => {
  setTransactions((prev) =>
    prev.map((t) => (t.id === id ? { ...t, ...updatedTransaction } : t))
  );
};

export const deleteTransaction = (
  id: string,
  setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>
) => {
  setTransactions((prev) => prev.filter((t) => t.id !== id));
};