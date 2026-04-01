import { useState, useEffect, useCallback, useMemo } from "react";
import { Users, ChevronRight as ArrowRight } from "lucide-react";
import Header from "../components/layout/Header";
import AddUserModal from "../components/layout/user/AddUserModal";
import EditUserModal from "../components/layout/user/EditUserModal";
import UserToolbar from "../components/layout/user/UserToolbar";
import UserTable from "../components/layout/user/UserTable";
import UserPagination from "../components/layout/user/UserPagination";
import { getUsersApi } from "../services/userManagement.service";
import type { UserDto } from "../types/user.types";

export default function UserManagementPage() {
  const [allUsers, setAllUsers] = useState<UserDto[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters & pagination
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  // Modals
  const [addOpen, setAddOpen] = useState(false);
  const [editUser, setEditUser] = useState<UserDto | null>(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      // The backend returns a full list; query params are applied client-side
      const result = await getUsersApi({} as any);
      setAllUsers(result || []);
    } catch {
      setAllUsers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const filteredUsers = useMemo(() => {
    return allUsers
      .filter((u) => {
        const matchSearch = search
          ? u.username?.toLowerCase().includes(search.toLowerCase()) ||
          u.email?.toLowerCase().includes(search.toLowerCase())
          : true;
        const matchRole = roleFilter ? u.role === roleFilter : true;
        const matchStatus = statusFilter ? u.status === statusFilter : true;
        return matchSearch && matchRole && matchStatus;
      })
      .sort((a, b) => {
        let valA = (a as any)[sortBy] || "";
        let valB = (b as any)[sortBy] || "";
        if (typeof valA === "string") valA = valA.toLowerCase();
        if (typeof valB === "string") valB = valB.toLowerCase();

        if (valA < valB) return sortDir === "asc" ? -1 : 1;
        if (valA > valB) return sortDir === "asc" ? 1 : -1;
        return 0;
      });
  }, [allUsers, search, roleFilter, statusFilter, sortBy, sortDir]);

  const totalElements = filteredUsers.length;
  const totalPages = Math.ceil(totalElements / pageSize) || 1;
  const paginatedUsers = filteredUsers.slice(page * pageSize, (page + 1) * pageSize);

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(field);
      setSortDir("asc");
    }
    setPage(0);
  };

  const handleSearch = (val: string) => {
    setSearch(val);
    setPage(0);
  };

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <Header />

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* ── Page Title ── */}
        <div className="mb-6">
          <div className="flex items-center gap-1.5 text-xs text-[var(--text-muted)] mb-1">
            <Users size={13} />
            <span>Users</span>
            <ArrowRight size={12} />
            <span className="text-[var(--text-main)] font-medium">User Management</span>
          </div>
          <h1 className="text-2xl font-bold text-[var(--text-main)]">Users</h1>
          <p className="text-sm text-[var(--text-muted)] mt-0.5">User Management</p>
        </div>

        {/* ── Card ── */}
        <div className="bg-[var(--surface)] rounded-2xl border border-[var(--border-color)] shadow-sm overflow-hidden">
          <UserToolbar
            search={search}
            onSearchChange={handleSearch}
            roleFilter={roleFilter}
            onRoleChange={(val) => { setRoleFilter(val); setPage(0); }}
            statusFilter={statusFilter}
            onStatusChange={(val) => { setStatusFilter(val); setPage(0); }}
            onAddClick={() => setAddOpen(true)}
          />

          <UserTable
            users={paginatedUsers}
            loading={loading}
            pageSize={pageSize}
            sortBy={sortBy}
            sortDir={sortDir}
            onSort={handleSort}
            onRowClick={(user) => setEditUser(user)}
          />

          <UserPagination
            page={page}
            pageSize={pageSize}
            totalElements={totalElements}
            totalPages={totalPages}
            onPageChange={setPage}
            onPageSizeChange={(size) => { setPageSize(size); setPage(0); }}
          />
        </div>
      </main>

      {/* ── Modals ── */}
      <AddUserModal
        isOpen={addOpen}
        onClose={() => setAddOpen(false)}
        onSuccess={(newUser) => {
          setAddOpen(false);
          setAllUsers((prev) => [newUser, ...prev]);
        }}
      />

      <EditUserModal
        isOpen={!!editUser}
        user={editUser}
        onClose={() => setEditUser(null)}
        onUpdated={(updated) => {
          setAllUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
          setEditUser(null);
        }}
        onDeleted={(id) => {
          setAllUsers((prev) => prev.filter((u) => u.id !== id));
          setEditUser(null);
        }}
      />
    </div>
  );
}
