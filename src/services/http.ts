import axios from "axios";

export const http = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API,
  timeout: 20000,
});

export const setAuthToken = (token?: string | null) => {
  if (token) http.defaults.headers.common.Authorization = `Bearer ${token}`;
  else delete http.defaults.headers.common.Authorization;
};
