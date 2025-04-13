import { createSlice, PayloadAction } from '@reduxjs/toolkit';
// import { LoginFormData, RegisterFormData } from '@/lib/validations/auth';

/**
 * Type representing the user object
 */
interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  // Add other fields as necessary
}

/**
 * Authentication state interface
 * @property user - Currently logged in user data
 * @property token - JWT authentication token
 * @property loading - Loading state for auth operations
 * @property error - Error message if auth operation fails
 */
interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

/**
 * Initial state for auth slice
 * Attempts to get token from localStorage if available
 */
const initialState: AuthState = {
  user: null,
  token: typeof window !== 'undefined' ? localStorage.getItem('token') : null,
  loading: false,
  error: null,
};

/**
 * Auth slice with reducers for handling authentication state
 * Includes actions for:
 * - Login (request, success, failure)
 * - Register (request, success, failure)
 * - Logout
 */
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Login actions
    loginRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.loading = false;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.error = null;
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    // Logout action - clears user data and token
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.error = null;
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    },
  },
});

// Export actions for use in components and sagas
export const {
  loginRequest,
  loginSuccess,
  loginFailure,
  logout,
} = authSlice.actions;

export default authSlice.reducer;
