import { api } from "../../../lib/axios";
import type {
  SignInFormValues,
  LoginResponse,
  ApiResponse,

} from "../types/auth.types";

/**
 * POST /api/auth/login
 *
 * The bridge wraps every response in ApiResponse<T>.
 * The actual LoginResponse (token + user) lives in `response.data.data`.
 */
export const loginApi = async (
  data: SignInFormValues
): Promise<LoginResponse> => {
  const response = await api.post<ApiResponse<LoginResponse>>(
    "/api/auth/login",
    {
      identifier: data.identifier,
      password: data.password,
      rememberMe: data.rememberMe,
    }
  );
  return response.data.data;
};

export const forgotPasswordApi = async (email: string): Promise<string> => {
  const response = await api.post<ApiResponse<string>>(
    "/api/auth/forgot-password",
    { email }
  );
  // It might return data.message or data.data depending on the backend, I'll return data.message.
  return response.data.message;
};

export const resetPasswordApi = async (data: { token: string; newPassword: string }): Promise<string> => {
  const response = await api.post<ApiResponse<string>>(
    "/api/auth/reset-password",
    data
  );
  return response.data.message;
};
