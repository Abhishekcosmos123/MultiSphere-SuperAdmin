import { call, put, takeLatest } from 'redux-saga/effects';
import { PayloadAction } from '@reduxjs/toolkit';
import { loginSuccess, loginFailure } from '../slices/authSlice';
import { LoginFormData } from '@/lib/validations/auth';

// Define the expected response structure from API
interface LoginResponse {
  token: string;
  user: {
    id: string;  // Changed `id` to string to match Redux store type
    email: string;
    firstName: string;
    lastName: string;
  };
}

// Define User type to match the expected structure in the store
interface User {
  id: string;  // Make sure `id` is of type `string` here
  email: string;
  firstName: string;
  lastName: string;
}

/**
 * Makes API call to login endpoint
 * @param data - Login form data (email and password)
 * @returns Promise with user data and token
 * @throws Error if login fails
 */
async function loginApi(data: LoginFormData): Promise<LoginResponse> {
  const response = await fetch('/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Login failed');
  }

  return response.json();
}

/**
 * Saga worker for handling login process
 * - Makes API call
 * - Handles success by storing token and user data
 * - Handles failure by dispatching error
 * - Redirects to home page on success
 */
export function* loginSaga(action: PayloadAction<LoginFormData>): Generator {
  try {
    const response: LoginResponse = yield call(loginApi, action.payload);
    
    // Ensure that the user object has the same shape expected in Redux
    const user: User = {
      id: response.user.id,  // Ensure `id` is string
      email: response.user.email,
      firstName: response.user.firstName || '',
      lastName: response.user.lastName || '',
    };

    // Dispatch loginSuccess with user and token
    yield put(loginSuccess({ user, token: response.token }));

    // Store in localStorage
    localStorage.setItem('token', response.token);
    localStorage.setItem('user', JSON.stringify(user));

    // Redirect to home
    window.location.href = '/';
  } catch (error: unknown) {
    if (error instanceof Error) {
      yield put(loginFailure(error.message));
    } else {
      yield put(loginFailure('Unknown error occurred during login'));
    }
  }
}

/**
 * Root auth saga that watches for auth actions
 * - Handles login requests
 * - Handles registration requests
 */
export function* watchAuth() {
  yield takeLatest('auth/loginRequest', loginSaga);
}
