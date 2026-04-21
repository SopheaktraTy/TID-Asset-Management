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

/** Build a FormData payload for the "JSON + File" pattern. */
function buildFormData(data: Record<string, unknown>, imageFile?: File | Blob | null): FormData {
  const fd = new FormData();

  // Create a JSON Blob for the user data part
  const jsonBlob = new Blob([JSON.stringify(data)], { type: "application/json" });
  fd.append("user", jsonBlob);

  if (imageFile) {
    if (!(imageFile instanceof File)) {
      fd.append("imageFile", imageFile, "profile-image.jpg");
    } else {
      fd.append("imageFile", imageFile);
    }
  }

  return fd;
}

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

export const createUserApi = async (data: CreateUserFormValues, imageFile?: File | Blob | null): Promise<UserDto> => {
  const fd = buildFormData(data as any, imageFile);
  const response = await api.post<ApiResponse<UserDto>>(BASE, fd);
  return response.data.data;
};

export const updateUserApi = async (id: number, data: EditUserFormValues, imageFile?: File | Blob | null, removeImage?: boolean): Promise<UserDto> => {
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
  
  const cleanPerms = Object.fromEntries(
    Object.entries(permissions ?? {})
      .filter(([, v]) => Array.isArray(v))
      .map(([k, v]) => [k, [...new Set(v as string[])].filter(Boolean)])
      .filter(([, v]) => (v as string[]).length > 0)
  ) as Record<string, string[]>;
  
  payload.permissions = cleanPerms;

  const fd = buildFormData(payload, imageFile);
  if (removeImage) fd.append("removeImage", String(removeImage));

  const response = await api.patch<ApiResponse<any>>(`${BASE}/${id}`, fd);
  const raw = response.data.data;
  
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
