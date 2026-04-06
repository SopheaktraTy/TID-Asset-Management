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
  // Since the current backend endpoint returns a flat list of users,
  // we perform filtering, sorting, and pagination on the client side.
  const response = await api.get<ApiResponse<any[]>>(BASE);
  let allUsers = response.data.data || [];

  // 1. Filter
  if (params.search) {
    const s = params.search.toLowerCase();
    allUsers = allUsers.filter(
      (u) =>
        (u.username && u.username.toLowerCase().includes(s)) ||
        (u.email && u.email.toLowerCase().includes(s))
    );
  }
  if (params.role) {
    allUsers = allUsers.filter((u) => u.role === params.role);
  }
  if (params.status) {
    allUsers = allUsers.filter((u) => {
      const st = u.status || (u.isActive === false ? "INACTIVE" : "ACTIVE");
      return st === params.status;
    });
  }

  // 2. Sort
  const sortBy = params.sortBy || "createdAt";
  const sortDir = params.sortDir || "desc";
  allUsers.sort((a, b) => {
    let valA = a[sortBy] || "";
    let valB = b[sortBy] || "";
    if (valA < valB) return sortDir === "asc" ? -1 : 1;
    if (valA > valB) return sortDir === "asc" ? 1 : -1;
    return 0;
  });

  // 3. Paginate
  const page = params.page ?? 0;
  const size = params.size ?? 5;
  const totalElements = allUsers.length;
  const totalPages = Math.ceil(totalElements / size);
  const content = allUsers.slice(page * size, page * size + size).map((u) => ({
    ...u,
    status: u.status || (u.isActive === false ? "INACTIVE" : "ACTIVE"),
    createdAt: u.createdAt || new Date().toISOString(), // Fallback since backend might omit it
  }));

  return {
    content,
    totalElements,
    totalPages,
    size,
    number: page,
  };
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
  // Uses the new unified PATCH endpoint on the backend
  const response = await api.patch<ApiResponse<UserDto>>(`${BASE}/${id}`, data);
  return response.data.data;
};

export const forceResetPasswordApi = async (id: number, newPassword: string): Promise<void> => {
  await api.patch(`${BASE}/${id}/force-reset-password`, { newPassword });
};

export const deleteUserApi = async (id: number): Promise<void> => {
  await api.delete(`${BASE}/${id}`);
};
