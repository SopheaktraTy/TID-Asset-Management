import { z } from "zod";

// ─── Zod Schema for form validation ─────────────────────────────────────────
export const signInSchema = z.object({
  identifier: z.string().min(1, "Email or username is required"),
  password: z.string().min(1, "Password is required"),
  rememberMe: z.boolean().optional(),
});

export type SignInFormValues = z.infer<typeof signInSchema>;

export const forgotPasswordSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email format"),
});

export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z.object({
  newPassword: z.string().min(8, "Password must be at least 8 characters long"),
  confirmPassword: z.string().min(1, "Please confirm your password"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

// ─── Backend DTOs (mirrors asset-management-bridge) ─────────────────────────

export type RoleEnum = "SUPER_ADMIN" | "ADMIN";

export type ModuleEnum =
  | "ASSET"
  | "USER"
  | "REPORT"
  | "ASSIGNMENT"
  | "ISSUE"
  | "PROCUREMENT";

export type PermissionEnum = "CREATE" | "READ" | "UPDATE" | "DELETE";

export interface ProfileResponse {
  id: number;
  username: string;
  email: string;
  image: string | null;
  role: RoleEnum;
  permissions: Record<ModuleEnum, PermissionEnum[]>;
}

export interface LoginResponse {
  token: string;
  user: ProfileResponse;
}

export interface ApiResponse<T> {
  timestamp: string;
  status: number;
  message: string;
  data: T;
}

export interface ApiErrorResponse {
  timestamp: string;
  status: number;
  message: string;
  data: Record<string, string> | null;
}
