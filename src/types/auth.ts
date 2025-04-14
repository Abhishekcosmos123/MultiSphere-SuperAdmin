/**
 * Type representing the user object
 */
export interface User {
    id: string;
    name: string;
    phone?: string;
    email?: string;
    country_code?: string;
    provider: string;
    role: string;
  }
  
  /**
   * Authentication state interface
   */
  export interface AuthState {
    user: User | null;
    token: string | null | Token;
    loading: boolean;
    error: string | null;
    isAuthenticated: boolean; 
    otpResponse?: OtpResponse; 
    loginMessage: string;
    otpSent: boolean;
    success: boolean;
    message: string;
    isLoading: boolean;
  }
  
  
  export interface OTPData {
    email?: string;
    otp: string;
  }

  export interface Token {
    access: {
      token: string;
      expires: string;
    };
    refresh: {
      token: string;
      expires: string;
    };
  }

  export interface OtpResponse {
    success: boolean;
    message: string;
    data: {
      user: User;
      token: Token;
    };
  }

  export interface LoginCredentials {
    email?: string;
    password?: string;
  }

  export interface LoginResponse {
    success: boolean;
    message: string;
  }

  export interface ResendOtpPayload {
    email: string;
  }

export interface ResendOtpResponse {
  success: boolean;
  message: string;
}

export interface LogoutToken {
  refreshToken?: string;
}