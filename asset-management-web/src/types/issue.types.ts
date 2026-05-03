import { z } from "zod";

export const IssueTitleEnumValues = [
    "DAMAGED",
    "UNDER_REPAIR",
    "LOST",
    "MALFUNCTION",
    "MAINTENANCE",
    "OTHER",
] as const;

export type IssueTitleType = (typeof IssueTitleEnumValues)[number];

export const IssueStatusEnumValues = [
    "OPEN",
    "IN_PROGRESS",
    "RESOLVED",
    "CANT_RESOLVED",
] as const;

export type IssueStatusType = (typeof IssueStatusEnumValues)[number];

export interface IssueResponse {
    id: number;
    assetId: number;
    assetTag: string;
    deviceName: string;
    issueTitle: IssueTitleType;
    issueStatus: IssueStatusType;
    reportedAt: string; // ISO Date string
    resolvedAt?: string | null;
    remark?: string | null;
    createdAt: string;
    updatedAt: string;
}

export const reportIssueSchema = z.object({
    issueTitle: z.string().min(1, "Issue title is required").refine(
        (val) => IssueTitleEnumValues.includes(val as any),
        { message: "Invalid issue title" }
    ),
    remark: z.string().optional().or(z.literal("")),
});

export type ReportIssueFormValues = z.infer<typeof reportIssueSchema>;

export const updateIssueSchema = z.object({
    issueTitle: z.string().min(1, "Issue title is required").refine(
        (val) => IssueTitleEnumValues.includes(val as any),
        { message: "Invalid issue title" }
    ).optional(),
    issueStatus: z.string().refine(
        (val) => IssueStatusEnumValues.includes(val as any),
        { message: "Invalid issue status" }
    ).optional(),
    remark: z.string().optional().or(z.literal("")),
});

export type UpdateIssueFormValues = z.infer<typeof updateIssueSchema>;
