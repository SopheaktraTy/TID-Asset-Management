import { useState, useEffect, useCallback, useMemo } from "react";
import { getAllEmployeesApi, deleteEmployeeApi } from "../services/employee.service";
import type { EmployeeDto } from "../types/employee.types";

export function useEmployeeManagement() {
  const [employees, setEmployees] = useState<EmployeeDto[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Search & Filters
  const [search, setSearch] = useState("");
  
  // Pagination
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(5);

  // Column Visibility
  const [hiddenCols, setHiddenCols] = useState<Set<string>>(new Set());

  // Modals
  const [addOpen, setAddOpen] = useState(false);
  const [editEmployee, setEditEmployee] = useState<EmployeeDto | null>(null);
  const [deleteEmployee, setDeleteEmployee] = useState<EmployeeDto | null>(null);

  const fetchEmployees = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getAllEmployeesApi();
      setEmployees(data);
    } catch (err) {
      console.error("Failed to fetch employees", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  const filteredEmployees = useMemo(() => {
    return employees.filter((emp) =>
      emp.username.toLowerCase().includes(search.toLowerCase())
    );
  }, [employees, search]);

  // Client-side pagination for now (since backend doesn't support it yet)
  const paginatedEmployees = useMemo(() => {
    const start = page * pageSize;
    return filteredEmployees.slice(start, start + pageSize);
  }, [filteredEmployees, page, pageSize]);

  const totalElements = filteredEmployees.length;
  const totalPages = Math.ceil(totalElements / pageSize) || 1;

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
    employees: paginatedEmployees,
    setEmployees,
    loading,
    search,
    setSearch: (val: string) => { setSearch(val); setPage(0); },
    page,
    setPage,
    pageSize,
    setPageSize,
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
