import { Category } from "@/types/accounting";

export const addCategory = (
  category: Omit<Category, "id">,
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>
) => {
  const newCategory = { ...category, id: `cat-${Date.now()}` };
  setCategories((prev) => [...prev, newCategory]);
};

export const updateCategory = (
  id: string,
  updatedCategory: Partial<Category>,
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>
) => {
  setCategories((prev) =>
    prev.map((c) => (c.id === id ? { ...c, ...updatedCategory } : c))
  );
};

export const deleteCategory = (
  id: string,
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>
) => {
  setCategories((prev) => prev.filter((c) => c.id !== id));
  // TODO: Reassign categories in vouchers/transactions
};