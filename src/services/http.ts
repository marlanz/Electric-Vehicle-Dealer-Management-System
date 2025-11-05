// src/services/http.ts
import axios from "axios";
import { storage } from "./storage";
import { FIXED_DEALER_ID } from "../utils/dealer";

export const http = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API,
  timeout: 20000,
});

// refresh instance riêng
const refreshHttp = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API,
  timeout: 20000,
});

function isAuthRouteUrl(u?: string) {
  const url = (u || "").toLowerCase();
  return (
    url.includes("/auth/auth")
  );
}

function enforceDealerId(obj: any) {
  if (!obj || typeof obj !== "object") return;
  if ("dealer_id" in obj) obj.dealer_id = FIXED_DEALER_ID;
}

// ✅ Duy nhất 1 request interceptor, có guard cho /auth/*
http.interceptors.request.use((config) => {
  const { method, url, baseURL } = config;
  console.log(`[HTTP ->] ${method?.toUpperCase()} ${baseURL}${url}`);

  // ✅ Auth routes phải sạch header
  if (isAuthRouteUrl(config.url)) {
    if (config.headers) delete (config.headers as any).Authorization;
    return config;
  }
  return config;
});

// --- Response interceptor giữ nguyên skip cho auth + refresh cho non-auth ---
let didLogout = false;
http.interceptors.response.use(
  (res) => {
    const m = res.config.method?.toUpperCase();
    const u = (res.config.baseURL ?? "") + (res.config.url ?? "");
    console.log(`[HTTP <-] ${m} ${u} - ${res.status}`);
    try { console.log("[HTTP <-] data:", JSON.stringify(res.data)); } catch {}
    return res;
  },
  async (err) => {
    const original = err?.config || {};
    const status = err?.response?.status;
    if (!status) return Promise.reject(err);

    // ❗ không refresh/đăng xuất khi lỗi thuộc /auth/*
    if (isAuthRouteUrl(original.url)) {
      console.log("⚠️ Auth route error, skip refresh:", status, (original.url || "").toLowerCase());
      return Promise.reject(err);
    }

    if ((status === 401 || status === 403) && !original._retry) {
      try {
        original._retry = true;
        const newToken = await refreshAccessToken();
        if (!newToken) throw new Error("REFRESH_FAILED");
        original.headers = { ...(original.headers || {}), Authorization: `Bearer ${newToken}` };
        return http(original);
      } catch {
        console.log("🔒 Refresh failed → logout");
        if (!didLogout) {
          didLogout = true;
          onAuthFail?.();
          setAuthToken(null);
          setTimeout(() => { didLogout = false; }, 800);
        }
        return Promise.reject(err);
      }
    }
    return Promise.reject(err);
  }
);

let onAuthFail: (() => void) | null = null;
export const setOnAuthFail = (fn: () => void) => (onAuthFail = fn);

let onTokenRefreshed: ((token: string, refreshToken?: string | null) => void) | null = null;
export const setOnTokenRefreshed = (fn: (t: string, rt?: string | null) => void) => (onTokenRefreshed = fn);

export const setAuthToken = (token?: string | null) => {
  if (token) http.defaults.headers.common.Authorization = `Bearer ${token}`;
  else delete http.defaults.headers.common.Authorization;
};

/* ------------ Refresh core ------------ */
let isRefreshing = false;
let waiters: Array<(t: string) => void> = [];
function notify(t: string) { waiters.forEach((cb) => cb(t)); waiters = []; }

async function getPersistedAuth() {
  return storage.get<{ token: string; refreshToken?: string; user: any }>("auth");
}
async function setPersistedAuthToken(token: string, refreshToken?: string | null) {
  const current = (await getPersistedAuth()) ?? { user: null, token: null, refreshToken: null };
  await storage.set("auth", { ...current, token, refreshToken: refreshToken ?? current.refreshToken ?? null });
}

async function refreshAccessToken(): Promise<string | null> {
  if (isRefreshing) return new Promise((resolve) => waiters.push(resolve));
  isRefreshing = true;
  try {
    const saved = await getPersistedAuth();
    const refreshToken = saved?.refreshToken ?? null;
    if (!refreshToken) throw new Error("NO_REFRESH_TOKEN");

    const res = await refreshHttp.post("/auth/refresh", { refreshToken });

    const newToken =
      res.data?.data?.accessToken ??
      res.data?.accessToken ??
      res.data?.token ?? null;

    const newRefresh =
      res.data?.data?.refreshToken ?? res.data?.refreshToken ?? null;

    if (!newToken) throw new Error("NO_TOKEN_IN_REFRESH_RESPONSE");

    setAuthToken(newToken);
    await setPersistedAuthToken(newToken, newRefresh ?? undefined);
    onTokenRefreshed?.(newToken, newRefresh ?? undefined);
    notify(newToken);

    isRefreshing = false;
    return newToken;
  } catch {
    isRefreshing = false;
    waiters = [];
    return null;
  }
}
