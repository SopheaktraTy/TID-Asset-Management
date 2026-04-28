import { ChevronRight as ArrowRight, Users2 } from "lucide-react";
import EmployeeTable, { EMPLOYEE_TABLE_COLUMN_OPTIONS } from "../components/layout/employee/EmployeeTable";
import EmployeeToolbar from "../components/layout/employee/EmployeeToolbar";
import Pagination from "../components/ui/Pagination";
import { useEmployeeManagement } from "../hooks/useEmployeeManagement";
import AddEmployeeModal from "../components/layout/employee/AddEmployeeModal";
import EditEmployeeModal from "../components/layout/employee/EditEmployeeModal";
import DeleteEmployeeModal from "../components/layout/employee/DeleteEmployeeModal";

export default function EmployeeManagementPage() {
  const {
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
  } = useEmployeeManagement();

  return (
    <div className="bg-[var(--bg)] min-h-screen">
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* ── Page Title ── */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex flex-col">
            <h1 className="text-2xl font-bold text-[var(--text-main)]">Employees</h1>
            <div className="flex items-center gap-1.5 text-xs text-[var(--text-muted)]">
              <Users2 size={13} />
              <span>Employees</span>
              <ArrowRight size={12} />
              <span className="text-[var(--text-main)] font-medium">Employee Management</span>
            </div>
          </div>
        </div>

        {/* ── Main Container ── */}
        <div className="bg-[var(--bg)] rounded-xl border border-[var(--border-color)] shadow-xl overflow-hidden transition-colors duration-300">
          <EmployeeToolbar
            search={search}
            onSearchChange={handleSearch}
            onAddClick={() => setAddOpen(true)}
            hiddenCols={hiddenCols}
            onToggleColumn={handleToggleColumn}
            onSetHiddenCols={setHiddenCols}
            columnOptions={EMPLOYEE_TABLE_COLUMN_OPTIONS}
          />

          <EmployeeTable
            employees={employees}
            loading={loading}
            pageSize={pageSize}
            sortBy={sortBy}
            sortDir={sortDir}
            onSort={handleSort}
            hiddenCols={hiddenCols}
            onEdit={(emp) => setEditEmployee(emp)}
            onDelete={(emp) => setDeleteEmployee(emp)}
            menuClassName="bg-[var(--bg)]"
          />

          <Pagination
            page={page}
            pageSize={pageSize}
            totalElements={totalElements}
            totalPages={totalPages}
            onPageChange={setPage}
            onPageSizeChange={(size: number) => { setPageSize(size); setPage(0); }}
            panelClassName="bg-[var(--bg)]"
          />
        </div>
      </main>

      {/* ── Modals ── */}
      <AddEmployeeModal
        isOpen={addOpen}
        onClose={() => setAddOpen(false)}
        onSuccess={(newEmp) => {
          setEmployees((prev: any[]) => [newEmp, ...prev]);
          setAddOpen(false);
        }}
      />

      <EditEmployeeModal
        isOpen={!!editEmployee}
        employee={editEmployee}
        onClose={() => setEditEmployee(null)}
        onUpdated={(updated) => {
          setEmployees((prev: any[]) => prev.map((e) => (e.id === updated.id ? updated : e)));
          setEditEmployee(null);
        }}
      />

      <DeleteEmployeeModal
        isOpen={!!deleteEmployee}
        employee={deleteEmployee}
        onClose={() => setDeleteEmployee(null)}
        onDeleted={(id) => {
          setEmployees((prev: any[]) => prev.filter((e) => e.id !== id));
          setDeleteEmployee(null);
        }}
      />
    </div>
  );
}
