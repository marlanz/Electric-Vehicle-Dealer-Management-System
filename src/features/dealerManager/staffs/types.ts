export type DMStaff = {
  id: string;
  email: string;
  full_name: string;
  role: "DEALER_STAFF" | "DEALER_MANAGER" | "ADMIN" | string;
  dealer_id: string;
  status: "ACTIVE" | "INACTIVE";
  created_at: string;
  updated_at: string;
  phone?: string;
  dealers?: {
    id: string;
    code: string;
    name: string;
    address: string;
    contact_email: string;
    contact_phone: string;
  };
};

export type CreateStaffBody = {
  email: string;
  password: string;
  full_name: string;
  role: "DEALER_STAFF";
  dealer_id: string;
  status: "ACTIVE" | "INACTIVE";
};
export type UpdateStaffBody = Partial<{
  full_name: string;
  email: string;
  status: "ACTIVE" | "INACTIVE" | string;
}>;
