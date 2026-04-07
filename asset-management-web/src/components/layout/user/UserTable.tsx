import { Users } from "lucide-react";
import type { UserDto } from "../../../types/user.types";
import { Table, type ColumnDef } from "../../ui/Table";

export const USER_TABLE_COLUMN_OPTIONS = [
  { key: "username", label: "User" },
  { key: "status", label: "Status" },
  { key: "role", label: "Role" },
  { key: "department", label: "Department" },
  { key: "created_at", label: "Joined" },
  { key: "updated_at", label: "Updated At" },
];

interface UserTableProps {
  users: UserDto[];
  loading: boolean;
  pageSize: number;
  sortBy: string;
  sortDir: "asc" | "desc";
  hiddenCols: Set<string>;
  onSort: (field: string, dir?: "asc" | "desc") => void;
  onRowClick: (user: UserDto) => void;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
function toPascalCase(str: string | null | undefined) {
  if (!str) return "–";
  return str
    .split(/[_\s]+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

function formatDate(iso: string | null | undefined) {
  if (!iso) return "–";
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function getInitials(name: string) {
  if (!name) return "?";
  return name.slice(0, 2).toUpperCase();
}

function avatarColor(name: string) {
  const colors = [
    "bg-violet-100 text-violet-700",
    "bg-blue-100 text-blue-700",
    "bg-emerald-100 text-emerald-700",
    "bg-amber-100 text-amber-700",
    "bg-rose-100 text-rose-700",
    "bg-cyan-100 text-cyan-700",
  ];
  if (!name) return colors[0];
  let hash = 0;
  for (const c of name) hash = c.charCodeAt(0) + hash * 31;
  return colors[Math.abs(hash) % colors.length];
}

export default function UserTable({
  users,
  loading,
  pageSize,
  sortBy,
  sortDir,
  hiddenCols,
  onSort,
  onRowClick,
}: UserTableProps) {
  const columns: ColumnDef<UserDto>[] = [
    {
      key: "username",
      header: "User",
      sortable: true,
      cell: (user) => (
        <div className="flex items-center gap-3 min-w-0 py-1">
          <div className="flex items-center shrink-0 relative z-10">
            {user?.image ? (
              <img
                src={user.image}
                alt={user.username || "User"}
                className="w-8 h-8 rounded-full object-cover ring-1 ring-[#2b2b2b] shadow-sm"
              />
            ) : (
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold border border-[#2b2b2b] ${avatarColor(
                  user?.username || ""
                )}`}
              >
                {getInitials(user?.username || "")}
              </div>
            )}
          </div>
          <div className="min-w-0 flex flex-col leading-tight">
            <p className="text-sm font-bold text-[var(--text-main)] truncate">{user?.username || "Unknown"}</p>
            <p className="text-xs text-[var(--text-muted)] truncate mt-0.5">{user?.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      sortable: true,
      cell: (user) => {
        const status = user?.status || "INACTIVE";
        const statusConfig = {
          ACTIVE: { color: "text-[#10b981]", bg: "bg-[#10b981]" },
          INACTIVE: { color: "text-[#f59e0b]", bg: "bg-[#f59e0b]" },
          SUSPENDED: { color: "text-[#ef4444]", bg: "bg-[#ef4444]" },
        };
        const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.INACTIVE;

        return (
          <span className={`inline-flex items-center gap-2 text-xs font-medium ${config.color}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${config.bg}`} />
            {toPascalCase(status)}
          </span>
        );
      },
    },
    {
      key: "role",
      header: "Role",
      sortable: true,
      cell: (user) => (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold bg-[#1f1f1f] text-gray-300 uppercase tracking-tight border border-[#2b2b2b]">
          {user?.role?.replace('_', ' ')}
        </span>
      ),
    },
    {
      key: "department",
      header: "Department",
      sortable: true,
      cell: (user) => (
        <span className="text-[var(--text-muted)]">{toPascalCase(user?.department)}</span>
      ),
    },
    {
      key: "created_at",
      header: "Joined",
      sortable: true,
      cell: (user) => <span className="text-[var(--text-main)] font-medium">{formatDate(user?.created_at || (user as any)?.createdAt)}</span>,
    },
    {
      key: "updated_at",
      header: "Updated At",
      sortable: true,
      cell: (user) => <span className="text-[var(--text-muted)]">{formatDate(user?.updated_at || (user as any)?.updatedAt || user?.created_at || (user as any)?.createdAt)}</span>,
    },
  ];

  // Filter columns before passing to the actual Table component
  const visibleColumns = columns.filter(c => !hiddenCols.has(c.key));

  const EmptyState = (
    <div className="flex flex-col items-center gap-3 text-[var(--text-muted)]">
      <Users size={36} strokeWidth={1.2} className="opacity-30" />
      <p className="text-sm font-medium">No users found</p>
      <p className="text-xs opacity-70">Try adjusting your search or filters</p>
    </div>
  );

  return (
    <Table
      data={users}
      columns={visibleColumns}
      loading={loading}
      pageSize={pageSize}
      sortBy={sortBy}
      sortDir={sortDir}
      onSort={onSort}
      onRowClick={onRowClick}
      emptyMessage={EmptyState}
    />
  );
}
