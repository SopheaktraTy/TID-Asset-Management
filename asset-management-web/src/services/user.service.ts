import { api } from "../lib/axios";
import type { ProfileResponse, ApiResponse } from "../types/auth.types";

export const getProfileApi = async (): Promise<ProfileResponse> => {
  const response = await api.get<ApiResponse<ProfileResponse>>("/api/users/profile");
  return response.data.data;
};

export const updateProfileApi = async (data: Partial<ProfileResponse>): Promise<ProfileResponse> => {
  const response = await api.put<ApiResponse<ProfileResponse>>("/api/users/profile", data);
  return response.data.data;
};
