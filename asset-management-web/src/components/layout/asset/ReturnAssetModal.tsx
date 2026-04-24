import { useEffect } from "react";
import { ClipboardCheck, Loader2, AlertCircle } from "lucide-react";
import { useUserForm } from "../../../hooks/useUserForm";
import { useTheme } from "../../../hooks/useTheme";
import { Button } from "../../ui/Button";
import { Message } from "../../ui/Message";
import { Modal } from "../../ui/Modal";
import type {
  ReturnAssetFormValues,
  AssignmentResponse
} from "../../../types/assignment.types";
import { returnAssetSchema } from "../../../types/assignment.types";
import { returnAssetApi } from "../../../services/assignment.service";
import type { AssetDto } from "../../../types/asset.types";

// Baker Tilly logo assets
import logoCharcoal from "../../../assets/Logo_Bakertilly/Baker Tilly Growth Symbol Charcoal.png";
import logoWhite from "../../../assets/Logo_Bakertilly/Baker Tilly Growth Symbol White.png";

interface ReturnAssetModalProps {
  isOpen: boolean;
  asset: AssetDto | null;
  assignment: AssignmentResponse | null;
  onClose: () => void;
  onSuccess: (updatedAssignment: AssignmentResponse) => void;
}

export default function ReturnAssetModal({ isOpen, asset, assignment, onClose, onSuccess }: ReturnAssetModalProps) {
  const { theme } = useTheme();
  const {
    register,
    reset,
    formState: { errors },
    loading,
    errorMsg,
    handleSubmit,
    handleClose: baseHandleClose,
  } = useUserForm<ReturnAssetFormValues>({
    schema: returnAssetSchema,
    defaultValues: {
      returnCondition: "",
      remark: "",
    },
    onSubmit: async (data) => {
      if (!assignment) throw new Error("No active assignment found");
      return returnAssetApi(assignment.id, data);
    },
    onSuccess: (updated) => {
      onSuccess(updated);
      onClose();
    },
    onClose,
    successMessage: "Asset returned successfully!",
  });

  useEffect(() => {
    if (isOpen) {
      reset({
        returnCondition: asset?.condition || "",
        remark: "",
      });
    }
  }, [isOpen, asset, reset]);

  if (!isOpen || !asset || !assignment) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={baseHandleClose}
      maxWidth="max-w-[480px]"
    >
      <div className="flex flex-col gap-2">
        {/* Header - Logo & Title */}
        <div className="w-full flex items-center justify-center mb-4 pt-1">
          <img
            src={theme === "dark" ? logoWhite : logoCharcoal}
            alt="Logo"
            className="h-14 w-auto object-contain"
          />
          <div className="flex flex-col text-left">
            <h3 className="text-xl mt-2 font-bold tracking-tight text-[var(--text-main)] leading-none">Confirm Return</h3>
            <p className="text-[13px] text-[var(--text-muted)] mt-1.5 lowercase font-bold">
              return processing
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 text-left">
          <div className="border border-[var(--border-color)] rounded-2xl p-5 bg-[var(--surface-hover)]/10 space-y-5">
            <div className="px-1 flex items-center gap-2">
              <ClipboardCheck size={16} className="text-[var(--color-growth-green)]" />
              <h3 className="text-sm font-bold text-[var(--text-main)] uppercase tracking-tight">Return Verification</h3>
            </div>

            <p className="text-xs text-[var(--text-muted)] px-1 leading-relaxed">
              Confirming return for <span className="font-bold text-[var(--text-main)]">{asset.deviceName}</span> currently assigned to <span className="font-bold text-blue-500">{assignment.employee.username}</span>.
            </p>

            <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-4 flex gap-3">
              <AlertCircle size={18} className="text-amber-500 shrink-0 mt-0.5" />
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-black text-amber-600 uppercase tracking-tight">Important Notice</span>
                <p className="text-[10px] text-[var(--text-muted)] leading-relaxed">
                  Please inspect the device carefully before confirming the return. Current reported condition of the asset is: <span className="font-bold text-[var(--text-main)]">{asset.condition || "N/A"}</span>.
                </p>
              </div>
            </div>

            {/* Return Condition */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-xs font-bold text-[var(--text-main)] ml-1">
                <ClipboardCheck size={14} className="text-emerald-500" />
                Return Condition *
              </label>
              <textarea
                {...register("returnCondition")}
                className="w-full px-4 py-3 bg-[var(--bg)] border border-[var(--border-color)]/50 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 text-xs text-[var(--text-main)] placeholder:text-[var(--text-muted)] transition-all duration-200 min-h-[100px] resize-none"
                placeholder="Describe the condition of the asset upon return..."
              />
              {errors.returnCondition && (
                <p className="text-[10px] text-red-500 ml-1 font-bold">{errors.returnCondition.message}</p>
              )}
            </div>
 
            {/* Remark */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-xs font-bold text-[var(--text-main)] ml-1">
                Remark
              </label>
              <textarea
                {...register("remark")}
                className="w-full px-4 py-3 bg-[var(--bg)] border border-[var(--border-color)]/50 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 text-xs text-[var(--text-main)] placeholder:text-[var(--text-muted)] transition-all duration-200 min-h-[80px] resize-none"
                placeholder="Add any additional remarks..."
              />
            </div>
          </div>

          {errorMsg && <Message variant="error">{errorMsg}</Message>}

          <div className="pt-2 flex items-center justify-end gap-3 translate-y-1">
            <Button
              type="button"
              variant="outline"
              onClick={baseHandleClose}
              className="bg-transparent border-[var(--border-color)] text-[var(--text-main)] hover:bg-[var(--surface-hover)] rounded-full px-8 h-10 text-sm font-bold transition-all border-opacity-30"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={loading}
              className="w-auto min-w-[160px] h-10 gap-2 px-8 py-2 text-sm font-bold bg-[var(--color-growth-green)] text-[var(--btn-primary-text)] border-0 transition-all rounded-full shadow-[0_2px_8px_var(--btn-primary-shadow)] hover:shadow-[0_4px_14px_var(--btn-primary-shadow)] hover:brightness-110 transform active:scale-95 flex items-center justify-center"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : "Confirm Return"}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
