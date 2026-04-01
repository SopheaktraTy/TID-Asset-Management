import { Search, ChevronDown, Plus } from "lucide-react";

interface UserToolbarProps {
  search: string;
  onSearchChange: (val: string) => void;
  roleFilter: string;
  onRoleChange: (val: string) => void;
  statusFilter: string;
  onStatusChange: (val: string) => void;
  onAddClick: () => void;
}

export default function UserToolbar({
  search,
  onSearchChange,
  roleFilter,
  onRoleChange,
  statusFilter,
  onStatusChange,
  onAddClick,
}: UserToolbarProps) {
  return (
    <div className="flex flex-wrap items-center gap-3 px-5 py-4 border-b border-[var(--border-color)]">
      {/* Search */}
      <div className="relative flex-1 min-w-[180px] max-w-xs">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search users..."
          className="w-full pl-9 pr-4 py-2 text-sm bg-[var(--bg)] border border-[var(--border-color)] rounded-lg focus:outline-none focus:border-[var(--color-growth-green)] focus:ring-1 focus:ring-[var(--color-growth-green)] text-[var(--text-main)] placeholder:text-[var(--text-muted)] transition-colors"
        />
      </div>

      {/* Role filter */}
      <div className="relative">
        <select
          value={roleFilter}
          onChange={(e) => onRoleChange(e.target.value)}
          className="pl-3 pr-8 py-2 text-sm bg-[var(--surface)] border border-[var(--border-color)] rounded-lg focus:outline-none focus:border-[var(--color-growth-green)] text-[var(--text-main)] appearance-none cursor-pointer hover:border-[var(--text-muted)] transition-colors"
        >
          <option value="">All roles</option>
          <option value="SUPER_ADMIN">Super Admin</option>
          <option value="ADMIN">Admin</option>
          <option value="Manager">Manager</option>
        </select>
        <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--text-muted)]" />
      </div>

      {/* Status filter */}
      <div className="relative">
        <select
          value={statusFilter}
          onChange={(e) => onStatusChange(e.target.value)}
          className="pl-3 pr-8 py-2 text-sm bg-[var(--surface)] border border-[var(--border-color)] rounded-lg focus:outline-none focus:border-[var(--color-growth-green)] text-[var(--text-main)] appearance-none cursor-pointer hover:border-[var(--text-muted)] transition-colors"
        >
          <option value="">All users</option>
          <option value="ACTIVE">Active</option>
          <option value="INACTIVE">Inactive</option>
        </select>
        <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--text-muted)]" />
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Add user */}
      <button
        onClick={onAddClick}
        className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors shadow-sm"
      >
        <Plus size={15} />
        Add user
      </button>
    </div>
  );
}
