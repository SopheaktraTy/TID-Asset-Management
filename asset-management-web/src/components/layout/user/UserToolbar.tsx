import { Search, Plus } from "lucide-react";
import { DropdownList } from "../../ui/DropdownList";
import { ColumnGridDropdown } from "../../ui/ColumnGridDropdown";
import { Button } from "../../ui/Button";

// ── Option sets ──────────────────────────────────────────────
const ROLE_OPTIONS = [
  { value: "", label: "All roles" },
  { value: "SUPER_ADMIN", label: "Super Admin" },
  { value: "ADMIN", label: "Admin" },
];

const STATUS_OPTIONS = [
  { value: "", label: "All users" },
  { value: "ACTIVE", label: "Active" },
  { value: "INACTIVE", label: "Inactive" },
];

// ── Props ─────────────────────────────────────────────────────
interface UserToolbarProps {
  search: string;
  onSearchChange: (val: string) => void;
  roleFilter: string;
  onRoleChange: (val: string) => void;
  statusFilter: string;
  onStatusChange: (val: string) => void;
  onAddClick: () => void;
  hiddenCols: Set<string>;
  onToggleColumn: (key: string) => void;
  onSetHiddenCols: (keys: Set<string>) => void;
  columnOptions: { key: string; label: string }[];
}

// ── Component ─────────────────────────────────────────────────
export default function UserToolbar({
  search,
  onSearchChange,
  roleFilter,
  onRoleChange,
  statusFilter,
  onStatusChange,
  onAddClick,
  hiddenCols,
  onToggleColumn,
  onSetHiddenCols,
  columnOptions,
}: UserToolbarProps) {
  return (
    <div className="flex flex-wrap items-center gap-3 px-5 py-4 border-b border-[var(--border-color)]">

      {/* Search */}
      <div className="relative flex-1 min-w-[180px] max-w-xs">
        <Search
          size={15}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] pointer-events-none"
        />
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search users"
          className="
            w-full pl-9 pr-4 py-2 text-xs
            bg-[var(--bg)] border border-[var(--border-color)] rounded-lg
            focus:outline-none focus:border-[var(--color-growth-green)] focus:ring-0.5 focus:ring-[var(--color-growth-green)]
            text-[var(--text-main)] placeholder:text-[var(--text-muted)]
            transition-colors
          "
        />
      </div>


      {/* Spacer */}
      <div className="flex-1" />
      <div className="flex items-center gap-1">
        {/* Role filter */}
        <DropdownList
          options={ROLE_OPTIONS}
          value={roleFilter}
          onChange={onRoleChange}
          panelClassName="bg-[var(--bg)]"
        />

        {/* Status filter */}
        <DropdownList
          options={STATUS_OPTIONS}
          value={statusFilter}
          onChange={onStatusChange}
          panelClassName="bg-[var(--bg)]"
        />

        {/* Column display */}
        <ColumnGridDropdown
          columns={columnOptions}
          hiddenColumns={hiddenCols}
          onToggleColumn={onToggleColumn}
          onSetHiddenColumns={onSetHiddenCols}
          panelClassName="bg-[var(--bg)]"
        />
      </div>


      {/* Add user */}
      <Button
        variant="primary"
        onClick={onAddClick}
        className="!w-auto gap-1.5 px-4 py-2 text-xs"
      >
        <Plus size={15} />
        Add User
      </Button>
    </div>
  );
}
