import axios from "axios";
import { logout } from "../features/auth/authSlice";
import { store } from "../store";
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
  if (config.params) console.log("[HTTP ->] params:", JSON.stringify(config.params));
  if (config.data)   console.log("[HTTP ->] body:",   JSON.stringify(config.data));
  return config;
});
http.interceptors.response.use(
  (res) => {
    console.log(`[HTTP <-] ${res.config.method?.toUpperCase()} ${res.config.baseURL}${res.config.url} - ${res.status}`);
    console.log("[HTTP <-] data:", JSON.stringify(res.data));
    return res;
  },
  (err) => {
    const status = err?.response?.status;
    if (status === 401 || status === 403) {
      // logout 1 lần duy nhất
      if (onAuthFail) onAuthFail();
      store.dispatch(logout());
    }
    return Promise.reject(err);
  }
);
export const setAuthToken = (token?: string | null) => {
  if (token) http.defaults.headers.common.Authorization = `Bearer ${token}`;
  else delete http.defaults.headers.common.Authorization;
};
