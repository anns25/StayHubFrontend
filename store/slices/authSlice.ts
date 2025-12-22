import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { login as apiLogin, register as apiRegister } from '@/lib/api';
import { cookieUtils } from '@/lib/utils/cookies';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'customer' | 'hotel_owner' | 'admin';
  isApproved?: boolean;
  isVerified?: boolean;
  profileImage?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: cookieUtils.getUser(),
  token: cookieUtils.getToken() ?? null,
  isAuthenticated: !!cookieUtils.getToken(),
  loading: false,
  error: null,
};

// Async thunks
export const login = createAsyncThunk(
  'auth/login',
  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const data = await apiLogin(credentials);
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Login failed');
    }
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async (
    userData: { name: string; email: string; password: string; role: 'customer' | 'hotel_owner' },
    { rejectWithValue }
  ) => {
    try {
      const data = await apiRegister(userData);
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Registration failed');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.error = null;
      
      // Sync with cookies
      cookieUtils.setToken(action.payload.token);
      cookieUtils.setUser(action.payload.user);
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      cookieUtils.setUser(action.payload);
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      
      // Clear cookies
      cookieUtils.clearAuth();
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Login
    builder.addCase(login.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(login.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      
      // Sync with cookies
      cookieUtils.setToken(action.payload.token);
      cookieUtils.setUser(action.payload.user);
    });
    builder.addCase(login.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Register
    builder.addCase(register.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(register.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      
      // Sync with cookies
      cookieUtils.setToken(action.payload.token);
      cookieUtils.setUser(action.payload.user);
    });
    builder.addCase(register.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const { setCredentials, setUser, logout, clearError } = authSlice.actions;
export default authSlice.reducer;