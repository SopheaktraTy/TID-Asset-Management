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
import logoCharcoal from "../../../assets/Logo_Bakertilly/Baker Tilly Growth Symbol Charcoal.png";
import logoWhite from "../../../assets/Logo_Bakertilly/Baker Tilly Growth Symbol White.png";


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
        <div className="w-full flex items-center justify-center mb-6 pt-2">
          <img
            src={theme === "dark" ? logoWhite : logoCharcoal}
            alt="Logo"
            className="h-14 w-auto object-contain"
          />
          <div className="flex flex-col text-left">
            <h3 className="text-xl mt-2 font-bold tracking-tight text-[var(--text-main)] leading-none">Reset Password</h3>
            <p className="text-[13px] text-[var(--text-muted)] opacity-80 lowercase font-medium">
              security protocol
            </p>
          </div>
        </div>


        {/* Header content below (no line) */}

        {errorMsg && <Message variant="error">{errorMsg}</Message>}

        {successMsg ? (
          <div className="py-8 flex flex-col items-center justify-center gap-3 animate-in fade-in zoom-in duration-300">
            <CheckCircle2 size={48} className="text-[var(--color-growth-green)]" />
            <p className="font-bold text-[var(--text-main)]">Password Updated!</p>
            <p className="text-xs text-[var(--text-muted)] text-center">{successMsg}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="bg-[var(--surface-hover)]/50 dark:bg-white/[0.05] border border-dashed border-[var(--border-color)]/50 rounded-xl p-4 flex items-start gap-3">
              <AlertCircle size={16} className="text-[var(--color-growth-green)] shrink-0 mt-0.5 opacity-80" />
              <p className="text-[11px] text-[var(--text-muted)] leading-relaxed italic">
                Updating the password will not log the user out of existing sessions, but they will be required to use the new credentials on their next login.
              </p>
            </div>

            <div className="border border-[var(--border-color)]/30 rounded-2xl p-4 bg-[var(--surface-hover)]/5">
              <div className="px-1 mb-3 flex items-center gap-2">
                <ShieldCheck size={16} className="text-[var(--color-growth-green)] opacity-80" />
                <h3 className="text-sm font-bold text-[var(--text-main)]">Authentication Settings</h3>
              </div>

              <div className="px-[10px] space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[var(--text-main)] mb-2 ml-1">New Password</label>
                  <div className="relative group">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Min 6 characters"
                      className="bg-[var(--bg)] border-[var(--border-color)]/50 focus:border-[var(--color-growth-green)]/50 pr-10"
                      {...register("password")}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--color-growth-green)] transition-colors"
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
                      className="bg-[var(--bg)] border-[var(--border-color)]/50 focus:border-[var(--color-growth-green)]/50 pr-10"
                      {...register("confirmPassword")}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--color-growth-green)] transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {errors.confirmPassword && <p className="mt-1 text-[10px] text-red-500 ml-1">{errors.confirmPassword.message}</p>}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2 mt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                className="w-auto min-w-[100px] h-10 bg-transparent border-[var(--border-color)] text-[var(--text-main)] hover:bg-[var(--surface-hover)] rounded-full px-6 text-sm font-bold transition-all border-opacity-30"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={loading}
                className="flex-1 min-w-[200px] h-10 gap-2 px-8 py-2 text-sm font-bold bg-[var(--color-growth-green)] text-black border-0 transition-all rounded-full shadow-lg hover:shadow-[var(--color-growth-green)]/20 hover:brightness-110 transform active:scale-95 flex items-center justify-center"
              >
                {loading ? <Loader2 size={16} className="animate-spin" /> : null}
                Reset Password
              </Button>
            </div>
          </form>
        )}
      </div>
    </Modal>
  );
}
