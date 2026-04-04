import { Users } from "lucide-react";
import type { UserDto } from "../../../types/user.types";
import { Table, type ColumnDef } from "../../ui/Table";

export const USER_TABLE_COLUMN_OPTIONS = [
  { key: "username", label: "User" },
  { key: "department", label: "Department" },
  { key: "role", label: "Role" },
  { key: "is_active", label: "Status" },
  { key: "created_at", label: "Created At" },
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
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex items-center shrink-0 relative z-10">
            {user?.image ? (
              <img
                src={user.image}
                alt={user.username || "User"}
                className="w-8 h-8 rounded-full object-cover ring-2 ring-[var(--surface)] shadow-sm"
              />
            ) : (
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${avatarColor(
                  user?.username || ""
                )}`}
              >
                {getInitials(user?.username || "")}
              </div>
            )}
          </div>
          <div className="min-w-0 flex flex-col">
            <p className="font-medium text-[var(--text-main)] truncate">{user?.username || "Unknown"}</p>
            <p className="text-xs text-[var(--text-muted)] truncate">{user?.email}</p>
          </div>
        </div>
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
      key: "role",
      header: "Role",
      sortable: true,
      cell: (user) => (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-[var(--border-color)] text-[var(--text-main)]">
          {user?.role}
        </span>
      ),
    },
    {
      key: "is_active",
      header: "Status",
      sortable: true,
      cell: (user) => {
        // Fallback to "status" if is_active is undefined depending on API implementation
        const isActiveOrActive = user?.is_active ?? (user?.status === "ACTIVE");
        return (
          <span className={`inline-flex items-center gap-1.5 text-sm font-medium ${isActiveOrActive ? "text-emerald-600 dark:text-emerald-400" : "text-[var(--text-muted)]"}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${isActiveOrActive ? "bg-emerald-500" : "bg-gray-400"}`} />
            {isActiveOrActive ? "Active" : "Inactive"}
          </span>
        );
      },
    },
    {
      key: "created_at",
      header: "Created At",
      sortable: true,
      cell: (user) => <span className="text-[var(--text-muted)]">{formatDate(user?.created_at || (user as any)?.createdAt)}</span>,
    },
    {
      key: "updated_at",
      header: "Updated At",
      sortable: true,
      cell: (user) => <span className="text-[var(--text-muted)]">{formatDate(user?.updated_at || (user as any)?.updatedAt || user?.created_at || (user as any)?.createdAt || null)}</span>,
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
