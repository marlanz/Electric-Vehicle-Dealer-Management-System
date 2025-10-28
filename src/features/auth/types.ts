export type Role = "DEALER_STAFF" | "DEALER_MANAGER" | "EVM_STAFF" | "ADMIN";
export type User = {
    id: string;
    email: string;
    full_name: string;
    role: Role;
    dealer_id?: string;
    status: "active" | "inactive";
};
export type AuthState = {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
};
export type LoginPayload = { email: string; password: string };
export type LoginResponse = { 
    data: { user: User, token: string };
    success: boolean;
};
