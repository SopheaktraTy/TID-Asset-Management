import { useState } from "react";
import { Loader2, AlertCircle, Info } from "lucide-react";
import { Modal } from "../../ui/Modal";
import { Button } from "../../ui/Button";
import type { IssueResponse } from "../../../types/issue.types";
import { deleteIssueApi } from "../../../services/issue.service";
import { useTheme } from "../../../hooks/useTheme";
import { toPascalCase } from "../../../utils/format";

// Baker Tilly logo assets
import logoCharcoal from "../../../assets/Logo_Bakertilly/Baker Tilly Growth Symbol Charcoal.png";
import logoWhite from "../../../assets/Logo_Bakertilly/Baker Tilly Growth Symbol White.png";

interface DeleteIssueModalProps {
  isOpen: boolean;
  issue: IssueResponse | null;
  onClose: () => void;
  onDeleted: (issueId: number) => void;
}

export default function DeleteIssueModal({ isOpen, issue, onClose, onDeleted }: DeleteIssueModalProps) {
  const { theme } = useTheme();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !issue) return null;

  const handleDelete = async () => {
    setLoading(true);
    setError(null);
    try {
      await deleteIssueApi(issue.id);
      onDeleted(issue.id);
      onClose();
    } catch (err: any) {
      setError(err?.response?.data?.message || err.message || "Failed to delete issue report");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-[420px]">
      <div className="flex flex-col gap-3 text-center py-4">
        {/* Header - Logo & Title */}
        <div className="w-full flex items-center justify-center pt-2">
          <img
            src={theme === "dark" ? logoWhite : logoCharcoal}
            alt="Logo"
            className="h-14 w-auto object-contain"
          />
          <div className="flex flex-col text-left">
            <h3 className="text-xl mt-2 font-bold tracking-tight text-[var(--text-main)] leading-none">Delete Report</h3>
            <p className="text-[13px] text-[var(--text-muted)] mt-1.5 lowercase font-bold">
              issue history removal
            </p>
          </div>
        </div>

        {/* Issue Summary Card */}
        <div className="flex items-center gap-3.5 p-3.5 border border-dashed border-[var(--border-color)] dark:border-[var(--text-muted)]/20 rounded-xl bg-[var(--bg)] text-left w-full shadow-sm">
          <div className="shrink-0">
            <div className="w-11 h-11 rounded-full flex items-center justify-center bg-red-500/10 text-red-500 shadow-sm">
              <Info size={20} />
            </div>
          </div>
          <div className="flex flex-col min-w-0 leading-tight">
            <span className="text-[13px] font-bold text-[var(--text-main)] truncate tracking-tight">
              {toPascalCase(issue.issueTitle)}
            </span>
            <span className="text-[10px] text-[var(--text-muted)] truncate mt-0.5 opacity-70">
              Reported on {new Date(issue.reportedAt).toLocaleDateString()}
            </span>
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
            Are you sure you want to delete this issue report? This action is permanent and will remove the history of this concern.
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
            {loading ? <Loader2 size={18} className="animate-spin" /> : "Delete Report"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
