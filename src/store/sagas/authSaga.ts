import { call, put, takeLatest } from 'redux-saga/effects';
import { PayloadAction } from '@reduxjs/toolkit';
import { loginSuccess, loginFailure, loginRequest, verifyOtpSuccess, verifyOtpFailure, verifyOtpRequest, resendOtpRequest, resendOtpSuccess, resendOtpFailure, logoutSuccess, logoutFailure, logoutRequest } from '../slices/authSlice';
import { authService } from '@/lib/api/services/auth/authService';
import { StorageKeys, storage } from '@/lib/utils/storage';
import { LoginCredentials, LoginResponse, LogoutToken, OtpResponse, ResendOtpResponse } from '@/types/auth';

/**
 * Saga worker for handling login process
 * - Makes API call
 * - Handles success by storing token and user data
 * - Handles failure by dispatching error
 * - Redirects to home page on success
 */
export function* loginSaga(action: PayloadAction<LoginCredentials>): Generator {
  try {
    const response = (yield call(authService.login, action.payload)) as LoginResponse;

    if (response.success) {
      yield put(loginSuccess({ message: response.message }));
    } else {
      yield put(loginFailure(response.message || 'Failed to send OTP'));
    }
  } catch (error: any) {
    yield put(loginFailure(error.message || 'Unknown login error'));
  }
}

/**
 * Saga worker for handling OTP verification process
 */
export function* verifyOtpSaga(action: PayloadAction<{ otp: string }>): Generator {
  try {
    const response = (yield call(authService.verifyOtp, action.payload)) as OtpResponse;

    yield put(verifyOtpSuccess(response));
    storage.set(StorageKeys.TOKEN, response.data.token.refresh.token);
    storage.set(StorageKeys.USER, JSON.stringify(response.data.user));
    // Optional redirect:
    // window.location.href = '/dashboard';
  } catch (error: any) {
    yield put(verifyOtpFailure(error.message));
  }
}

export function* resendOtpSaga(action: PayloadAction<{ email: string }>): Generator {
  try {
    const response = (yield call(authService.resendOtp, action.payload)) as ResendOtpResponse;

    // Handle success
    if (response.success) {
      yield put(resendOtpSuccess(response));
    } else {
      yield put(resendOtpFailure(response.message || 'Failed to resend OTP'));
    }
  } catch (error: any) {
    yield put(resendOtpFailure(error.message || 'Failed to resend OTP'));
  }
}

/**
 * Saga worker for handling logout process
 */
export function* logoutSaga(action: PayloadAction<LogoutToken>): Generator {
  try {
    const response = yield call(authService.logout, action.payload);
    yield put(logoutSuccess());
    // Clear storage
    storage.remove(StorageKeys.TOKEN);
    storage.remove(StorageKeys.USER);
    // Redirect to login
    window.location.href = '/';
  } catch (error: any) {
    yield put(logoutFailure(error.message));
  }
}

/**
 * Root auth saga that watches for auth actions
 * - Handles login requests
 * - Handles registration requests
 */
export function* watchAuth() {
  yield takeLatest(loginRequest.type, loginSaga);
  yield takeLatest(verifyOtpRequest.type, verifyOtpSaga);
  yield takeLatest(resendOtpRequest.type, resendOtpSaga);
  yield takeLatest(logoutRequest.type, logoutSaga);
}
