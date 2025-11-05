// src/services/http.ts
import axios from "axios";
import { storage } from "./storage";
import { FIXED_DEALER_ID } from "../utils/dealer";
let didLogout = false;
let onAuthFail: (() => void) | null = null;
export const setOnAuthFail = (fn: () => void) => (onAuthFail = fn);

// ✅ NEW: callback khi refresh thành công (để nơi khác dispatch + persist)
let onTokenRefreshed: ((token: string, refreshToken?: string | null) => void) | null = null;
export const setOnTokenRefreshed = (fn: (t: string, rt?: string | null) => void) => (onTokenRefreshed = fn);

export const http = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API,
  timeout: 20000,
});

// instance riêng cho refresh để tránh đệ quy interceptor
const refreshHttp = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API,
  timeout: 20000,
});

http.interceptors.request.use(async (config) => {
  const { method, url, baseURL } = config;
  console.log(`[HTTP ->] ${method?.toUpperCase()} ${baseURL}${url}`);
  return config;
});
function enforceDealerId(obj: any) {
  if (!obj || typeof obj !== "object") return;
  if ("dealer_id" in obj) {
    // luôn ép theo yêu cầu
    obj.dealer_id = FIXED_DEALER_ID;
  }
}

http.interceptors.request.use((config) => {
  // Nếu API này có params hoặc data chứa dealer_id, ép lại giá trị
  if (config.params) enforceDealerId(config.params);
  if (config.data) enforceDealerId(config.data);

  // Nếu muốn mặc định thêm dealer_id cho các GET có query “thường có dealer_id”:
  // (ví dụ /orders, /quotes, /customers…) mà client quên set
  const url = (config.url || "").toLowerCase();
  const likelyNeedDealerId =
    url.includes("/orders") || url.includes("/quotes") || url.includes("/customers");

  if (likelyNeedDealerId) {
    // Nếu chưa có params thì tạo
    if (!config.params) config.params = {};
    if (!("dealer_id" in config.params)) {
      config.params.dealer_id = FIXED_DEALER_ID;
    }
  }

  return config;
});
http.interceptors.response.use(
  (res) => {
    // ✅ LOG RESPONSE SUCCESS
    const m = res.config.method?.toUpperCase();
    const u = (res.config.baseURL ?? "") + (res.config.url ?? "");
    console.log(`[HTTP <-] ${m} ${u} - ${res.status}`);
    // nếu muốn xem body:
    try { console.log("[HTTP <-] data:", JSON.stringify(res.data)); } catch {}
    return res;
  },
  async (err) => {
    const status = err?.response?.status;
    const original = err?.config || {};
    if (!status) return Promise.reject(err);

    if ((status === 401 || status === 403) && !original._retry) {
      try {
        original._retry = true;
        const newToken = await refreshAccessToken();
        if (!newToken) throw new Error("REFRESH_FAILED");
        original.headers = { ...(original.headers || {}), Authorization: `Bearer ${newToken}` };
        return http(original);
      } catch (e) {
        console.log("🔒 Refresh failed → logout");
        if (!didLogout) {
          didLogout = true;
          onAuthFail?.();
          // xóa header để các request sau không spam
          setAuthToken(null);
          setTimeout(() => { didLogout = false; }, 1000); // reset sau 1s
        }
        return Promise.reject(err);
      }
    }

    return Promise.reject(err);
  }
);

export const setAuthToken = (token?: string | null) => {
  if (token) http.defaults.headers.common.Authorization = `Bearer ${token}`;
  else delete http.defaults.headers.common.Authorization;
};

/* ------------ Refresh core (không import store/authSlice) ------------ */
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

    // 🚩 TUỲ BACKEND: điều chỉnh key body / field response cho đúng
    const res = await refreshHttp.post("/auth/refresh", { refreshToken });

    const newToken =
      res.data?.data?.accessToken ??       // <-- accessToken nằm trong data
      res.data?.accessToken ??             // (phòng trường hợp server đổi)
      res.data?.token ?? null;
    const newRefresh =
      res.data?.data?.refreshToken ?? res.data?.refreshToken ?? null;

    if (!newToken) throw new Error("NO_TOKEN_IN_REFRESH_RESPONSE");

    // 1) set header cho axios
    setAuthToken(newToken);
    // 2) lưu storage (để app khởi động lại vẫn dùng token mới)
    await setPersistedAuthToken(newToken, newRefresh ?? undefined);
    // 3) báo cho app (Redux) cập nhật state
    onTokenRefreshed?.(newToken, newRefresh ?? undefined);
    // 4) giải phóng các request pending
    notify(newToken);

    isRefreshing = false;
    return newToken;
  } catch (e) {
    isRefreshing = false;
    waiters = [];
    return null;
  }
}
