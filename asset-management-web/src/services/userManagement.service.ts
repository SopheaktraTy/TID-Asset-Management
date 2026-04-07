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

/** Deduplicate permission arrays from the backend response.
 *  Existing bad data in the DB (duplicates) is cleaned before entering form state,
 *  preventing the form from re-submitting stale duplicates on the next save. */
const dedupePermissions = (perms: Record<string, any> | undefined): Record<string, string[]> | undefined => {
  if (!perms) return undefined;
  const result: Record<string, string[]> = {};
  for (const [module, list] of Object.entries(perms)) {
    if (Array.isArray(list)) {
      result[module] = [...new Set(list as string[])];
    }
  }
  return Object.keys(result).length > 0 ? result : undefined;
};

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
    allUsers = allUsers.filter((u) => u.status === params.status);
  }

  // 2. Sort
  const sortBy = params.sortBy || "createdAt";
  const sortDir = params.sortDir || "desc";
  allUsers.sort((a: any, b: any) => {
    const valA = a[sortBy] || "";
    const valB = b[sortBy] || "";
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
    status: u.status || "ACTIVE", // Fallback to ACTIVE
    createdAt: u.createdAt || new Date().toISOString(),
    permissions: dedupePermissions(u.permissions),
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
  const { status, password, permissions, department, ...rest } = data;
  const payload: Record<string, unknown> = {
    ...rest,
    status: status,
  };
  // Only include password if it was actually provided
  if (password && password.trim() !== "") {
    payload.password = password;
  }
  // Only send department if a real value was selected (not empty string "")
  if (department && department.trim() !== "") {
    payload.department = department;
  }
  // Always send permissions so the backend can apply the exact state the user chose.
  // An empty {} means "clear all permissions". Filter undefined/non-array values
  // and deduplicate each list before sending.
  const cleanPerms = Object.fromEntries(
    Object.entries(permissions ?? {})
      .filter(([, v]) => Array.isArray(v))
      .map(([k, v]) => [k, [...new Set(v as string[])].filter(Boolean)])
      .filter(([, v]) => (v as string[]).length > 0)
  ) as Record<string, string[]>;
  // Always include the key so the backend knows permissions were intentionally submitted
  payload.permissions = cleanPerms;
  const response = await api.patch<ApiResponse<any>>(`${BASE}/${id}`, payload);
  const raw = response.data.data;
  // Normalize response: dedupe permissions in case old
  // duplicate rows still exist in the DB from earlier saves.
  return {
    ...raw,
    permissions: dedupePermissions(raw.permissions),
  } as UserDto;
};

export const forceResetPasswordApi = async (id: number, newPassword: string): Promise<void> => {
  await api.patch(`${BASE}/${id}/force-reset-password`, { newPassword });
};

export const deleteUserApi = async (id: number): Promise<void> => {
  await api.delete(`${BASE}/${id}`);
};
