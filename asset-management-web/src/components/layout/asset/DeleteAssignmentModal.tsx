import { useState } from "react";
import { Loader2, AlertCircle } from "lucide-react";
import { Modal } from "../../ui/Modal";
import { Button } from "../../ui/Button";
import type { AssignmentResponse } from "../../../types/assignment.types";
import { deleteAssignmentApi } from "../../../services/assignment.service";
import { useTheme } from "../../../hooks/useTheme";
import { getAvatarColor, getInitials } from "../../../utils/format";
import { getSafeImageUrl } from "../../../utils/image";

// Baker Tilly logo assets
import logoCharcoal from "../../../assets/Logo_Bakertilly/Baker Tilly Growth Symbol Charcoal.png";
import logoWhite from "../../../assets/Logo_Bakertilly/Baker Tilly Growth Symbol White.png";

interface DeleteAssignmentModalProps {
  isOpen: boolean;
  assignment: AssignmentResponse | null;
  onClose: () => void;
  onDeleted: (assignmentId: number) => void;
}

export default function DeleteAssignmentModal({ isOpen, assignment, onClose, onDeleted }: DeleteAssignmentModalProps) {
  const { theme } = useTheme();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !assignment) return null;

  const handleDelete = async () => {
    setLoading(true);
    setError(null);
    try {
      await deleteAssignmentApi(assignment.id);
      onDeleted(assignment.id);
      onClose();
    } catch (err: any) {
      setError(err?.response?.data?.message || err.message || "Failed to delete assignment record");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-[420px]">
      <div className="flex flex-col gap-3 text-center py-4">
        {/* Header - Logo & Title */}
        <div className="w-full flex items-center justify-center  pt-2">
          <img
            src={theme === "dark" ? logoWhite : logoCharcoal}
            alt="Logo"
            className="h-14 w-auto object-contain"
          />
          <div className="flex flex-col text-left">
            <h3 className="text-xl mt-2 font-bold tracking-tight text-[var(--text-main)] leading-none">Delete Record</h3>
            <p className="text-[13px] text-[var(--text-muted)] mt-1.5 lowercase font-bold">
              assignment history removal
            </p>
          </div>
        </div>

        {/* Assignment Summary Card */}
        <div className="flex items-center gap-3.5 p-3.5 border border-dashed border-[var(--border-color)] dark:border-[var(--text-muted)]/20 rounded-xl bg-[var(--bg)] text-left w-full shadow-sm">
          <div className="shrink-0">
            <div className={`w-11 h-11 rounded-full flex items-center justify-center text-sm font-black shadow-sm overflow-hidden ${!assignment.employee?.image ? getAvatarColor(assignment.employee?.username || 'Unknown') : ''}`}>
              {assignment.employee?.image ? (
                <img src={getSafeImageUrl(assignment.employee.image)} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                getInitials(assignment.employee?.username || 'Unknown')
              )}
            </div>
          </div>
          <div className="flex flex-col min-w-0 leading-tight">
            <span className="text-[13px] font-bold text-[var(--text-main)] truncate tracking-tight">
              {assignment.employee?.username || "Unknown"}
            </span>
            {assignment.employee?.department && (
              <span className="text-[10px] text-[var(--text-muted)] truncate mt-0.5 opacity-70">
                {assignment.employee.department.replace(/_/g, " ")}
              </span>
            )}
          </div>
        </div>

        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-xs text-red-500">
            {error}
          </div>
        )}

        {/* Status Icon Header */}
        <div className="mt-2 flex items-start gap-3 text-left px-2">
          <AlertCircle size={16} className="text-red-500 shrink-0 mt-0.5 opacity-80" />
          <p className="text-[11px] text-[var(--text-muted)] leading-relaxed italic">
            Are you sure you want to delete this assignment record? This will permanently remove this entry from the asset's history.
          </p>
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
            {loading ? <Loader2 size={18} className="animate-spin" /> : "Delete Record"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
