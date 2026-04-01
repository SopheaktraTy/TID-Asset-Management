import { api } from "../lib/axios";
import type {
  SignInFormValues,
  SignUpFormValues,
  LoginResponse,
  ApiResponse,
} from "../types/auth.types";

export const loginApi = async (data: SignInFormValues): Promise<LoginResponse> => {
  const response = await api.post<ApiResponse<LoginResponse>>("/api/auth/login", {
    identifier: data.identifier,
    password: data.password,
    rememberMe: data.rememberMe,
  });
  return response.data.data;
};

export const signUpApi = async (data: SignUpFormValues): Promise<string> => {
  const response = await api.post<ApiResponse<string>>("/api/auth/signup", data);
  return response.data.message;
};

export const forgotPasswordApi = async (email: string): Promise<string> => {
  const response = await api.post<ApiResponse<string>>("/api/auth/forgot-password", { email });
  return response.data.message;
};

export const resetPasswordApi = async (data: { token: string; newPassword: string }): Promise<string> => {
  const response = await api.post<ApiResponse<string>>("/api/auth/reset-password", data);
  return response.data.message;
};
