import { useState } from "react";
import { z } from "zod";
import { Loader2, AlertCircle, CheckCircle2, Eye, EyeOff, ShieldCheck } from "lucide-react";

import { Modal } from "../../ui/Modal";
import { Button } from "../../ui/Button";
import { Input } from "../../ui/BackgroundColorPlaceholder";
import { Message } from "../../ui/Message";
import { useUserForm } from "../../../hooks/useUserForm";
import { forceResetPasswordApi } from "../../../services/userManagement.service";
import type { UserDto } from "../../../types/user.types";
import { useTheme } from "../../../hooks/useTheme";

// Baker Tilly logo assets
import logoCharcoal from "../../../assets/Logo_Bakertilly/Baker Tilly Logo_Charcoal.png";
import logoWhite from "../../../assets/Logo_Bakertilly/Baker Tilly Logo_White.png";


const resetPasswordSchema = z.object({
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Confirmation is required"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;

interface ResetPasswordModalProps {
  isOpen: boolean;
  user: UserDto | null;
  onClose: () => void;
  onSuccess: (updated: UserDto) => void;
}

export default function ResetPasswordModal({
  isOpen,
  user,
  onClose,
  onSuccess,
}: ResetPasswordModalProps) {
  const { theme } = useTheme();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    formState: { errors },
    loading,
    errorMsg,
    successMsg,
    handleClose,
    handleSubmit,
  } = useUserForm<ResetPasswordValues>({
    schema: resetPasswordSchema,
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
    onSubmit: (values) => forceResetPasswordApi(user!.id, values.password),
    onSuccess: () => onSuccess(user!),
    onClose: () => {
      setShowPassword(false);
      setShowConfirmPassword(false);
      onClose();
    },
    successMessage: "Password updated successfully!",
  });

  if (!isOpen || !user) return null;

  return (
    <Modal isOpen={isOpen} onClose={handleClose} maxWidth="max-w-[400px]">
      <div className="flex flex-col gap-2">
        {/* Header - Logo & Title */}
        <div className="w-full flex flex-col items-center mb-6 pt-2">
          <img
            src={theme === "dark" ? logoWhite : logoCharcoal}
            alt="Logo"
            className="h-10 w-auto object-contain mb-6"
          />
          <div className="text-center">
            <h3 className="text-xl font-black tracking-tighter text-[var(--text-main)] leading-none text-center">Reset Password</h3>
            <p className="text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-widest mt-2 text-center opacity-70">
              Security Protocol
            </p>
          </div>
        </div>


        {/* Header content below (no line) */}

        {errorMsg && <Message variant="error">{errorMsg}</Message>}

        {successMsg ? (
          <div className="py-8 flex flex-col items-center justify-center gap-3 animate-in fade-in zoom-in duration-300">
            <CheckCircle2 size={48} className="text-emerald-500" />
            <p className="font-bold text-[var(--text-main)]">Password Updated!</p>
            <p className="text-xs text-[var(--text-muted)] text-center">{successMsg}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="bg-[var(--surface-hover)]/30 border border-dashed border-[var(--border-color)] rounded-xl p-4 flex items-start gap-3">
              <AlertCircle size={16} className="text-orange-500 shrink-0 mt-0.5" />
              <p className="text-[11px] text-[var(--text-muted)] leading-relaxed italic">
                Updating the password will not log the user out of existing sessions, but they will be required to use the new credentials on their next login.
              </p>
            </div>

            <div className="border border-[var(--border-color)]/30 rounded-2xl p-4 bg-[var(--surface-hover)]/5">
              <div className="px-1 mb-3 flex items-center gap-2">
                <ShieldCheck size={16} className="text-orange-500" />
                <h3 className="text-sm font-bold text-[var(--text-main)]">Authentication Settings</h3>
              </div>
              
              <div className="px-[10px] space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[var(--text-main)] mb-2 ml-1">New Password</label>
                  <div className="relative group">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Min 6 characters"
                      className="bg-[var(--bg)] border-[var(--border-color)]/50 focus:border-orange-500/50 pr-10"
                      {...register("password")}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-orange-500 transition-colors"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {errors.password && <p className="mt-1 text-[10px] text-red-500 ml-1">{errors.password.message}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-[var(--text-main)] mb-2 ml-1">Confirm Password</label>
                  <div className="relative group">
                    <Input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Repeat new password"
                      className="bg-[var(--bg)] border-[var(--border-color)]/50 focus:border-orange-500/50 pr-10"
                      {...register("confirmPassword")}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-orange-500 transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {errors.confirmPassword && <p className="mt-1 text-[10px] text-red-500 ml-1">{errors.confirmPassword.message}</p>}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2 border-none mt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                className="flex-1 max-w-[120px] h-10 border-[var(--border-color)]/30 text-[var(--text-main)] hover:bg-[var(--surface-hover)] rounded-full text-sm font-bold"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={loading}
                className="flex-1 min-w-[160px] h-10 bg-orange-500 text-white border-0 shadow-lg shadow-orange-500/20 rounded-full transform active:scale-95 transition-all flex items-center justify-center gap-2 text-sm font-bold"
              >
                {loading ? <Loader2 size={16} className="animate-spin" /> : "Reset Password"}
              </Button>
            </div>
          </form>
        )}
      </div>
    </Modal>
  );
}
