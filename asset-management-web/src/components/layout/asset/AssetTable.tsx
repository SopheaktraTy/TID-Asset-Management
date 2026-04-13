import { HardDrive } from "lucide-react";
import type { AssetDto, AssetStatus, DeviceType } from "../../../types/asset.types";
import { Table, type ColumnDef } from "../../ui/Table";
import { formatDate } from "../../../utils/format";
import { getSafeImageUrl } from "../../../utils/image";

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
  { color: string; bg: string; border: string; label: string }
> = {
  AVAILABLE: { color: "text-[#10b981]", bg: "bg-[#10b981]/15", border: "border-[#10b981]/20", label: "Available" },
  IN_USE: { color: "text-[#3b82f6]", bg: "bg-[#3b82f6]/15", border: "border-[#3b82f6]/20", label: "In Use" },
  DAMAGED: { color: "text-red-500", bg: "bg-red-500/15", border: "border-red-500/20", label: "Damaged" },
  UNDER_REPAIR: { color: "text-amber-500", bg: "bg-amber-500/15", border: "border-amber-500/20", label: "Under Repair" },
  LOST: { color: "text-red-600", bg: "bg-red-600/15", border: "border-red-600/20", label: "Lost" },
  MALFUNCTION: { color: "text-orange-500", bg: "bg-orange-500/15", border: "border-orange-500/20", label: "Malfunction" },
  MAINTENANCE: { color: "text-purple-500", bg: "bg-purple-500/15", border: "border-purple-500/20", label: "Maintenance" },
  OTHER: { color: "text-[var(--text-muted)]", bg: "bg-[var(--text-muted)]/15", border: "border-[var(--text-muted)]/20", label: "Other" },
};

// ── Device type badge config ──────────────────────────────────────────────────
const DEVICE_TYPE_CONFIG: Record<
  DeviceType,
  { bg: string; text: string; label: string }
> = {
  LAPTOP: { bg: "bg-blue-600/20 border border-blue-600/40", text: "text-blue-600 dark:text-blue-400", label: "Laptop" },
  DESKTOP: { bg: "bg-violet-600/20 border border-violet-600/40", text: "text-violet-600 dark:text-violet-400", label: "Desktop" },
  PORTABLE_MONITOR: { bg: "bg-cyan-600/20 border border-cyan-600/40", text: "text-cyan-600 dark:text-cyan-400", label: "Portable Monitor" },
  STAND_MONITOR: { bg: "bg-gray-600/20 border border-gray-600/40", text: "text-gray-700 dark:text-gray-300", label: "Stand Monitor" },
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
          {/* Thumbnail or fallback icon */}
          <div className="w-12 h-12 rounded-lg bg-[var(--surface-hover)] flex items-center justify-center shrink-0 overflow-hidden border border-[var(--border-color)] shadow-sm">
            {asset.image ? (
              <img
                src={getSafeImageUrl(asset.image)}
                alt={asset.deviceName}
                className="w-full h-full object-cover"
                style={{ imageRendering: "-webkit-optimize-contrast" }}
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.display = "none";
                  (e.currentTarget.nextElementSibling as HTMLElement | null)?.style.setProperty("display", "flex");
                }}
              />

            ) : null}
            <div
              className="w-full h-full flex items-center justify-center"
              style={{ display: asset.image ? "none" : "flex" }}
            >
              <HardDrive size={20} className="text-[var(--text-muted)]" />
            </div>
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
            className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-tight border ${cfg.bg} ${cfg.color} ${cfg.border}`}
          >
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
