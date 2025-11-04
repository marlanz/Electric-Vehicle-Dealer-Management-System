import axios from "axios";
let onAuthFail: (() => void) | null = null;
export const setOnAuthFail = (fn: () => void) => (onAuthFail = fn);

export const http = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API,
  timeout: 20000,
});
http.interceptors.request.use(async (config) => {
  const { method, url, baseURL } = config;
  // endpoint chính là `url` trong axios config
  console.log(`[HTTP ->] ${method?.toUpperCase()} ${baseURL}${url}`);
  console.log("[HTTP ->] headers:", config.headers);
  //tới đâu không
  if (config.params) console.log("[HTTP ->] params:", JSON.stringify(config.params));
  if (config.data)   console.log("[HTTP ->] body:",   JSON.stringify(config.data));
  return config;
});
http.interceptors.response.use(
  (res) => {
    console.log(
      `[HTTP <-] ${res.config.method?.toUpperCase()} ${res.config.baseURL}${res.config.url} - ${res.status}`
    );
    console.log("[HTTP <-] data:", JSON.stringify(res.data));
    return res;
  },
  (err) => {
    const status = err?.response?.status;
    if (status === 401 || status === 403) {
      onAuthFail?.();  
      console.log("🔒 [HTTP AUTH FAIL] Triggering onAuthFail callback");
    }
    console.log("❌ [HTTP ERROR]", err?.message);
    console.log("❌ [HTTP ERROR CONFIG]", err?.config?.url);
    console.log("❌ [HTTP ERROR RESPONSE]", err?.response?.status, err?.response?.data);
    return Promise.reject(err);
  }
);
export const setAuthToken = (token?: string | null) => {
  if (token) http.defaults.headers.common.Authorization = `Bearer ${token}`;
  else delete http.defaults.headers.common.Authorization;
};
