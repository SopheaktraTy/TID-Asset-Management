import { z } from "zod";
import type { UserDto } from "./user.types";

export const DepartmentEnumValues = [
    "OFFICE_ADMIN",
    "TAX_ACCOUNTING_ADVISORY",
    "LEGAL_CORPORATE_ADVISORY",
    "AUDIT_ASSURANCE",
    "PRACTICE_DEVELOPMENT_MANAGEMENT",
    "CLIENT_OPERATION_MANAGEMENT",
    "FINANCE_HUMAN_RESOURCE",
    "TECHNOLOGY_INNOVATION_DEVELOPMENT",
] as const;

export type DepartmentType = (typeof DepartmentEnumValues)[number];

export const JobTitleEnumValues = [
    "SENIOR_MANAGER",
    "SUPERVISOR",
    "SENIOR_ADMIN_EXECUTIVE",
    "ASSISTANT_MANAGER",
    "DIRECTOR",
    "MANAGER",
    "SENIOR_ASSOCIATE",
    "ASSOCIATE",
    "ASSOCIATE_DIRECTOR",
    "PERSONAL_ASSISTANT_TO_MANAGING_PARTNER",
    "IT_EXECUTIVE",
    "ADMIN_EXECUTIVE",
    "IT_SENIOR_ASSOCIATE",
    "RECEPTIONIST",
    "DRIVER",
    "INTERN",
] as const;

export type JobTitleType = (typeof JobTitleEnumValues)[number];

export interface EmployeeDto {
    id: number;
    username: string;
    department: string;
    jobTitle: string;
    image?: string;
}

export interface AssignmentResponse {
    id: number;
    assetId: number;
    assetTag: string;
    deviceName: string;
    employee: EmployeeDto;
    assignedByUser: UserDto | null;
    assignedDate: string; // ISO Date string
    returnedDate?: string | null;
    returnCondition?: string | null;
    confirmReturnByUser?: UserDto | null;
    remark?: string | null;
}

export const assignAssetSchema = z.object({
    employeeName: z.string().min(1, "Employee name is required"),
    remark: z.string().optional().or(z.literal("")),
});

export type AssignAssetFormValues = z.infer<typeof assignAssetSchema>;

export const returnAssetSchema = z.object({
    returnCondition: z.string().min(1, "Return condition is required"),
    remark: z.string().optional().or(z.literal("")),
});

export type ReturnAssetFormValues = z.infer<typeof returnAssetSchema>;

export const updateAssignmentSchema = assignAssetSchema.extend({
    assignedDate: z.string().min(1, "Assigned Date is required"),
    returnedDate: z.string().optional().nullable(),
    returnCondition: z.string().optional().nullable(),
    remark: z.string().optional().nullable(),
});

export type UpdateAssignmentFormValues = z.infer<typeof updateAssignmentSchema>;
