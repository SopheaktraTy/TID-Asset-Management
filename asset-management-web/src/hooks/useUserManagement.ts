import { useState, useEffect, useCallback } from "react";
import { getUsersApi } from "../services/userManagement.service";
import type { UserDto } from "../types/user.types";

export function useUserManagement() {
  const [users, setUsers] = useState<UserDto[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters & pagination
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Modals
  const [addOpen, setAddOpen] = useState(false);
  const [editUser, setEditUser] = useState<UserDto | null>(null);

  // Table Columns
  const [hiddenCols, setHiddenCols] = useState<Set<string>>(new Set());

  const handleToggleColumn = (key: string) => {
    setHiddenCols((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  // ── Auto-hide columns based on screen width ────────────────────────────────
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setHiddenCols((prev) => {
        const next = new Set(prev);
        // Reset auto-managed columns to ensure clean state on resize
        const autoCols = ["department", "created_at", "updated_at"];
        autoCols.forEach((k) => next.delete(k));

        if (width < 768) {
          ["department", "created_at", "updated_at"].forEach((k) =>
            next.add(k)
          );
        } else if (width < 1024) {
          ["created_at", "updated_at"].forEach((k) => next.add(k));
        }
        return next;
      });
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const result = await getUsersApi({
        page,
        size: pageSize,
        search: search || undefined,
        role: roleFilter || undefined,
        status: (statusFilter || undefined) as any,
        sortBy,
        sortDir,
      });
      setUsers(result.content || []);
      setTotalElements(result.totalElements || 0);
      setTotalPages(result.totalPages || 1);
    } catch {
      setUsers([]);
      setTotalElements(0);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, search, roleFilter, statusFilter, sortBy, sortDir]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleSort = (field: string, dir?: "asc" | "desc") => {
    if (dir) {
      setSortBy(field);
      setSortDir(dir);
    } else if (sortBy === field) {
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

  return {
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
    hiddenCols,
    setHiddenCols,
    handleToggleColumn,
  };
}
