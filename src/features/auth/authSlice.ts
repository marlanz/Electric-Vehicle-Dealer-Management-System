import { http, setAuthToken } from "@/src/services/http";
import { storage } from "@/src/services/storage";
import type { RootState } from "@/src/store";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { AuthState, LoginPayload, LoginResponse, User } from "./types";



const AUTH_KEY = "auth";

export const bootstrapAuth = createAsyncThunk<AuthState, void, { state: RootState }>(
  "auth/bootstrap",
  async (_, { getState }) => {
    const saved = await storage.get<{ token: string; user: User }>(AUTH_KEY);
    if (saved?.token) setAuthToken(saved.token);
    return {
      user: saved?.user ?? null,
      token: saved?.token ?? null,
      loading: false,
      error: null,
    };
  }
);

export const login = createAsyncThunk<LoginResponse, LoginPayload>(
  "auth/login",
  async (body) => {
    const res = await http.post<LoginResponse>("/auth/login", body);
    console.log('res /auth/login', res.data);
    return res.data;
  }
);

export const logout = createAsyncThunk<void, void>(
  "auth/logout",
  async () => {
    await storage.del(AUTH_KEY);
    setAuthToken(null);
  }
);

const initialState: AuthState = {
  user: null,
  token: null,
  loading: true,     // true để chờ bootstrapAuth
  error: null,
};

const slice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (b) => {
    b.addCase(bootstrapAuth.fulfilled, (s, a) => {
      s.user = a.payload.user;
      s.token = a.payload.token;
      s.loading = false;
    });
    b.addCase(login.pending, (s) => {
      s.error = null; s.loading = true;
    });
    b.addCase(login.fulfilled, (s, a) => {
      s.loading = false;
      s.user = a.payload.data.user;
      s.token = a.payload.data.token;
    });
    b.addCase(login.rejected, (s, a) => {
      s.loading = false;
      s.error = a.error.message ?? "Login failed";
    });
    b.addCase(logout.fulfilled, (s) => {
      s.user = null; s.token = null; s.error = null;
    });
  }
});

export default slice.reducer;

// Side-effect: persist & set header sau khi login
// Gợi ý: gọi ở component sau khi login thành công
export const persistAuth = async (data: LoginResponse) => {
  await storage.set(AUTH_KEY, { token: data.data.token, user: data.data.user });
  setAuthToken(data.data.token);
};

// Selectors
export const selectAuth = (s: RootState) => s.auth;
export const selectUser = (s: RootState) => s.auth.user;
export const selectToken = (s: RootState) => s.auth.token;
export const selectAuthLoading = (s: RootState) => s.auth.loading;
