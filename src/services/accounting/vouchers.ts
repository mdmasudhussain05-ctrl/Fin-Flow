import { Voucher } from "@/types/accounting";

export const createVoucher = (
  voucher: Omit<Voucher, "id" | "profileId">,
  profileId: string,
  setVouchers: React.Dispatch<React.SetStateAction<Voucher[]>>
) => {
  // Basic validation: sum of debits must equal sum of credits
  const totalDebits = voucher.entries
    .filter((e) => e.type === "debit")
    .reduce((sum, e) => sum + e.amount, 0);
  const totalCredits = voucher.entries
    .filter((e) => e.type === "credit")
    .reduce((sum, e) => sum + e.amount, 0);

  if (totalDebits !== totalCredits) {
    console.error("Voucher creation failed: Debits and Credits do not match.");
    return;
  }

  const newVoucher = { ...voucher, id: `v-${Date.now()}`, profileId };
  setVouchers((prev) => [...prev, newVoucher]);
};

export const updateVoucher = (
  id: string,
  voucher: Partial<Voucher>,
  setVouchers: React.Dispatch<React.SetStateAction<Voucher[]>>
) => {
  setVouchers((prev) =>
    prev.map((v) => (v.id === id ? { ...v, ...voucher } : v))
  );
};

export const deleteVoucher = (
  id: string,
  setVouchers: React.Dispatch<React.SetStateAction<Voucher[]>>
) => {
  setVouchers((prev) => prev.filter((v) => v.id !== id));
};