import { api } from "../lib/axios";
import type { ProfileResponse, ApiResponse } from "../types/auth.types";

export const getProfileApi = async (): Promise<ProfileResponse> => {
  const response = await api.get<ApiResponse<ProfileResponse>>("/api/auth/view-profile");
  return response.data.data;
};

export const updateProfileApi = async (formData: FormData): Promise<ProfileResponse> => {
  const response = await api.put<ApiResponse<ProfileResponse>>("/api/auth/update-profile", formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data.data;
};
