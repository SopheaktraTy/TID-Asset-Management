import { ChevronUp, ChevronDown, ChevronsUpDown, Users, ChevronRight as ArrowRight } from "lucide-react";
import type { UserDto } from "../../../types/user.types";

interface UserTableProps {
  users: UserDto[];
  loading: boolean;
  pageSize: number;
  sortBy: string;
  sortDir: "asc" | "desc";
  onSort: (field: string) => void;
  onRowClick: (user: UserDto) => void;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
function formatDate(iso: string | null) {
  if (!iso) return "–";
  return new Date(iso).toLocaleDateString("en-US", {
    month: "long",
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

// ─── Skeleton row ─────────────────────────────────────────────────────────────
function SkeletonRow() {
  return (
    <tr>
      {[...Array(6)].map((_, i) => (
        <td key={i} className="px-6 py-3.5">
          <div className="h-4 rounded-md bg-[var(--border-color)] animate-pulse" style={{ width: i === 0 ? "70%" : "50%" }} />
        </td>
      ))}
    </tr>
  );
}

// ─── Sort Icon ────────────────────────────────────────────────────────────────
function SortIcon({ field, activeField, dir }: { field: string; activeField: string; dir: "asc" | "desc" }) {
  if (activeField !== field) return <ChevronsUpDown size={13} className="text-[var(--text-muted)] opacity-50" />;
  return dir === "asc" ? (
    <ChevronUp size={13} className="text-[var(--color-growth-green)]" />
  ) : (
    <ChevronDown size={13} className="text-[var(--color-growth-green)]" />
  );
}

export default function UserTable({
  users,
  loading,
  pageSize,
  sortBy,
  sortDir,
  onSort,
  onRowClick,
}: UserTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-[var(--border-color)]">
            {[
              { label: "User", field: "username" },
              { label: "Role", field: "role" },
              { label: "Status", field: "status" },
              { label: "Joined", field: "createdAt" },
              { label: "Last Sign In", field: "lastSignIn" },
            ].map(({ label, field }) => (
              <th
                key={field}
                onClick={() => onSort(field)}
                className="px-6 py-3 text-left text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wide cursor-pointer select-none group"
              >
                <span className="flex items-center gap-1.5 w-fit">
                  {label}
                  <SortIcon field={field} activeField={sortBy} dir={sortDir} />
                </span>
              </th>
            ))}
            <th className="px-6 py-3 w-10" />
          </tr>
        </thead>

        <tbody className="divide-y divide-[var(--border-color)]">
          {loading ? (
            [...Array(pageSize)].map((_, i) => <SkeletonRow key={i} />)
          ) : !users || users.length === 0 ? (
            <tr>
              <td colSpan={6} className="px-6 py-16 text-center">
                <div className="flex flex-col items-center gap-3 text-[var(--text-muted)]">
                  <Users size={36} strokeWidth={1.2} className="opacity-30" />
                  <p className="text-sm font-medium">No users found</p>
                  <p className="text-xs opacity-70">Try adjusting your search or filters</p>
                </div>
              </td>
            </tr>
          ) : (
            users.map((user) => (
              <tr
                key={user.id}
                onClick={() => onRowClick(user)}
                className="hover:bg-[var(--surface-hover)] transition-colors cursor-pointer group"
              >
                {/* User */}
                <td className="px-6 py-3.5">
                  <div className="flex items-center gap-3">
                    {user?.image ? (
                      <img
                        src={user.image}
                        alt={user.username || "User"}
                        className="w-8 h-8 rounded-full object-cover ring-2 ring-[var(--border-color)] shrink-0"
                      />
                    ) : (
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${avatarColor(user?.username)}`}>
                        {getInitials(user?.username)}
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="font-medium text-[var(--text-main)] truncate">{user?.username || "Unknown"}</p>
                      <p className="text-xs text-[var(--text-muted)] truncate">{user?.email}</p>
                    </div>
                  </div>
                </td>

                {/* Role */}
                <td className="px-6 py-3.5">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-[var(--border-color)] text-[var(--text-main)]">
                    {user?.role}
                  </span>
                </td>

                {/* Status */}
                <td className="px-6 py-3.5">
                  <span className={`inline-flex items-center gap-1.5 text-sm font-medium ${user?.status === "ACTIVE" ? "text-emerald-600 dark:text-emerald-400" : "text-[var(--text-muted)]"}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${user?.status === "ACTIVE" ? "bg-emerald-500" : "bg-gray-400"}`} />
                    {user?.status ? user.status.charAt(0) + user.status.slice(1).toLowerCase() : "Unknown"}
                  </span>
                </td>

                {/* Joined */}
                <td className="px-6 py-3.5 text-[var(--text-muted)]">{formatDate(user?.createdAt)}</td>

                {/* Last Sign In */}
                <td className="px-6 py-3.5 text-[var(--text-muted)]">{formatDate(user?.lastSignIn)}</td>

                {/* Arrow */}
                <td className="px-4 py-3.5">
                  <ArrowRight size={15} className="text-[var(--text-muted)] opacity-0 group-hover:opacity-100 transition-opacity" />
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
