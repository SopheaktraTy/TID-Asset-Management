import { api } from "../lib/axios";
import type { ApiResponse } from "../types/auth.types";
import type {
  UserDto,
  PagedResponse,
  UserQueryParams,
  CreateUserFormValues,
  EditUserFormValues,
} from "../types/user.types";

const BASE = "/api/users";

export const getUsersApi = async (params: UserQueryParams): Promise<PagedResponse<UserDto>> => {
  const response = await api.get<ApiResponse<PagedResponse<UserDto>>>(BASE, {
    params: {
      page: params.page ?? 0,
      size: params.size ?? 5,
      search: params.search || undefined,
      role: params.role || undefined,
      status: params.status || undefined,
      sortBy: params.sortBy || "createdAt",
      sortDir: params.sortDir || "desc",
    },
  });
  return response.data.data;
};

export const getUserByIdApi = async (id: number): Promise<UserDto> => {
  const response = await api.get<ApiResponse<UserDto>>(`${BASE}/${id}`);
  return response.data.data;
};

export const createUserApi = async (data: CreateUserFormValues): Promise<UserDto> => {
  const response = await api.post<ApiResponse<UserDto>>(BASE, data);
  return response.data.data;
};

export const updateUserApi = async (id: number, data: EditUserFormValues): Promise<UserDto> => {
  const response = await api.put<ApiResponse<UserDto>>(`${BASE}/${id}`, data);
  return response.data.data;
};

export const deleteUserApi = async (id: number): Promise<void> => {
  await api.delete(`${BASE}/${id}`);
};
