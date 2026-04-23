import { useState } from "react";
import { Loader2, AlertCircle, User } from "lucide-react";
import { Modal } from "../../ui/Modal";
import { Button } from "../../ui/Button";
import type { EmployeeDto } from "../../../types/employee.types";
import { deleteEmployeeApi } from "../../../services/employee.service";
import { getSafeImageUrl } from "../../../utils/image";
import { useTheme } from "../../../hooks/useTheme";
import { toPascalCase } from "../../../utils/format";

// Baker Tilly logo assets
import logoCharcoal from "../../../assets/Logo_Bakertilly/Baker Tilly Growth Symbol Charcoal.png";
import logoWhite from "../../../assets/Logo_Bakertilly/Baker Tilly Growth Symbol White.png";

interface DeleteEmployeeModalProps {
  isOpen: boolean;
  employee: EmployeeDto | null;
  onClose: () => void;
  onDeleted: (employeeId: number) => void;
}

export default function DeleteEmployeeModal({ isOpen, employee, onClose, onDeleted }: DeleteEmployeeModalProps) {
  const { theme } = useTheme();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !employee) return null;

  const handleDelete = async () => {
    setLoading(true);
    setError(null);
    try {
      await deleteEmployeeApi(employee.id);
      onDeleted(employee.id);
      onClose();
    } catch (err: any) {
      setError(err?.response?.data?.message || err.message || "Failed to delete employee");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-[420px]">
      <div className="flex flex-col gap-3 text-center py-4">
        {/* Header - Logo & Title */}
        <div className="w-full flex items-center justify-center mb-6 pt-2">
          <img
            src={theme === "dark" ? logoWhite : logoCharcoal}
            alt="Logo"
            className="h-14 w-auto object-contain"
          />
          <div className="flex flex-col text-left">
            <h3 className="text-xl mt-2 font-bold tracking-tight text-[var(--text-main)] leading-none">Delete Employee</h3>
            <p className="text-[13px] text-[var(--text-muted)] opacity-80 lowercase font-medium">
              permanent personnel removal
            </p>
          </div>
        </div>



        {/* Employee Summary Card */}
        <div className="flex flex-col items-center gap-3 px-6 py-6 border border-dashed border-[var(--border-color)] dark:border-[var(--text-muted)]/20 rounded-2xl bg-[var(--surface-hover)]/50 dark:bg-white/[0.05] text-center mx-auto w-fit min-w-[240px]">
          <div className="shrink-0">
            <div className="w-16 h-16 rounded-full border-2 border-[var(--border-color)] flex items-center justify-center bg-[var(--surface)] text-[var(--text-main)] font-bold overflow-hidden shadow-md">
              {employee.image ? (
                <img src={getSafeImageUrl(employee.image)} alt={employee.username} className="w-full h-full object-cover" />
              ) : (
                <User size={28} className="text-[var(--text-muted)]" />
              )}
            </div>
          </div>
          <div className="flex flex-col items-center min-w-0 leading-tight">
            <span className="text-base font-black text-[var(--text-main)] truncate">{employee.username}</span>
            <span className="text-xs text-[var(--text-muted)] font-bold truncate mt-1.5 opacity-90 tracking-tight">{toPascalCase(employee.jobTitle)}</span>
            <span className="text-[10px] text-[var(--text-muted)] truncate opacity-60 mt-1 uppercase font-bold tracking-widest">{toPascalCase(employee.department)}</span>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-xs text-red-500">
            {error}
          </div>
        )}
        {/* Status Icon Header */}
        <div className="flex flex-col items-center gap-4">
          <div className="space-y-1">
            <div className="mt-2 bg-[var(--surface-hover)]/50 dark:bg-white/[0.05] border border-dashed border-red-500/20 rounded-2xl p-4 flex items-start gap-3 text-left">
              <AlertCircle size={16} className="text-red-500 shrink-0 mt-0.5 opacity-80" />
              <p className="text-[11px] text-[var(--text-muted)] leading-relaxed italic">
                This action cannot be undone. Are you sure you want to permanently remove this employee? All associated data, including asset assignments and records, will be affected.
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-end gap-3 pt-4 border-none mt-2">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={loading}
            className="w-auto min-w-[100px] h-11 bg-transparent border border-[var(--border-color)]/30 text-[var(--text-main)] hover:bg-[var(--surface-hover)] rounded-full px-6 text-sm font-bold transition-all"
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleDelete}
            disabled={loading}
            className="flex-1 min-w-[200px] h-11 bg-red-500 hover:bg-red-600 text-white border-0 shadow-lg shadow-red-500/20 rounded-full transform active:scale-95 transition-all flex items-center justify-center gap-2 text-sm font-bold"
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : "Delete Employee"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
