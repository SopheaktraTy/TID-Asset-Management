import { Search, Plus } from "lucide-react";
import { DropdownList } from "../../ui/DropdownList";
import { ColumnGridDropdown } from "../../ui/ColumnGridDropdown";
import { Button } from "../../ui/Button";

// ── Option sets ──────────────────────────────────────────────────────────────
const STATUS_OPTIONS = [
  { value: "", label: "All statuses" },
  { value: "AVAILABLE", label: "Available" },
  { value: "IN_USE", label: "In Use" },
  { value: "DAMAGED", label: "Damaged" },
  { value: "UNDER_REPAIR", label: "Under Repair" },
  { value: "LOST", label: "Lost" },
  { value: "MALFUNCTION", label: "Malfunction" },
  { value: "MAINTENANCE", label: "Maintenance" },
  { value: "OTHER", label: "Other" },
];

const DEVICE_TYPE_OPTIONS = [
  { value: "", label: "All types" },
  { value: "LAPTOP", label: "Laptop" },
  { value: "DESKTOP", label: "Desktop" },
  { value: "PORTABLE_MONITOR", label: "Portable Monitor" },
  { value: "STAND_MONITOR", label: "Stand Monitor" },
];

// ── Props ─────────────────────────────────────────────────────────────────────
interface AssetToolbarProps {
  search: string;
  onSearchChange: (val: string) => void;
  statusFilter: string;
  onStatusChange: (val: string) => void;
  deviceTypeFilter: string;
  onDeviceTypeChange: (val: string) => void;
  onAddClick: () => void;
  hiddenCols: Set<string>;
  onToggleColumn: (key: string) => void;
  onSetHiddenCols: (keys: Set<string>) => void;
  columnOptions: { key: string; label: string }[];
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function AssetToolbar({
  search,
  onSearchChange,
  statusFilter,
  onStatusChange,
  deviceTypeFilter,
  onDeviceTypeChange,
  onAddClick,
  hiddenCols,
  onToggleColumn,
  onSetHiddenCols,
  columnOptions,
}: AssetToolbarProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-4 px-4 sm:px-5 py-4 border-b border-[var(--border-color)]">
      {/* Search */}
      <div className="relative w-full sm:max-w-xs">
        <Search
          size={15}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] pointer-events-none"
        />
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search assets…"
          className="
            w-full pl-9 pr-4 py-2 text-xs
            bg-[var(--bg)] border border-[var(--border-color)] rounded-lg
            focus:outline-none focus:border-[var(--color-growth-green)] focus:ring-0.5 focus:ring-[var(--color-growth-green)]
            text-[var(--text-main)] placeholder:text-[var(--text-muted)]
            transition-colors
          "
        />
      </div>

      {/* Action Area */}
      <div className="flex flex-wrap items-center justify-between sm:justify-end gap-3 flex-1">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-hide">
          {/* Status filter */}
          <DropdownList
            options={STATUS_OPTIONS}
            value={statusFilter}
            onChange={onStatusChange}
            panelClassName="bg-[var(--bg)]"
          />

          {/* Device Type filter */}
          <DropdownList
            options={DEVICE_TYPE_OPTIONS}
            value={deviceTypeFilter}
            onChange={onDeviceTypeChange}
            panelClassName="bg-[var(--bg)]"
          />

          {/* Column picker */}
          <ColumnGridDropdown
            columns={columnOptions}
            hiddenColumns={hiddenCols}
            onToggleColumn={onToggleColumn}
            onSetHiddenColumns={onSetHiddenCols}
            panelClassName="bg-[var(--bg)]"
          />
        </div>

        {/* Add asset */}
        <Button
          variant="primary"
          onClick={onAddClick}
          className="!w-full sm:!w-auto gap-1.5 px-4 py-2 text-xs"
        >
          <Plus size={15} />
          Add Asset
        </Button>
      </div>
    </div>
  );
}
