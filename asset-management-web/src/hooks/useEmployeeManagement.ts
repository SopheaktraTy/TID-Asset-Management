import { useState, useEffect, useCallback } from "react";
import { getEmployeesApi, deleteEmployeeApi } from "../services/employee.service";
import type { EmployeeDto } from "../types/employee.types";

export function useEmployeeManagement() {
  const [employees, setEmployees] = useState<EmployeeDto[]>([]);
  const [loading, setLoading] = useState(true);

  // Search
  const [search, setSearch] = useState("");

  // Pagination
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Column Visibility
  const [hiddenCols, setHiddenCols] = useState<Set<string>>(new Set());


  // ── Auto-hide columns based on screen width ────────────────────────────────
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setHiddenCols((prev) => {
        const next = new Set(prev);
        // Reset auto-managed columns to ensure clean state on resize
        const autoCols = ["department", "jobTitle", "createdAt"];
        autoCols.forEach((k) => next.delete(k));

        if (width < 768) {
          ["department", "jobTitle", "createdAt"].forEach((k) => next.add(k));
        } else if (width < 1024) {
          ["createdAt"].forEach((k) => next.add(k));
        }
        return next;
      });
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Modals

  const [addOpen, setAddOpen] = useState(false);
  const [editEmployee, setEditEmployee] = useState<EmployeeDto | null>(null);
  const [deleteEmployee, setDeleteEmployee] = useState<EmployeeDto | null>(null);

  const fetchEmployees = useCallback(async () => {
    setLoading(true);
    try {
      const result = await getEmployeesApi({
        page,
        size: pageSize,
        search: search || undefined,
        sortBy,
        sortDir,
      });
      setEmployees(result.content || []);
      setTotalElements(result.totalElements || 0);
      setTotalPages(result.totalPages || 1);
    } catch (err) {
      console.error("Failed to fetch employees", err);
      setEmployees([]);
      setTotalElements(0);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, search, sortBy, sortDir]);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

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

  const handleDelete = async (id: number) => {
    try {
      await deleteEmployeeApi(id);
      setEmployees((prev) => prev.filter((e) => e.id !== id));
      setDeleteEmployee(null);
    } catch (err) {
      console.error("Failed to delete employee", err);
    }
  };

  const handleToggleColumn = (key: string) => {
    setHiddenCols((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  return {
    employees,
    setEmployees,
    loading,
    search,
    handleSearch,
    page,
    setPage,
    pageSize,
    setPageSize,
    sortBy,
    sortDir,
    handleSort,
    totalElements,
    totalPages,
    hiddenCols,
    setHiddenCols,
    handleToggleColumn,
    addOpen,
    setAddOpen,
    editEmployee,
    setEditEmployee,
    deleteEmployee,
    setDeleteEmployee,
    handleDelete,
    refresh: fetchEmployees,
  };
}
