import { Ledger } from "@/types/accounting";

export const addLedger = (
  ledger: Omit<Ledger, "id" | "profileId">,
  profileId: string,
  setLedgers: React.Dispatch<React.SetStateAction<Ledger[]>>
) => {
  const newLedger = { ...ledger, id: `l-${Date.now()}`, profileId };
  setLedgers((prev) => [...prev, newLedger]);
};

export const updateLedger = (
  id: string,
  ledger: Partial<Ledger>,
  setLedgers: React.Dispatch<React.SetStateAction<Ledger[]>>
) => {
  setLedgers((prev) =>
    prev.map((l) => (l.id === id ? { ...l, ...ledger } : l))
  );
};

export const deleteLedger = (
  id: string,
  setLedgers: React.Dispatch<React.SetStateAction<Ledger[]>>
) => {
  setLedgers((prev) => prev.filter((l) => l.id !== id));
  // TODO: Handle associated vouchers/transactions
};