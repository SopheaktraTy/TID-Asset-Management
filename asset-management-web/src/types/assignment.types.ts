import { z } from "zod";

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
    "ASSISTANT_MANAGER",
    "ASSOCIATE",
    "ASSOCIATE_DIRECTOR",
    "CONSULTANT",
    "DIRECTOR",
    "EXECUTIVE",
    "EXECUTIVE_ASSISTANT",
    "INTERN",
    "MANAGER",
    "PERSONAL_ASSISTANT_TO_MANAGING_PARTNER",
    "RECEPTIONIST",
    "SENIOR_ADMIN_EXECUTIVE",
    "SENIOR_ASSOCIATE",
    "SENIOR_CONSULTANT",
    "SENIOR_EXECUTIVE",
    "SENIOR_IT_EXECUTIVE",
    "SENIOR_MANAGER",
    "SUPERVISOR",
] as const;

export type JobTitleType = (typeof JobTitleEnumValues)[number];

export interface AssignmentResponse {
    id: number;
    assetId: number;
    assetTag: string;
    deviceName: string;
    assignedTo: string;
    department: DepartmentType;
    jobTitle: JobTitleType;
    assignedBy: string;
    assignedByUserId: number;
    assignedDate: string; // ISO Date string
    returnedDate?: string | null;
    returnCondition?: string | null;
    confirmReturnBy?: string | null;
    confirmReturnByUserId?: number | null;
}

export const assignAssetSchema = z.object({
    assignedTo: z.string().min(1, "Assigned To is required"),
    department: z.enum(DepartmentEnumValues, {
        message: "Department is required",
    }),
    jobTitle: z.enum(JobTitleEnumValues, {
        message: "Job Title is required",
    }),
});

export type AssignAssetFormValues = z.infer<typeof assignAssetSchema>;

export const returnAssetSchema = z.object({
    returnCondition: z.string().min(1, "Return condition is required"),
});

export type ReturnAssetFormValues = z.infer<typeof returnAssetSchema>;

export const updateAssignmentSchema = assignAssetSchema.extend({
    assignedDate: z.string().min(1, "Assigned Date is required"),
    returnedDate: z.string().optional().nullable(),
    returnCondition: z.string().optional().nullable(),
});

export type UpdateAssignmentFormValues = z.infer<typeof updateAssignmentSchema>;
