import { useState } from "react";
import { Loader2, AlertCircle, User as UserIcon } from "lucide-react";
import { Modal } from "../../ui/Modal";
import { Button } from "../../ui/Button";
import type { UserDto } from "../../../types/user.types";
import { deleteUserApi } from "../../../services/userManagement.service";
import { getSafeImageUrl } from "../../../utils/image";
import { useTheme } from "../../../hooks/useTheme";

// Baker Tilly logo assets
import logoCharcoal from "../../../assets/Logo_Bakertilly/Baker Tilly Growth Symbol Charcoal.png";
import logoWhite from "../../../assets/Logo_Bakertilly/Baker Tilly Growth Symbol White.png";

interface DeleteUserModalProps {
  isOpen: boolean;
  user: UserDto | null;
  onClose: () => void;
  onDeleted: (userId: number) => void;
}

export default function DeleteUserModal({ isOpen, user, onClose, onDeleted }: DeleteUserModalProps) {
  const { theme } = useTheme();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !user) return null;

  const handleDelete = async () => {
    setLoading(true);
    setError(null);
    try {
      await deleteUserApi(user.id);
      onDeleted(user.id);
      onClose();
    } catch (err: any) {
      setError(err?.response?.data?.message || err.message || "Failed to delete user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-[420px]">
      <div className="flex flex-col gap-3 text-center py-4">
        {/* Header - Logo & Title */}
        <div className="w-full flex items-center justify-center mb-2 pt-2">
          <img
            src={theme === "dark" ? logoWhite : logoCharcoal}
            alt="Logo"
            className="h-14 w-auto object-contain"
          />
          <div className="flex flex-col text-left">
            <h3 className="text-xl font-bold tracking-tight text-[var(--text-main)] leading-none">Delete User</h3>
            <p className="text-[13px] text-[var(--text-muted)] opacity-80 lowercase font-medium">
              permanent data removal
            </p>
          </div>
        </div>

        {/* User Summary Card */}
        <div className="flex flex-col items-center gap-3 px-6 py-6 border border-dashed border-[var(--border-color)] dark:border-[var(--text-muted)]/20 rounded-2xl bg-[var(--surface-hover)]/50 dark:bg-white/[0.05] text-center mx-auto w-fit min-w-[240px]">
          <div className="shrink-0 mb-1">
            <div className="w-16 h-16 rounded-full border-2 border-[var(--border-color)] flex items-center justify-center bg-[var(--surface)] text-[var(--text-main)] font-bold overflow-hidden shadow-md">
              {user.image ? (
                <img src={getSafeImageUrl(user.image)} alt={user.username} className="w-full h-full object-cover" />
              ) : (
                <UserIcon size={28} className="text-[var(--text-muted)]" />
              )}
            </div>
          </div>
          <div className="flex flex-col items-center min-w-0 leading-tight">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-base font-black text-[var(--text-main)] truncate">{user.username}</span>
              <span className="px-2 py-0.5 rounded-full border border-[var(--border-color)]/30 bg-[var(--surface)] text-[9px] text-[var(--text-main)] font-black uppercase tracking-[0.1em] opacity-70">
                {user.role?.replace('_', ' ')}
              </span>
            </div>
            <span className="text-xs text-[var(--text-muted)] truncate opacity-70 font-medium italic">{user.email}</span>
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
                This action cannot be undone. Are you sure you want to permanently remove this user? All associated history, permissions, and records will be erased immediately.
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
            {loading ? <Loader2 size={18} className="animate-spin" /> : "Delete User"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
