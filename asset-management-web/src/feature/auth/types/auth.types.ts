import { z } from "zod";

// ─── Zod Schema for form validation ─────────────────────────────────────────
export const signInSchema = z.object({
  identifier: z.string().min(1, "Email or username is required"),
  password: z.string().min(1, "Password is required"),
  rememberMe: z.boolean().optional(),
});

export type SignInFormValues = z.infer<typeof signInSchema>;

// ─── Backend DTOs (mirrors asset-management-bridge) ─────────────────────────

/** Mirrors: com.tid.asset_management_bridge.auth_module.entity.RoleEnum */
export type RoleEnum = "SUPER_ADMIN" | "ADMIN";

/** Mirrors: com.tid.asset_management_bridge.auth_module.entity.ModuleEnum */
export type ModuleEnum =
  | "ASSET"
  | "USER"
  | "REPORT"
  | "ASSIGNMENT"
  | "ISSUE"
  | "PROCUREMENT";

/** Mirrors: com.tid.asset_management_bridge.auth_module.entity.PermissionEnum */
export type PermissionEnum = "CREATE" | "READ" | "UPDATE" | "DELETE";

/** Mirrors: com.tid.asset_management_bridge.auth_module.dto.ProfileResponse */
export interface ProfileResponse {
  id: number;
  username: string;
  email: string;
  image: string | null;
  role: RoleEnum;
  permissions: Record<ModuleEnum, PermissionEnum[]>;
}

/** Mirrors: com.tid.asset_management_bridge.auth_module.dto.LoginResponse */
export interface LoginResponse {
  token: string;
  user: ProfileResponse;
}

/** Mirrors: com.tid.asset_management_bridge.common.dto.ApiResponse<T> */
export interface ApiResponse<T> {
  timestamp: string;
  status: number;
  message: string;
  data: T;
}

/** Error shape returned by the backend GlobalExceptionHandler */
export interface ApiErrorResponse {
  timestamp: string;
  status: number;
  message: string;
  data: Record<string, string> | null;
}
