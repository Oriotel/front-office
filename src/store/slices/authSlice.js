import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authService from '../../services/authService';
import { AUTH_STEPS, REGISTRATION_STATUS } from '../../constants/authConstants';

/**
 * Auth Redux Slice
 * Manages authentication state across the application
 */

// ─── Async Thunks ────────────────────────────────────────

export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await authService.login(credentials);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/register',
  async (data, { rejectWithValue }) => {
    try {
      const response = await authService.register(data);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const verify2FA = createAsyncThunk(
  'auth/verify2FA',
  async (data, { rejectWithValue }) => {
    try {
      const response = await authService.verify2FA(data);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const changePassword = createAsyncThunk(
  'auth/changePassword',
  async (data, { rejectWithValue }) => {
    try {
      const response = await authService.changePassword(data);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await authService.logout();
      return null;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// ─── Initial State ───────────────────────────────────────

const initialState = {
  user: null,
  token: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  registrationStatus: REGISTRATION_STATUS.IDLE,
  registrationMessage: null,
  passwordChangeRequired: false,
  twoFactorPending: false,
  authStep: AUTH_STEPS.LOGIN,
};

// ─── Slice ───────────────────────────────────────────────

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    },
    resetRegistration(state) {
      state.registrationStatus = REGISTRATION_STATUS.IDLE;
      state.registrationMessage = null;
      state.error = null;
    },
    setAuthStep(state, action) {
      state.authStep = action.payload;
    },
    resetAuth() {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    // ── Login ──
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.refreshToken = action.payload.refreshToken;

        if (action.payload.requiresTwoFactor) {
          state.twoFactorPending = true;
          state.authStep = AUTH_STEPS.TWO_FACTOR;
          state.isAuthenticated = false;
        } else if (action.payload.requiresPasswordChange) {
          state.passwordChangeRequired = true;
          state.authStep = AUTH_STEPS.FORCE_PASSWORD_CHANGE;
          state.isAuthenticated = false;
          // Save token for subsequent API calls during password change flow
          if (action.payload.token) localStorage.setItem('auth_token', action.payload.token);
        } else {
          state.isAuthenticated = true;
          state.authStep = AUTH_STEPS.AUTHENTICATED;
          if (action.payload.token) localStorage.setItem('auth_token', action.payload.token);
        }
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // ── Register ──
    builder
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.registrationStatus = REGISTRATION_STATUS.PENDING;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.registrationStatus = REGISTRATION_STATUS.SUCCESS;
        state.registrationMessage = action.payload.message;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.registrationStatus = REGISTRATION_STATUS.ERROR;
      });

    // ── 2FA ──
    builder
      .addCase(verify2FA.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(verify2FA.fulfilled, (state, action) => {
        state.isLoading = false;
        state.twoFactorPending = false;
        state.token = action.payload.token;
        // Persist final token after 2FA
        if (action.payload.token) localStorage.setItem('auth_token', action.payload.token);

        if (state.user?.mustChangePassword) {
          state.passwordChangeRequired = true;
          state.authStep = AUTH_STEPS.FORCE_PASSWORD_CHANGE;
        } else {
          state.isAuthenticated = true;
          state.authStep = AUTH_STEPS.AUTHENTICATED;
        }
      })
      .addCase(verify2FA.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // ── Change Password ──
    builder
      .addCase(changePassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(changePassword.fulfilled, (state) => {
        state.isLoading = false;
        state.passwordChangeRequired = false;
        state.isAuthenticated = true;
        state.authStep = AUTH_STEPS.AUTHENTICATED;
        if (state.user) {
          state.user.mustChangePassword = false;
        }
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // ── Logout ──
    builder
      .addCase(logoutUser.fulfilled, () => {
        localStorage.removeItem('auth_token');
        return initialState;
      });
  },
});

// ─── Exports ─────────────────────────────────────────────

export const { clearError, resetRegistration, setAuthStep, resetAuth } = authSlice.actions;

// Selectors
export const selectAuth = (state) => state.auth;
export const selectUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectIsLoading = (state) => state.auth.isLoading;
export const selectAuthError = (state) => state.auth.error;
export const selectAuthStep = (state) => state.auth.authStep;
export const selectRegistrationStatus = (state) => state.auth.registrationStatus;

export default authSlice.reducer;
