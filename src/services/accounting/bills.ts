import { Bill } from "@/types/accounting";

export const addBill = (
  bill: Omit<Bill, "id" | "profileId">,
  profileId: string,
  setBills: React.Dispatch<React.SetStateAction<Bill[]>>
) => {
  const newBill = { ...bill, id: `bill-${Date.now()}`, profileId };
  setBills((prev) => [...prev, newBill]);
};

export const updateBill = (
  id: string,
  updatedBill: Partial<Bill>,
  setBills: React.Dispatch<React.SetStateAction<Bill[]>>
) => {
  setBills((prev) =>
    prev.map((b) => (b.id === id ? { ...b, ...updatedBill } : b))
  );
};

export const deleteBill = (
  id: string,
  setBills: React.Dispatch<React.SetStateAction<Bill[]>>
) => {
  setBills((prev) => prev.filter((b) => b.id !== id));
};