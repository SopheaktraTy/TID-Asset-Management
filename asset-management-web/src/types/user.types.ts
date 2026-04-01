import { z } from "zod";

// ─── Enums ───────────────────────────────────────────────────────────────────

export type UserStatus = "ACTIVE" | "INACTIVE";

// ─── Backend DTOs ─────────────────────────────────────────────────────────────

export interface UserDto {
  id: number;
  username: string;
  email: string;
  image: string | null;
  role: string;
  status: UserStatus;
  createdAt: string;
  lastSignIn: string | null;
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
});

export type CreateUserFormValues = z.infer<typeof createUserSchema>;

export const editUserSchema = z.object({
  username: z.string().min(1, "Username is required"),
  email: z.string().email("Invalid email"),
  role: z.string().min(1, "Role is required"),
  status: z.enum(["ACTIVE", "INACTIVE"]),
});

export type EditUserFormValues = z.infer<typeof editUserSchema>;
