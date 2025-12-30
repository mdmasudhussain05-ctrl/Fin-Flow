import { InventoryItem, Warehouse, StockMovement } from "@/types/accounting";

export const addInventoryItem = (
  item: Omit<InventoryItem, "id" | "profileId">,
  profileId: string,
  setInventoryItems: React.Dispatch<React.SetStateAction<InventoryItem[]>>
) => {
  const newItem = { ...item, id: `item-${Date.now()}`, profileId };
  setInventoryItems((prev) => [...prev, newItem]);
};

export const updateInventoryItem = (
  id: string,
  item: Partial<InventoryItem>,
  setInventoryItems: React.Dispatch<React.SetStateAction<InventoryItem[]>>
) => {
  setInventoryItems((prev) =>
    prev.map((i) => (i.id === id ? { ...i, ...item } : i))
  );
};

export const deleteInventoryItem = (
  id: string,
  setInventoryItems: React.Dispatch<React.SetStateAction<InventoryItem[]>>
) => {
  setInventoryItems((prev) => prev.filter((i) => i.id !== id));
};

export const addWarehouse = (
  warehouse: Omit<Warehouse, "id" | "profileId">,
  profileId: string,
  setWarehouses: React.Dispatch<React.SetStateAction<Warehouse[]>>
) => {
  const newWarehouse = { ...warehouse, id: `wh-${Date.now()}`, profileId };
  setWarehouses((prev) => [...prev, newWarehouse]);
};

export const updateWarehouse = (
  id: string,
  warehouse: Partial<Warehouse>,
  setWarehouses: React.Dispatch<React.SetStateAction<Warehouse[]>>
) => {
  setWarehouses((prev) =>
    prev.map((wh) => (wh.id === id ? { ...wh, ...warehouse } : wh))
  );
};

export const deleteWarehouse = (
  id: string,
  setWarehouses: React.Dispatch<React.SetStateAction<Warehouse[]>>
) => {
  setWarehouses((prev) => prev.filter((wh) => wh.id !== id));
};

export const addStockMovement = (
  movement: Omit<StockMovement, "id" | "profileId">,
  profileId: string,
  setStockMovements: React.Dispatch<React.SetStateAction<StockMovement[]>>
) => {
  const newMovement = { ...movement, id: `sm-${Date.now()}`, profileId };
  setStockMovements((prev) => [...prev, newMovement]);
};

export const updateStockMovement = (
  id: string,
  movement: Partial<StockMovement>,
  setStockMovements: React.Dispatch<React.SetStateAction<StockMovement[]>>
) => {
  setStockMovements((prev) =>
    prev.map((sm) => (sm.id === id ? { ...sm, ...movement } : sm))
  );
};

export const deleteStockMovement = (
  id: string,
  setStockMovements: React.Dispatch<React.SetStateAction<StockMovement[]>>
) => {
  setStockMovements((prev) => prev.filter((sm) => sm.id !== id));
};