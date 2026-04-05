import { z } from "zod";

// ─── Zod Schema for form validation ─────────────────────────────────────────
export const signInSchema = z.object({
  identifier: z.string().min(1, "Email or username is required"),
  password: z.string().min(1, "Password is required"),
  rememberMe: z.boolean().optional(),
});

export type SignInFormValues = z.infer<typeof signInSchema>;

export const signUpSchema = z.object({
  username: z.string().min(1, "Username is required"),
  email: z.string().min(1, "Email is required").email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  department: z.string().min(1, "Department is required"),
});

export type SignUpFormValues = z.infer<typeof signUpSchema>;

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

// ─── Backend DTOs ─────────────────────────────────────────────────────────────

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
  userId: number;
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
