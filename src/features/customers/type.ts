// src/features/customers/type.ts
export type CustomerLite = {
  customerId: string;
  fullName: string;
  phone: string;
  email?: string | null;
};

export type CustomerCreatePayload = {
  full_name: string;
  phone: string;
  email?: string;
  address?: string;
  id_no?: string;
  dob?: string;     // "YYYY-MM-DD"
  notes?: string;
};
