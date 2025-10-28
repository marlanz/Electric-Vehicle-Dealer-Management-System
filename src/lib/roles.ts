export type Role = "DEALER_STAFF" | "DEALER_MANAGER" | "EVM_STAFF" | "ADMIN";

export const ROLE_HOME: Record<Role, string> = {
  DEALER_STAFF: "/(dealer)/(tabs)",
  DEALER_MANAGER: "/(dealer)/(tabs)",
  EVM_STAFF: "/(evm)/(tabs)",
  ADMIN: "/(evm)/(tabs)",
};

export const PUBLIC_PREFIXES = ["/(auth)"];
export const AUTH_SHARED_PREFIXES = ["/(shared)"];
