import { Invoice } from "@/types/accounting";

export const addInvoice = (
  invoice: Omit<Invoice, "id" | "profileId">,
  profileId: string,
  setInvoices: React.Dispatch<React.SetStateAction<Invoice[]>>
) => {
  const newInvoice = { ...invoice, id: `inv-${Date.now()}`, profileId };
  setInvoices((prev) => [...prev, newInvoice]);
};

export const updateInvoice = (
  id: string,
  invoice: Partial<Invoice>,
  setInvoices: React.Dispatch<React.SetStateAction<Invoice[]>>
) => {
  setInvoices((prev) =>
    prev.map((inv) => (inv.id === id ? { ...inv, ...invoice } : inv))
  );
};

export const deleteInvoice = (
  id: string,
  setInvoices: React.Dispatch<React.SetStateAction<Invoice[]>>
) => {
  setInvoices((prev) => prev.filter((inv) => inv.id !== id));
};