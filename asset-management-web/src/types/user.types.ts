import { z } from "zod";
import type { ModuleEnum, PermissionEnum } from "./auth.types";


// ─── Enums ───────────────────────────────────────────────────────────────────

export type UserStatus = "ACTIVE" | "INACTIVE" | "SUSPENDED";

// ─── Backend DTOs ─────────────────────────────────────────────────────────────

export interface UserDto {
  id: number;
  username: string;
  email: string;
  image: string | null;
  role: string;
  status: UserStatus;
  department?: string;
  updated_at?: string;
  created_at: string;
  lastSignIn: string | null;
  permissions?: Record<ModuleEnum, PermissionEnum[]>;
}

export interface PagedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

// ─── Query Params ─────────────────────────────────────────────────────────────

export interface UserQueryParams {
  page?: number;
  size?: number;
  search?: string;
  role?: string;
  status?: UserStatus | "";
  sortBy?: string;
  sortDir?: "asc" | "desc";
}

// ─── Zod Schemas ─────────────────────────────────────────────────────────────

export const createUserSchema = z.object({
  username: z.string().min(1, "Username is required"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.string().min(1, "Role is required"),
  department: z.string().optional(),
  permissions: z.record(z.string(), z.any()).optional(),
});

export type CreateUserFormValues = z.infer<typeof createUserSchema>;

export const editUserSchema = z.object({
  username: z.string().min(1, "Username is required"),
  email: z.string().email("Invalid email"),
  role: z.string().min(1, "Role is required"),
  status: z.enum(["ACTIVE", "INACTIVE", "SUSPENDED"]),
  image: z.string().optional().or(z.literal("")),
  department: z.string().optional(),
  // z.any() per-value: Controller may produce undefined for uninitialised fields;
  // the service layer filters out non-array values before sending to the backend.
  permissions: z.record(z.string(), z.any()).optional(),
  password: z.string().min(6, "Password must be at least 6 characters").optional().or(z.literal("")),
});

export type EditUserFormValues = z.infer<typeof editUserSchema>;
