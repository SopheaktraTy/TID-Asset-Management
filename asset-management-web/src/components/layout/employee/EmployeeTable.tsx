import { useState } from "react";
import { MoreVertical, Users } from "lucide-react";
import type { EmployeeDto } from "../../../types/employee.types";
import { Table, type ColumnDef } from "../../ui/Table";
import { ContextMenu, type ContextMenuOption } from "../../ui/ContextMenu";
import {
  toPascalCase,
  formatDate,
  getInitials,
  getAvatarColor
} from "../../../utils/format";
import { getSafeImageUrl } from "../../../utils/image";

export const EMPLOYEE_TABLE_COLUMN_OPTIONS = [
  { key: "username", label: "Employee" },
  { key: "department", label: "Department" },
  { key: "jobTitle", label: "Job Title" },
  { key: "createdAt", label: "Joined" },
];

interface EmployeeTableProps {
  employees: EmployeeDto[];
  loading: boolean;
  pageSize: number;
  sortBy: string;
  sortDir: "asc" | "desc";
  onSort: (field: string, dir?: "asc" | "desc") => void;
  hiddenCols: Set<string>;
  onEdit: (employee: EmployeeDto) => void;
  onDelete: (employee: EmployeeDto) => void;
  onRowClick?: (employee: EmployeeDto) => void;
  menuClassName?: string;
}

export default function EmployeeTable({
  employees,
  loading,
  pageSize,
  sortBy,
  sortDir,
  onSort,
  hiddenCols,
  onEdit,
  onDelete,
  onRowClick,
  menuClassName = "",
}: EmployeeTableProps) {
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; employee: EmployeeDto } | null>(null);

  const handleRowContextMenu = (e: React.MouseEvent, employee: EmployeeDto) => {
    setContextMenu({ x: e.clientX, y: e.clientY, employee });
  };

  const contextMenuOptions: ContextMenuOption[] = contextMenu ? [
    {
      label: "Edit Employee",
      onClick: () => onEdit(contextMenu.employee),
    },
    {
      label: "Delete Employee",
      onClick: () => onDelete(contextMenu.employee),
      variant: "danger",
    },
  ] : [];
  const columns: ColumnDef<EmployeeDto>[] = [
    {
      key: "username",
      header: "Employee",
      sortable: true,
      cell: (emp) => (
        <div className="flex items-center gap-3 min-w-0 py-1">
          <div className="flex items-center shrink-0 relative z-10">
            {emp?.image ? (
              <img
                src={getSafeImageUrl(emp.image)}
                alt={emp.username || "Employee"}
                className="w-8 h-8 rounded-full object-cover shadow-sm border border-[var(--border-color)]"
              />
            ) : (
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold ${getAvatarColor(
                  emp?.username || ""
                )}`}
              >
                {getInitials(emp?.username || "")}
              </div>
            )}
          </div>
          <div className="min-w-0 flex flex-col leading-tight">
            <p className="text-sm font-bold text-[var(--text-main)] truncate">{emp?.username || "Unknown"}</p>          </div>
        </div>
      ),
    },
    {
      key: "department",
      header: "Department",
      sortable: true,
      cell: (emp) => (
        <span className="text-xs text-[var(--text-muted)]">{toPascalCase(emp?.department)}</span>
      ),
    },
    {
      key: "jobTitle",
      header: "Job Title",
      sortable: true,
      cell: (emp) => (
        <span className="text-[var(--text-main)] font-medium text-xs tracking-tight">{toPascalCase(emp?.jobTitle)}</span>
      ),
    },
    {
      key: "createdAt",
      header: "Joined",
      sortable: true,
      cell: (emp) => <span className="text-[var(--text-main)] font-medium">{formatDate(emp?.createdAt)}</span>,
    },
    {
      key: "actions",
      header: "Actions",
      cell: (emp) => (
        <div className="flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              setContextMenu({
                x: rect.left,
                y: rect.bottom + 5,
                employee: emp
              });
            }}
            className="p-1.5 rounded-lg hover:bg-[var(--surface-hover)] text-[var(--text-muted)] hover:text-[var(--text-main)] transition-all duration-200"
            title="More Actions"
          >
            <MoreVertical size={16} />
          </button>
        </div>
      ),
    },
  ];

  // Filter columns based on hiddenCols
  const visibleColumns = columns.filter(col => col.key === "actions" || !hiddenCols.has(col.key));

  const EmptyState = (
    <div className="flex flex-col items-center gap-3 text-[var(--text-muted)]">
      <Users size={36} strokeWidth={1.2} className="opacity-30" />
      <p className="text-sm font-medium">No employees found</p>
      <p className="text-xs opacity-70">Try adjusting your search or filters</p>
    </div>
  );

  return (
    <>
      <Table
        data={employees}
        columns={visibleColumns}
        loading={loading}
        pageSize={pageSize}
        sortBy={sortBy}
        sortDir={sortDir}
        onSort={onSort}
        onRowClick={onRowClick}
        onRowContextMenu={handleRowContextMenu}
        highlightedRowId={contextMenu?.employee.id}
        emptyMessage={EmptyState}
        menuClassName={menuClassName}
      />

      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          options={contextMenuOptions}
          onClose={() => setContextMenu(null)}
        />
      )}
    </>
  );
}
