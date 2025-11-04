export type PromotionLite = {
  promoId: string;
  name: string;
  source?: string | null;
  type?: "FIXED_DISCOUNT" | "PERCENT_DISCOUNT" | string;
  endDate?: string | null; // ISO
  summary?: string | null;
};
export type QuoteDetail = QuoteLite;
export type QuoteLite = {
  id: string;
  dealer_id: string;
  customer_id: string;
  vehicle_id: string;
  base_price: string;     // server trả string
  final_price: string;    // server trả string
  status: string;         // "DRAFT" | "SENT" | "ACCEPTED" | "REJECTED" | ...
  created_by: string;
  created_at: string;
  updated_at: string | null;
  valid_until: string | null;

  // denormalized fields
  customer_name?: string | null;
  customer_phone?: string | null;
  customer_email?: string | null;
  vehicle_model?: string | null;
  vehicle_version?: string | null;
  vehicle_color?: string | null;
  dealer_name?: string | null;
  dealer_code?: string | null;
  promotion_name?: string | null;
  discount_type?: string | null;   // "PERCENT" | "FIXED_DISCOUNT" ...
  discount_value?: string | null;  // server trả string
  created_by_name?: string | null;
};
