import { useState } from "react";
import { Loader2, Trash2, AlertCircle, HardDrive } from "lucide-react";
import { Modal } from "../../ui/Modal";
import { Button } from "../../ui/Button";
import type { AssetDto } from "../../../types/asset.types";
import { deleteAssetApi } from "../../../services/asset.service";
import { getSafeImageUrl } from "../../../utils/image";
import { useTheme } from "../../../hooks/useTheme";

// Baker Tilly logo assets
import logoCharcoal from "../../../assets/Logo_Bakertilly/Baker Tilly Logo_Charcoal.png";
import logoWhite from "../../../assets/Logo_Bakertilly/Baker Tilly Logo_White.png";

interface DeleteAssetModalProps {
  isOpen: boolean;
  asset: AssetDto | null;
  onClose: () => void;
  onDeleted: (assetId: number) => void;
}

export default function DeleteAssetModal({ isOpen, asset, onClose, onDeleted }: DeleteAssetModalProps) {
  const { theme } = useTheme();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !asset) return null;

  const handleDelete = async () => {
    setLoading(true);
    setError(null);
    try {
      await deleteAssetApi(asset.id);
      onDeleted(asset.id);
      onClose();
    } catch (err: any) {
      setError(err?.response?.data?.message || err.message || "Failed to delete asset");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-[420px]">
      <div className="flex flex-col gap-6 text-center py-4">
        {/* Header - Logo & Title */}
        <div className="w-full flex flex-col items-center mb-2 pt-2">
          <img
            src={theme === "dark" ? logoWhite : logoCharcoal}
            alt="Logo"
            className="h-10 w-auto object-contain mb-6"
          />
          <div className="text-center">
            <h3 className="text-xl font-black tracking-tighter text-[var(--text-main)] leading-none text-center">Delete Asset</h3>
            <p className="text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-widest mt-2 text-center opacity-70">
              permanent asset removal
            </p>
          </div>
        </div>

        {/* Status Icon Header */}
        <div className="flex flex-col items-center gap-4">
          <div className="space-y-1">
            <div className="mt-2 bg-[var(--surface-hover)]/30 border border-dashed border-red-500/30 rounded-2xl p-4 flex items-start gap-3 text-left">
              <AlertCircle size={18} className="text-red-500 shrink-0 mt-0.5" />
              <p className="text-[11px] text-[var(--text-muted)] leading-relaxed italic">
                This action cannot be undone. Are you sure you want to permanently remove this asset? All associated data, including history and specifications, will be erased immediately.
              </p>
            </div>
          </div>
        </div>

        {/* Asset Summary Card */}
        <div className="flex items-center gap-4 px-4 py-4 border border-dashed border-[var(--border-color)] dark:border-[var(--text-muted)]/30 rounded-xl bg-[var(--surface-hover)]/30 text-left">
          <div className="shrink-0">
            <div className="w-12 h-12 rounded-lg border border-[var(--border-color)] flex items-center justify-center bg-[var(--surface)] text-[var(--text-main)] font-bold overflow-hidden shadow-sm">
              {asset.image ? (
                <img src={getSafeImageUrl(asset.image)} alt={asset.deviceName} className="w-full h-full object-cover" />
              ) : (
                <HardDrive size={20} className="text-[var(--text-muted)]" />
              )}
            </div>
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-bold text-[var(--text-main)] truncate">{asset.deviceName}</span>
            <span className="text-xs text-[var(--text-muted)] truncate font-mono uppercase tracking-tighter">{asset.assetTag}</span>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-xs text-red-500">
            {error}
          </div>
        )}

        <div className="flex items-center justify-end gap-3 pt-4 border-none mt-2">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={loading}
            className="flex-1 max-w-[120px] h-10 border-[var(--border-color)]/30 text-[var(--text-main)] hover:bg-[var(--surface-hover)] rounded-full text-sm font-bold"
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleDelete}
            disabled={loading}
            className="flex-1 min-w-[160px] h-10 bg-red-500 hover:bg-red-600 text-white border-0 shadow-lg shadow-red-500/20 rounded-full transform active:scale-95 transition-all flex items-center justify-center gap-2 text-sm font-bold"
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : (
              <>
                <Trash2 size={16} />
                Delete Asset
              </>
            )}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
