// src/features/dm/orders/types.ts
export type DMOrderItem = {
  id: string;
  vehicle_id: string;
  model: string;
  version?: string | null;
  color?: string | null;
  qty: number;
};

export type DMOrder = {
  id: string;
  dealer_id: string;
  status: "DRAFT" | "SUBMITTED" | "QUOTED" | "ACCEPTED" | "CANCELLED" | "PAID" | "SHIPPED" | "RECEIVED";
  total: string; // server string
  created_at: string;
  items: DMOrderItem[];
  // nếu hãng trả quote
  quote_total?: string | null;
  quote_note?: string | null;
};

export type CreateDMOrderBody = {
  items: { vehicle_id: string; qty: number }[];
};

export type UpdateDMOrderStatusBody = {
  status: DMOrder["status"];
  note?: string;
};

export type UploadPaymentBody = {
  amount: number;
  // file upload: ở mobile có thể gửi multipart/form-data; ở đây demo field proof_url
  proof_url?: string;
};
