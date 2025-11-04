export type OrderLite = {
  id: string;
  dealer_id: string;
  customer_id: string;
  vehicle_id: string;
  quote_id?: string | null;

  base_price: string;   // backend hay trả string tiền tệ
  final_price: string;
  status: string;       // PENDING | CONFIRMED | PREPARED | DELIVERED | CANCELLED | ...

  created_at: string;
  updated_at: string;

  // joined (nếu backend có)
  customer_name?: string;
  customer_phone?: string;
  vehicle_model?: string;
  vehicle_version?: string | null;
  vehicle_color?: string | null;
};
