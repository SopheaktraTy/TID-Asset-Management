import { useState } from "react";
import { Loader2, TriangleAlert, Trash2 } from "lucide-react";
import { Modal } from "../../ui/Modal";
import { Button } from "../../ui/Button";
import type { UserDto } from "../../../types/user.types";
import { deleteUserApi } from "../../../services/userManagement.service";
import { useTheme } from "../../../hooks/useTheme";
import { getSafeImageUrl } from "../../../utils/image";

// Baker Tilly logo assets
import logoCharcoal from "../../../assets/Logo_Bakertilly/Baker Tilly Logo_Charcoal.png";
import logoWhite from "../../../assets/Logo_Bakertilly/Baker Tilly Logo_White.png";

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
      <div className="flex flex-col gap-2 text-center">
        {/* Header - Logo & Title */}
        <div className="w-full flex flex-col items-center mb-1">
          <img
            src={theme === "dark" ? logoWhite : logoCharcoal}
            alt="Logo"
            className="h-8 w-auto object-contain mb-4"
          />
          <div className="text-center">
            <h3 className="text-xl font-black tracking-tight text-[var(--text-main)]">Delete User</h3>
            <p className="text-[10px] text-[var(--text-muted)] mt-1 font-bold uppercase tracking-wider">Permanent Account Removal</p>
          </div>
        </div>

        <div className="h-px bg-[var(--border-color)] w-full opacity-30" />

        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 mb-2">
            <TriangleAlert size={32} />
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-sm text-[var(--text-muted)]">
              This action cannot be undone. Are you sure you want to permanently remove this user?
            </p>
          </div>
        </div>

        {/* User Summary Card (Matched with EditUserModal) */}
        <div className="flex items-center gap-4 px-4 py-4 border border-dashed border-[var(--border-color)] dark:border-[var(--text-muted)]/30 rounded-xl bg-[var(--surface-hover)]/30 text-left">
          <div className="shrink-0">
            <div className="w-12 h-12 rounded-full border border-[var(--border-color)] flex items-center justify-center bg-[var(--surface)] text-[var(--text-main)] font-bold text-base overflow-hidden">
              {user.image ? (
                <img src={getSafeImageUrl(user.image)} alt={user.username} className="w-full h-full object-cover" />
              ) : (
                user.username?.slice(0, 2).toUpperCase()
              )}
            </div>
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-bold text-[var(--text-main)] truncate">{user.username}</span>
            <span className="text-xs text-[var(--text-muted)] truncate">{user.email}</span>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-xs text-red-500">
            {error}
          </div>
        )}

        <div className="flex flex-col gap-2 pt-2">
          <Button
            variant="primary"
            onClick={handleDelete}
            disabled={loading}
            className="w-full h-11 bg-red-500 hover:bg-red-600 text-white border-0 shadow-lg shadow-red-500/20 rounded-xl transform active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : (
              <>
                <Trash2 size={16} />
                Confirm Delete
              </>
            )}
          </Button>
          <Button
            variant="outline"
            onClick={onClose}
            disabled={loading}
            className="w-full h-11 border-[var(--border-color)] text-[var(--text-main)] hover:bg-[var(--surface-hover)] rounded-xl"
          >
            Cancel
          </Button>
        </div>
      </div>
    </Modal>
  );
}
