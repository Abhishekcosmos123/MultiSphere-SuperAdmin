import { LoginCredentials, LoginResponse, ResendOtpPayload, ResendOtpResponse, User } from '@/types/auth';
import { apiClient } from '../../client';

export interface RegisterData {
  email?: string;
  password?: string;
  name: string;
  phone?: string;
  country_code?: string;
  role: string;
  provider: string;
}

export interface Token {
  token: string;
  expires: string;
}

export interface UserToken {
  access: Token;
  refresh: Token;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    token: UserToken;
  };
}

export interface OTPData {
  email?: string;
  otp: string;
  phone?: string;
  country_code?: string;
}

export interface LogoutToken {
  refreshToken?: string;
}

export interface ForgetPasswordData {
  email: string;
}

export interface ForgetPasswordOTPData {
  email: string;
  otp: string;
}
export interface ResetPasswordData {
  email: string;
  password: string;
}

export interface UpdateProfilePayload {
  id: string;
  name: string;
  email: string;
  phone: string;
  country_code: string;
  profile: string;
}

export interface UpdateUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  country_code: string;
  is_active: boolean;
  provider: string;
  created_by: string;
  updated_by: string;
  is_deleted: boolean;
  profile_pic: string;
  role: string;
  created_at?: string;
  updated_at?: string;
}

export interface UpdateUserPayload {
  userId: string;
  userData: Partial<UpdateUser>;
}

export interface CreateUserPayload {
  provider: string;
  name: string;
  email?: string;
  password?: string;
  phone?: string;
  country_code?: string;
  role: string;
  created_by: string;
}

export interface CreatedUserResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    name: string;
    email: string | null;
    phone: string | null;
    country_code: string | null;
    provider: string;
    role: string;
    profile_pic: string | null;
  };
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    return apiClient.post<AuthResponse>('/super-admin/login', credentials);
  },

  // async getCurrentUser(): Promise<AuthResponse['user']> {
  //   return apiClient.get<AuthResponse['user']>('/auth/me');
  // },

  // async updateProfile(data: Partial<AuthResponse['user']>): Promise<AuthResponse['user']> {
  //   return apiClient.put<AuthResponse['user']>('/auth/profile', data);
  // },

  async verifyOtp(data: OTPData): Promise<void> {
    return apiClient.post('/super-admin/send-verification-email', data);
  },

  async resendOtp(payload: ResendOtpPayload): Promise<ResendOtpResponse> {
    return apiClient.post<ResendOtpResponse>('/super-admin/resend-otp', payload);
  },

  async logout(data: LogoutToken): Promise<void> {
    return apiClient.post('/super-admin/logout', data);
  },


//   async forgetPassword(data: ForgetPasswordData): Promise<{ message: string }> {
//     return apiClient.post('/auth/forgot-password', data);
//   },

//   async verifyforgetPasswordOTP(data: ForgetPasswordOTPData): Promise<{ message: string }> {
//     return apiClient.post('/auth/forgot-password-verify-otp', data);
//   },

//   async resetPassword(data: ResetPasswordData): Promise<{ message: string }> {
//     return apiClient.post('/auth/reset-password', data);
//   },

//   async updateUserProfile({ id, formData }: { id: string; formData: FormData }): Promise<{ message: string; data: any }> {
//     return apiClient.patch(`/users/profile/${id}`, formData, {
//       headers: {
//         "Content-Type": "multipart/form-data",
//       },
//     });
//   },

//   async searchUsers(searchBy: string, searchValue: string) {
//     return apiClient.post(`/admin/users/search?searchBy=${searchBy}&searchValue=${searchValue}`);
//   },

//   async deleteUser(userId: string): Promise<{ message: string }> {
//     return apiClient.delete(`/admin/users/${userId}`);
//   },

//   async updateUser(payload: UpdateUserPayload): Promise<UpdateUser> {
//     const { userId, userData } = payload;
//     return apiClient.patch(`/admin/users/${userId}`, userData);
//   },

//   async createUser(payload: CreateUserPayload): Promise<CreatedUserResponse> {
//     return apiClient.post("/admin/create-users", payload);
//   },
}; 