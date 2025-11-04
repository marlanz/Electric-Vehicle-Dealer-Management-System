// src/features/dm/inventory/types.ts
export type DMInventoryItem = {
  id: string;
  vehicle_id: string; // id mẫu xe của hãng
  vin?: string | null;
  color?: string | null;
  model: string;
  version?: string | null;
  year?: number | null;
  status: "IN_STOCK" | "RESERVED" | "SOLD";
  created_at: string;
};

export type CreateInventoryBody = {
  vehicle_id: string;
  vin?: string;
  color?: string;
};

export type UpdateInventoryBody = Partial<CreateInventoryBody> & {
  status?: DMInventoryItem["status"];
};
