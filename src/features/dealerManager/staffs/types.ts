// src/features/dealerManager/staffs/types.ts
export type DMStaff = {
  id: string;
  full_name: string;
  email: string;
  phone?: string | null;
  role: "DEALER_STAFF" | "DEALER_MANAGER";
  status: "ACTIVE" | "INACTIVE";
  created_at: string;
};

export type CreateStaffBody = {
  full_name: string;
  email: string;
  phone?: string;
  role: "DEALER_STAFF";
};

export type UpdateStaffBody = Partial<Omit<CreateStaffBody, "role">> & {
  status?: "ACTIVE" | "INACTIVE";
};
