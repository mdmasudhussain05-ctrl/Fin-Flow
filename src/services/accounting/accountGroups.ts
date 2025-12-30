import { AccountGroup } from "@/types/accounting";

export const addAccountGroup = (
  group: Omit<AccountGroup, "id">,
  setAccountGroups: React.Dispatch<React.SetStateAction<AccountGroup[]>>
) => {
  const newGroup = { ...group, id: `ag-${Date.now()}` };
  setAccountGroups((prev) => [...prev, newGroup]);
};

export const updateAccountGroup = (
  id: string,
  group: Partial<AccountGroup>,
  setAccountGroups: React.Dispatch<React.SetStateAction<AccountGroup[]>>
) => {
  setAccountGroups((prev) =>
    prev.map((g) => (g.id === id ? { ...g, ...group } : g))
  );
};

export const deleteAccountGroup = (
  id: string,
  setAccountGroups: React.Dispatch<React.SetStateAction<AccountGroup[]>>
) => {
  setAccountGroups((prev) => prev.filter((g) => g.id !== id && g.parentGroupId !== id)); // Also remove children
};