import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useSearchParams } from "react-router-dom";
import { Eye, EyeOff, Loader2 } from "lucide-react";

import { useResetPassword } from "../../../hooks/useResetPassword";
import { resetPasswordSchema, type ResetPasswordFormValues } from "../../../types/auth.types";
import { Button } from "../../ui/Button";
import { Input } from "../../ui/Input";
import { Message } from "../../ui/Message";
import { useTheme } from "../../../hooks/useTheme";

// ── Baker Tilly logo assets ──────────────────────────────────────────────────
import logoCharcoal from "../../../assets/Logo_Bakertilly/Baker Tilly Logo_Charcoal.png";
import logoWhite from "../../../assets/Logo_Bakertilly/Baker Tilly Logo_White.png";

export const ResetPasswordForm = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");

    const resetPasswordMutation = useResetPassword();
    const { theme } = useTheme();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ResetPasswordFormValues>({
        resolver: zodResolver(resetPasswordSchema),
    });

    const onSubmit = (data: ResetPasswordFormValues) => {
        if (!token) return;
        resetPasswordMutation.mutate({ token, newPassword: data.newPassword });
    };

    /* ── Extract readable success/error messages ── */
    const errorMessage = (() => {
        if (!token) return "Invalid or missing reset token. Please request a new password reset link.";
        if (!resetPasswordMutation.isError) return null;
        const err = resetPasswordMutation.error;
        return (
            err?.response?.data?.message ??
            err?.message ??
            "Something went wrong. Please try again."
        );
    })();

    const isSuccess = resetPasswordMutation.isSuccess;

    const isExpiredOrMissing = !token || (errorMessage && errorMessage.toLowerCase().includes("expired"));

    return (
        <div className="w-full max-w-[440px] bg-[color:var(--surface)] rounded-2xl border border-[color:var(--border-color)] px-5 py-7 sm:p-8 shadow-[0_1px_3px_rgba(0,0,0,0.06),0_6px_16px_rgba(0,0,0,0.04)] transition-[border-color,box-shadow] duration-200">

            {/* ── Logo ── */}
            <div className="flex justify-center mb-6">
                <img
                    src={theme === "dark" ? logoWhite : logoCharcoal}
                    alt="Baker Tilly Logo"
                    className="h-[44px] w-auto object-contain"
                />
            </div>

            {/* ── Header ── */}
            <div className="text-center mb-6">
                <h1 className="text-2xl font-bold mb-1 text-[color:var(--text-main)]">Change Password</h1>
                <p className="text-[0.82rem] text-[color:var(--text-muted)]">
                    Enter your new password below.
                </p>
            </div>

            {/* ── Messages ── */}
            {errorMessage && (
                <Message variant="error" className="mb-4">
                    {errorMessage}
                </Message>
            )}

            {isSuccess && (
                <Message variant="success" className="mb-4">
                    Your password has been successfully reset.
                </Message>
            )}

            {/* ── Form ── */}
            {!isSuccess && token && !isExpiredOrMissing ? (
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">

                    {/* New Password */}
                    <div className="flex flex-col">
                        <label className="text-[0.82rem] font-semibold mb-1.5 text-[color:var(--text-main)]" htmlFor="newPassword">
                            New Password
                        </label>
                        <div className="relative">
                            <Input
                                id="newPassword"
                                type={showPassword ? "text" : "password"}
                                placeholder="New password"
                                autoComplete="new-password"
                                {...register("newPassword")}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-[color:var(--text-muted)] bg-transparent border-none cursor-pointer p-0.5 flex items-center transition-colors duration-150 hover:text-[color:var(--text-main)]"
                                aria-label={showPassword ? "Hide password" : "Show password"}
                            >
                                {showPassword ? (
                                    <Eye className="w-[18px] h-[18px]" />
                                ) : (
                                    <EyeOff className="w-[18px] h-[18px]" />
                                )}
                            </button>
                        </div>
                        {errors.newPassword && (
                            <p className="mt-1 text-[0.75rem] text-red-500">{errors.newPassword.message}</p>
                        )}
                    </div>

                    {/* Confirm Password */}
                    <div className="flex flex-col">
                        <label className="text-[0.82rem] font-semibold mb-1.5 text-[color:var(--text-main)]" htmlFor="confirmPassword">
                            Confirm Password
                        </label>
                        <div className="relative">
                            <Input
                                id="confirmPassword"
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder="Confirm password"
                                autoComplete="new-password"
                                {...register("confirmPassword")}
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-[color:var(--text-muted)] bg-transparent border-none cursor-pointer p-0.5 flex items-center transition-colors duration-150 hover:text-[color:var(--text-main)]"
                                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                            >
                                {showConfirmPassword ? (
                                    <Eye className="w-[18px] h-[18px]" />
                                ) : (
                                    <EyeOff className="w-[18px] h-[18px]" />
                                )}
                            </button>
                        </div>
                        {errors.confirmPassword && (
                            <p className="mt-1 text-[0.75rem] text-red-500">{errors.confirmPassword.message}</p>
                        )}
                    </div>

                    {/* Submit */}
                    <Button
                        type="submit"
                        disabled={resetPasswordMutation.isPending || !token}
                        className="h-[46px] mt-3 font-semibold"
                    >
                        {resetPasswordMutation.isPending ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Resetting...
                            </>
                        ) : (
                            "Reset Password"
                        )}
                    </Button>

                </form>
            ) : null}

            {/* Action buttons when the form is hidden (success, missing token, or expired) */}
            {(isSuccess || isExpiredOrMissing) && (
                <div className="flex flex-col gap-3 mt-2">
                    {!isSuccess && (
                        <Link to="/forgot-password" className="w-full">
                            <Button type="button" className="w-full h-[46px] font-semibold">
                                Request New Link
                            </Button>
                        </Link>
                    )}
                    <Link to="/login" className="w-full">
                        <Button variant={isSuccess ? "primary" : "outline"} className="w-full h-[46px] font-semibold">
                            Return to Sign In
                        </Button>
                    </Link>
                </div>
            )}
        </div>
    );
};