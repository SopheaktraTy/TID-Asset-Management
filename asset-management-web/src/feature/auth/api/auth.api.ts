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
    }
  );
  return response.data.data;
};
