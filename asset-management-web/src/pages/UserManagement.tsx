import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Users, ChevronRight as ArrowRight } from "lucide-react";
import Header from "../components/layout/Header";
import AddUserModal from "../components/layout/user/AddUserModal";
import EditUserModal from "../components/layout/user/EditUserModal";
import UserToolbar from "../components/layout/user/UserToolbar";
import UserTable, { USER_TABLE_COLUMN_OPTIONS } from "../components/layout/user/UserTable";
import Pagination from "../components/ui/Pagination";
import { useUserManagement } from "../hooks/useUserManagement";

export default function UserManagementPage() {
  const navigate = useNavigate();
  const {
    users,
    setUsers,
    loading,
    search,
    roleFilter,
    setRoleFilter,
    statusFilter,
    setStatusFilter,
    page,
    setPage,
    pageSize,
    setPageSize,
    sortBy,
    sortDir,
    totalElements,
    totalPages,
    addOpen,
    setAddOpen,
    editUser,
    setEditUser,
    handleSort,
    handleSearch,
  } = useUserManagement();

  const [hiddenCols, setHiddenCols] = useState<Set<string>>(new Set());

  const handleToggleColumn = (key: string) => {
    setHiddenCols((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  // ── Auto-hide columns based on screen width on mount ────────────────────────
  useEffect(() => {
    const width = window.innerWidth;
    setHiddenCols((prev) => {
      const next = new Set(prev);
      // Mobile (< 768px): Hide Department, Joined, Updated At
      if (width < 768) {
        next.add("department");
        next.add("created_at");
        next.add("updated_at");
      }
      // Tablet (< 1024px): Hide Joined, Updated At
      else if (width < 1024) {
        next.add("created_at");
        next.add("updated_at");
      }
      return next;
    });
  }, []); // Only on mount to establish a default


  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <Header />

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* ── Page Title ── */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex flex-col">
            <h1 className="text-2xl font-bold text-[var(--text-main)]">Users</h1>
            <div className="flex items-center gap-1.5 text-xs text-[var(--text-muted)]">
              <Users size={13} />
              <span>Users</span>
              <ArrowRight size={12} />
              <span className="text-[var(--text-main)] font-medium">User Management</span>
            </div>
          </div>
        </div>

        {/* ── Card ── */}
        <div className="bg-[var(--bg)] rounded-xl border border-[var(--border-color)] shadow-xl overflow-hidden transition-colors duration-300">
          <UserToolbar
            search={search}
            onSearchChange={handleSearch}
            roleFilter={roleFilter}
            onRoleChange={(val) => { setRoleFilter(val); setPage(0); }}
            statusFilter={statusFilter}
            onStatusChange={(val) => { setStatusFilter(val); setPage(0); }}
            onAddClick={() => setAddOpen(true)}
            hiddenCols={hiddenCols}
            onToggleColumn={handleToggleColumn}
            onSetHiddenCols={setHiddenCols}
            columnOptions={USER_TABLE_COLUMN_OPTIONS}
          />

          <UserTable
            users={users}
            loading={loading}
            pageSize={pageSize}
            sortBy={sortBy}
            sortDir={sortDir}
            hiddenCols={hiddenCols}
            onSort={handleSort}
            onRowClick={(user) => navigate(`/user-detail/${user.id}`)}
          />

          <Pagination
            page={page}
            pageSize={pageSize}
            totalElements={totalElements}
            totalPages={totalPages}
            onPageChange={setPage}
            onPageSizeChange={(size: number) => { setPageSize(size); setPage(0); }}
          />
        </div>
      </main>

      {/* ── Modals ── */}
      <AddUserModal
        isOpen={addOpen}
        onClose={() => setAddOpen(false)}
        onSuccess={(newUser) => {
          setAddOpen(false);
          setUsers((prev) => [newUser, ...prev]);
        }}
      />

      <EditUserModal
        isOpen={!!editUser}
        user={editUser}
        onClose={() => setEditUser(null)}
        onUpdated={(updated: any) => {
          setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
          setEditUser(null);
        }}
      />
    </div>
  );
}
