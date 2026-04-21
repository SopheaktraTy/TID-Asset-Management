import { z } from "zod";

export type Department =
  | "OFFICE_ADMIN"
  | "TAX_ACCOUNTING_ADVISORY"
  | "LEGAL_CORPORATE_ADVISORY"
  | "AUDIT_ASSURANCE"
  | "PRACTICE_DEVELOPMENT_MANAGEMENT"
  | "CLIENT_OPERATION_MANAGEMENT"
  | "FINANCE_HUMAN_RESOURCE"
  | "TECHNOLOGY_INNOVATION_DEVELOPMENT";

export type JobTitle =
  | "ASSISTANT_MANAGER"
  | "ASSOCIATE"
  | "ASSOCIATE_DIRECTOR"
  | "CONSULTANT"
  | "DIRECTOR"
  | "EXECUTIVE"
  | "EXECUTIVE_ASSISTANT"
  | "INTERN"
  | "MANAGER"
  | "PERSONAL_ASSISTANT_TO_MANAGING_PARTNER"
  | "RECEPTIONIST"
  | "SENIOR_ADMIN_EXECUTIVE"
  | "SENIOR_ASSOCIATE"
  | "SENIOR_CONSULTANT"
  | "SENIOR_EXECUTIVE"
  | "SENIOR_IT_EXECUTIVE"
  | "SENIOR_MANAGER"
  | "SUPERVISOR";

export interface EmployeeDto {
  id: number;
  username: string;
  department: Department;
  jobTitle: JobTitle;
  image: string | null;
  createdAt: string;
  updatedAt: string;
}

export const createEmployeeSchema = z.object({
  username: z.string().min(2, "Name must be at least 2 characters"),
  department: z.string().min(1, "Department is required"),
  jobTitle: z.string().min(1, "Job title is required"),
});

export type CreateEmployeeFormValues = z.infer<typeof createEmployeeSchema>;

export const updateEmployeeSchema = createEmployeeSchema.partial();
export type UpdateEmployeeFormValues = z.infer<typeof updateEmployeeSchema>;
