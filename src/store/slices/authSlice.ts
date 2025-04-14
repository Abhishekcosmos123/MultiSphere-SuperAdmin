import { AuthState, OTPData, User, Token, LoginCredentials, LogoutToken } from '@/types/auth';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: AuthState = {
  user: typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('user') || 'null') : null,
  token: typeof window !== 'undefined' ? localStorage.getItem('token') : null,
  loading: false,
  error: null,
  isAuthenticated: false,
  otpResponse: undefined,
  loginMessage: '',  
  otpSent: false,
  success: false,
  message: '',
  isLoading: false,
};


const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginRequest: (state, action: PayloadAction<LoginCredentials>) => {
      state.loading = true;
      state.error = null;
    },
    
    loginSuccess: (state, action: PayloadAction<{ message: string }>) => {
      state.loading = false;
      state.error = null;
      state.loginMessage = action.payload.message;
      state.otpSent = true;
    },
    
    loginFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
      state.otpSent = false;
    },
    logoutRequest: (state, action: PayloadAction<LogoutToken>) => {
      state.loading = true;
      state.error = null;
    },
    logoutSuccess: (state) => {
      state.loading = false;
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.error = null;
    },
    logoutFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.isAuthenticated = false;
      state.user = null;
      state.error = action.payload;
    },
    verifyOtpRequest: (state, action: PayloadAction<OTPData>) => {
      state.loading = true;
      state.error = null;
    },
    verifyOtpSuccess: (
      state,
      action: PayloadAction<{
        success: boolean;
        message: string;
        data: { user: User; token: Token };
      }>
    ) => {
      state.loading = false;
      state.token = action.payload.data.token;
      state.user = action.payload.data.user;
      state.isAuthenticated = action.payload.success;
      state.otpResponse = action.payload;
    },
    verifyOtpFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    clearAuthMessages: (state) => {
      state.loginMessage = '';
      state.error = null;
    },
    resendOtpRequest(state, action: PayloadAction<{ email: string }>) {
      state.isLoading = true;
      state.error = null;
    },
    resendOtpSuccess(state, action: PayloadAction<{ success: boolean; message: string }>) {
      state.isLoading = false;
      state.success = action.payload.success;
      state.message = action.payload.message;
    },
    resendOtpFailure(state, action: PayloadAction<string>) {
      state.isLoading = false;
      state.error = action.payload;
    },
  },
});

export const {
  loginRequest,
  loginSuccess,
  loginFailure,
  logoutRequest,
  logoutSuccess,
  logoutFailure,
  verifyOtpRequest,
  verifyOtpSuccess,
  verifyOtpFailure,
  clearAuthMessages,
  resendOtpRequest,
  resendOtpSuccess,
  resendOtpFailure,
} = authSlice.actions;

export default authSlice.reducer;
