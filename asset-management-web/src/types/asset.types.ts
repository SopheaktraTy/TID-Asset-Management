import { z } from "zod";

// ─── Enums ───────────────────────────────────────────────────────────────────

export type AssetStatus =
  | "AVAILABLE"
  | "IN_USE"
  | "DAMAGED"
  | "UNDER_REPAIR"
  | "LOST"
  | "MALFUNCTION"
  | "MAINTENANCE"
  | "OTHER";

export type DeviceType =
  | "LAPTOP"
  | "DESKTOP"
  | "PORTABLE_MONITOR"
  | "STAND_MONITOR";

// ─── Backend DTO ──────────────────────────────────────────────────────────────

export interface AssetDto {
  id: number;
  assetTag: string;
  serialNumber?: string | null;
  deviceName: string;
  deviceType: DeviceType;
  manufacturer?: string | null;
  model?: string | null;
  status: AssetStatus;
  cpu?: string | null;
  ramGb?: number | null;
  diskType?: string | null;
  diskModel?: string | null;
  storageSizeGb?: number | null;
  screenSizeInch?: number | null;
  operatingSystem?: string | null;
  osVersion?: string | null;
  domainJoined?: boolean | null;
  condition?: string | null;
  remark?: string | null;
  image?: string | null;
  lastSecurityCheck?: string | null;
  latestUsed?: string | null;
  previousUsed?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PagedAssetResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

// ─── Query Params ─────────────────────────────────────────────────────────────

export interface AssetQueryParams {
  page?: number;
  size?: number;
  search?: string;
  status?: AssetStatus | "";
  deviceType?: DeviceType | "";
  sortBy?: string;
  sortDir?: "asc" | "desc";
}

// ─── Zod Schemas ─────────────────────────────────────────────────────────────

export const createAssetSchema = z.object({
  assetTag: z.string().min(1, "Asset tag is required").max(100),
  serialNumber: z.string().max(100).optional().or(z.literal("")),
  deviceName: z.string().min(1, "Device name is required").max(150),
  deviceType: z.enum(["LAPTOP", "DESKTOP", "PORTABLE_MONITOR", "STAND_MONITOR"], {
    message: "Device type is required",
  }),
  manufacturer: z.string().max(100).optional().or(z.literal("")),
  model: z.string().max(100).optional().or(z.literal("")),
  status: z
    .enum(["AVAILABLE", "IN_USE", "DAMAGED", "UNDER_REPAIR", "LOST", "MALFUNCTION", "MAINTENANCE", "OTHER"])
    .optional(),
  cpu: z.string().max(150).optional().or(z.literal("")),
  ramGb: z.coerce.number().int().nonnegative().optional().nullable(),
  diskType: z.string().max(50).optional().or(z.literal("")),
  diskModel: z.string().max(150).optional().or(z.literal("")),
  storageSizeGb: z.coerce.number().int().nonnegative().optional().nullable(),
  screenSizeInch: z.coerce.number().positive().optional().nullable(),
  operatingSystem: z.string().max(100).optional().or(z.literal("")),
  osVersion: z.string().max(100).optional().or(z.literal("")),
  domainJoined: z.boolean().optional().nullable(),
  condition: z.string().max(100).optional().or(z.literal("")),
  remark: z.string().optional().or(z.literal("")),
  image: z.string().optional().or(z.literal("")),
  lastSecurityCheck: z.string().optional().nullable(),
});

export type CreateAssetFormValues = z.infer<typeof createAssetSchema>;

export const editAssetSchema = createAssetSchema.extend({
  status: z.enum(["AVAILABLE", "IN_USE", "DAMAGED", "UNDER_REPAIR", "LOST", "MALFUNCTION", "MAINTENANCE", "OTHER"]),
});

export type EditAssetFormValues = z.infer<typeof editAssetSchema>;
