import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, AlertCircle, CheckCircle2, Eye, EyeOff } from "lucide-react";

import { Modal } from "../../ui/Modal";
import { Button } from "../../ui/Button";
import { Input } from "../../ui/BackgroundColorPlaceholder";
import { Message } from "../../ui/Message";
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
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
  });

  if (!isOpen || !user) return null;

  const handleClose = () => {
    reset();
    setErrorMsg(null);
    setIsSuccess(false);
    setShowPassword(false);
    setShowConfirmPassword(false);
    onClose();
  };

  const onSubmit = async (values: ResetPasswordValues) => {
    setLoading(true);
    setErrorMsg(null);
    try {
      await forceResetPasswordApi(user.id, values.password);
      setIsSuccess(true);
      setTimeout(() => {
        onSuccess(user);
        handleClose();
      }, 1500);
    } catch (err: any) {
      setErrorMsg(err?.response?.data?.message || err.message || "Failed to reset password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} maxWidth="max-w-[400px]">
      <div className="flex flex-col gap-2">
        {/* Header - Logo & Title */}
        <div className="w-full flex flex-col items-center mb-1">
          <img
            src={theme === "dark" ? logoWhite : logoCharcoal}
            alt="Logo"
            className="h-8 w-auto object-contain mb-4"
          />
          <div className="text-center">
            <h3 className="text-lg font-bold text-[var(--text-main)]">Reset Password</h3>
            <p className="text-xs text-[var(--text-muted)]">Force a password update for administrative purposes.</p>
          </div>
        </div>

        <div className="h-px bg-[var(--border-color)] w-full opacity-30" />

        {errorMsg && <Message variant="error">{errorMsg}</Message>}

        {isSuccess ? (
          <div className="py-8 flex flex-col items-center justify-center gap-3 animate-in fade-in zoom-in duration-300">
            <CheckCircle2 size={48} className="text-emerald-500" />
            <p className="font-bold text-[var(--text-main)]">Password Updated!</p>
            <p className="text-xs text-[var(--text-muted)] text-center">The user's credentials have been successfully reset.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="bg-[var(--surface-hover)]/30 border border-dashed border-[var(--border-color)] rounded-xl p-4 flex items-start gap-3">
              <AlertCircle size={16} className="text-orange-500 shrink-0 mt-0.5" />
              <p className="text-[11px] text-[var(--text-muted)] leading-relaxed italic">
                Updating the password will not log the user out of existing sessions, but they will be required to use the new credentials on their next login.
              </p>
            </div>

            <div className="space-y-4">
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

            <div className="pt-4 flex items-center justify-end gap-3 border-t border-[var(--border-color)] mt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                className="bg-transparent border-[var(--border-color)] text-[var(--text-main)] hover:bg-[var(--surface-hover)] rounded-full px-6 h-10 text-xs font-bold transition-all"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={loading}
                className="w-auto min-w-[140px] h-10 gap-2 px-6 py-2 text-xs font-bold bg-orange-600 hover:bg-orange-700 text-white border-0 transition-all rounded-full shadow-lg shadow-orange-600/20 active:scale-95"
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
