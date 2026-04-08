import { HardDrive } from "lucide-react";
import type { AssetDto, AssetStatus, DeviceType } from "../../../types/asset.types";
import { Table, type ColumnDef } from "../../ui/Table";
import { formatDate } from "../../../utils/format";

// ── Column picker options exported for toolbar ────────────────────────────────
export const ASSET_TABLE_COLUMN_OPTIONS = [
  { key: "asset", label: "Asset" },
  { key: "deviceType", label: "Type" },
  { key: "status", label: "Status" },
  { key: "manufacturer", label: "Manufacturer" },
  { key: "specs", label: "Specs" },
  { key: "latestUsed", label: "Last Used" },
  { key: "createdAt", label: "Created At" },
  { key: "updatedAt", label: "Updated At" },
];

// ── Status badge config ───────────────────────────────────────────────────────
const STATUS_CONFIG: Record<
  AssetStatus,
  { color: string; bg: string; label: string }
> = {
  AVAILABLE:    { color: "text-[#10b981]", bg: "bg-[#10b981]", label: "Available" },
  IN_USE:       { color: "text-[#3b82f6]", bg: "bg-[#3b82f6]", label: "In Use" },
  DAMAGED:      { color: "text-[#ef4444]", bg: "bg-[#ef4444]", label: "Damaged" },
  UNDER_REPAIR: { color: "text-[#f59e0b]", bg: "bg-[#f59e0b]", label: "Under Repair" },
  LOST:         { color: "text-[#dc2626]", bg: "bg-[#dc2626]", label: "Lost" },
  MALFUNCTION:  { color: "text-[#f97316]", bg: "bg-[#f97316]", label: "Malfunction" },
  MAINTENANCE:  { color: "text-[#8b5cf6]", bg: "bg-[#8b5cf6]", label: "Maintenance" },
  OTHER:        { color: "text-[#6b7280]", bg: "bg-[#6b7280]", label: "Other" },
};

// ── Device type badge config ──────────────────────────────────────────────────
const DEVICE_TYPE_CONFIG: Record<
  DeviceType,
  { bg: string; text: string; label: string }
> = {
  LAPTOP:           { bg: "bg-blue-500/10 border border-blue-500/20",   text: "text-blue-500",   label: "Laptop" },
  DESKTOP:          { bg: "bg-violet-500/10 border border-violet-500/20", text: "text-violet-500", label: "Desktop" },
  PORTABLE_MONITOR: { bg: "bg-cyan-500/10 border border-cyan-500/20",   text: "text-cyan-500",   label: "Portable Monitor" },
  STAND_MONITOR:    { bg: "bg-gray-500/10 border border-gray-500/20",   text: "text-gray-400",   label: "Stand Monitor" },
};

// ── Compact hardware spec builder ─────────────────────────────────────────────
function buildSpecsLabel(asset: AssetDto): string {
  const parts: string[] = [];
  if (asset.cpu) parts.push(asset.cpu);
  if (asset.ramGb) parts.push(`${asset.ramGb}GB RAM`);
  if (asset.storageSizeGb) parts.push(`${asset.storageSizeGb}GB`);
  return parts.join(" · ") || "–";
}

// ── Props ─────────────────────────────────────────────────────────────────────
interface AssetTableProps {
  assets: AssetDto[];
  loading: boolean;
  pageSize: number;
  sortBy: string;
  sortDir: "asc" | "desc";
  hiddenCols: Set<string>;
  onSort: (field: string, dir?: "asc" | "desc") => void;
  onRowClick: (asset: AssetDto) => void;
  menuClassName?: string;
}

export default function AssetTable({
  assets,
  loading,
  pageSize,
  sortBy,
  sortDir,
  hiddenCols,
  onSort,
  onRowClick,
  menuClassName = "",
}: AssetTableProps) {
  const columns: ColumnDef<AssetDto>[] = [
    {
      key: "asset",
      header: "Asset",
      sortable: true,
      cell: (asset) => (
        <div className="flex items-center gap-3 min-w-0 py-1">
          {/* Device icon avatar */}
          <div className="w-9 h-9 rounded-lg bg-[var(--surface-hover)] flex items-center justify-center shrink-0">
            <HardDrive size={16} className="text-[var(--text-muted)]" />
          </div>
          <div className="min-w-0 flex flex-col leading-tight">
            <p className="text-sm font-bold text-[var(--text-main)] truncate">
              {asset.deviceName}
            </p>
            <p className="text-xs text-[var(--text-muted)] truncate mt-0.5 font-mono">
              {asset.assetTag}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: "deviceType",
      header: "Type",
      sortable: true,
      cell: (asset) => {
        const cfg = DEVICE_TYPE_CONFIG[asset.deviceType] ?? {
          bg: "bg-gray-500/10 border border-gray-500/20",
          text: "text-gray-400",
          label: asset.deviceType,
        };
        return (
          <span
            className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-tight ${cfg.bg} ${cfg.text}`}
          >
            {cfg.label}
          </span>
        );
      },
    },
    {
      key: "status",
      header: "Status",
      sortable: true,
      cell: (asset) => {
        const cfg = STATUS_CONFIG[asset.status] ?? STATUS_CONFIG.OTHER;
        return (
          <span
            className={`inline-flex items-center gap-2 text-xs font-medium ${cfg.color}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${cfg.bg}`} />
            {cfg.label}
          </span>
        );
      },
    },
    {
      key: "manufacturer",
      header: "Manufacturer",
      sortable: true,
      cell: (asset) => (
        <div className="flex flex-col leading-tight">
          <span className="text-xs font-semibold text-[var(--text-main)]">
            {asset.manufacturer || "–"}
          </span>
          {asset.model && (
            <span className="text-[10px] text-[var(--text-muted)] mt-0.5">
              {asset.model}
            </span>
          )}
        </div>
      ),
    },
    {
      key: "specs",
      header: "Specs",
      sortable: false,
      cell: (asset) => (
        <span className="text-xs text-[var(--text-muted)] font-mono">
          {buildSpecsLabel(asset)}
        </span>
      ),
    },
    {
      key: "latestUsed",
      header: "Last Used",
      sortable: true,
      cell: (asset) => (
        <span className="text-xs text-[var(--text-muted)]">
          {asset.latestUsed || "–"}
        </span>
      ),
    },
    {
      key: "createdAt",
      header: "Created At",
      sortable: true,
      cell: (asset) => (
        <span className="text-xs font-medium text-[var(--text-main)]">
          {formatDate(asset.createdAt)}
        </span>
      ),
    },
    {
      key: "updatedAt",
      header: "Updated At",
      sortable: true,
      cell: (asset) => (
        <span className="text-xs text-[var(--text-muted)]">
          {formatDate(asset.updatedAt)}
        </span>
      ),
    },
  ];

  const visibleColumns = columns.filter((c) => !hiddenCols.has(c.key));

  const EmptyState = (
    <div className="flex flex-col items-center gap-3 text-[var(--text-muted)]">
      <HardDrive size={36} strokeWidth={1.2} className="opacity-30" />
      <p className="text-sm font-medium">No assets found</p>
      <p className="text-xs opacity-70">Try adjusting your search or filters</p>
    </div>
  );

  return (
    <Table
      data={assets}
      columns={visibleColumns}
      loading={loading}
      pageSize={pageSize}
      sortBy={sortBy}
      sortDir={sortDir}
      onSort={onSort}
      onRowClick={onRowClick}
      emptyMessage={EmptyState}
      menuClassName={menuClassName}
    />
  );
}
