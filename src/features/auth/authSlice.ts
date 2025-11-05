import { http, setAuthToken } from "../../services/http";
import { storage } from "../../services/storage";
import type { RootState } from "../../store";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { AuthState, LoginPayload, LoginResponse, User } from "./types";
import { ref } from "yup";



const AUTH_KEY = "auth";

export const bootstrapAuth = createAsyncThunk<AuthState, void, { state: RootState }>(
  "auth/bootstrap",
  async (_, { getState }) => {
    const saved = await storage.get<{ token: string; refreshToken?: string; user: User }>(AUTH_KEY);
    if (saved?.token) setAuthToken(saved.token);
    return {
      user: saved?.user ?? null,
      token: saved?.token ?? null,
      refreshToken: saved?.refreshToken ?? null,
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

export const logoutAsync = createAsyncThunk<void, void>(
  "auth/logoutAsync",
  async () => {
    // làm side-effects ở đây
    await storage.del(AUTH_KEY);
    setAuthToken(null);
  }
);
export const fetchProfile = createAsyncThunk<User>(
  "auth/fetchProfile",
  async (_, { rejectWithValue }) => {
    try {
      const res = await http.get("/auth/profile"); // GET /api/v1/auth/profile
      const user = res.data?.data?.user;
      if (!user) throw new Error("Empty profile");
      // Đồng bộ storage (để lần sau bootstrap có đủ user)
      const saved = await storage.get<any>(AUTH_KEY);
      await storage.set(AUTH_KEY, { ...(saved ?? {}), user });
      return user as User;
    } catch (e: any) {
      return rejectWithValue(e?.message || "Fetch profile failed");
    }
  }
);

const initialState: AuthState = {
  user: null,
  token: null,
  loading: true,     // true để chờ bootstrapAuth
  refreshToken: null,
  error: null,
};

const slice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      state.error = null;
      state.refreshToken = null;
    },
    setTokens(state, action: { payload: { token: string; refreshToken?: string | null } }) {
      state.token = action.payload.token;
      if (action.payload.refreshToken !== undefined) {
        state.refreshToken = action.payload.refreshToken ?? null;
      }
    },
  },
  extraReducers: (b) => {
    b.addCase(bootstrapAuth.fulfilled, (s, a) => {
      s.user = a.payload.user;
      s.token = a.payload.token;
      s.loading = false;
    });
    b.addCase(login.pending, (s) => {
      s.error = null;
      s.loading = true;
    });
    b.addCase(login.fulfilled, (s, a) => {
      s.loading = false;
      s.user = a.payload.data.user;
      s.token = a.payload.data.token;
      s.refreshToken = a.payload.data.refreshToken ?? null;
    });
    b.addCase(login.rejected, (s, a) => {
      s.loading = false;
      s.error = a.error.message ?? "Login failed";
    });
    b.addCase(fetchProfile.pending, (s) => {
      s.error = null;
      // không bật global loading để UI mượt hơn
    });
    b.addCase(fetchProfile.fulfilled, (s, a) => {
      s.user = a.payload;
    });
    b.addCase(fetchProfile.rejected, (s, a) => {
      s.error = (a.payload as string) ?? a.error.message ?? "Fetch profile failed";
    });
    b.addCase(logoutAsync.fulfilled, (s) => {
      s.user = null;
      s.token = null;
      s.error = null;
      s.refreshToken = null;
    });
  },
});

export const { logout, setTokens } = slice.actions;
export default slice.reducer;

// Side-effect: persist & set header sau khi login
// Gợi ý: gọi ở component sau khi login thành công
export const persistAuth = async (res: LoginResponse) => {
  const token = res.data.token;
  const refreshToken = res.data.refreshToken ?? (res.data as any).refresh_token ?? null;
  await storage.set(AUTH_KEY, { token, refreshToken, user: res.data.user });
  setAuthToken(token);
};
// Selectors
export const selectAuth = (s: RootState) => s.auth;
export const selectUser = (s: RootState) => s.auth.user;
export const selectToken = (s: RootState) => s.auth.token;
export const selectAuthLoading = (s: RootState) => s.auth.loading;
