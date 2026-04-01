import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import { Loader2 } from "lucide-react";

import { useForgotPassword } from "../../../hooks/useForgotPassword";
import { forgotPasswordSchema, type ForgotPasswordFormValues } from "../../../types/auth.types";
import { Button } from "../../ui/Button";
import { Input } from "../../ui/Input";
import { Message } from "../../ui/Message";
import { useTheme } from "../../../hooks/useTheme";

// ── Baker Tilly logo assets ──────────────────────────────────────────────────
import logoCharcoal from "../../../assets/Logo_Bakertilly/Baker Tilly Logo_Charcoal.png";
import logoWhite from "../../../assets/Logo_Bakertilly/Baker Tilly Logo_White.png";

export const ForgotPasswordForm = () => {
    const forgotPasswordMutation = useForgotPassword();
    const { theme } = useTheme();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ForgotPasswordFormValues>({
        resolver: zodResolver(forgotPasswordSchema),
    });

    const onSubmit = (data: ForgotPasswordFormValues) => {
        forgotPasswordMutation.mutate(data.email);
    };

    /* ── Extract readable success/error messages ── */
    const errorMessage = (() => {
        if (!forgotPasswordMutation.isError) return null;
        const err = forgotPasswordMutation.error;
        return (
            err?.response?.data?.message ??
            err?.message ??
            "Something went wrong. Please try again."
        );
    })();

    const isSuccess = forgotPasswordMutation.isSuccess;

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
                <h1 className="text-2xl font-bold mb-1 text-[color:var(--text-main)]">Reset Password</h1>
                <p className="text-[0.82rem] text-[color:var(--text-muted)]">
                    Enter your email to receive a password reset link.
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
                    If an account with that email exists, we've sent instructions on how to reset your password.
                </Message>
            )}

            {/* ── Form ── */}
            {!isSuccess ? (
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">

                    {/* Email */}
                    <div className="flex flex-col">
                        <label className="text-[0.82rem] font-semibold mb-1.5 text-[color:var(--text-main)]" htmlFor="email">
                            Email Address
                        </label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="name@bakertilly.com"
                            autoComplete="email"
                            {...register("email")}
                        />
                        {errors.email && (
                            <p className="mt-1 text-[0.75rem] text-red-500">{errors.email.message}</p>
                        )}
                    </div>

                    {/* Submit */}
                    <Button
                        type="submit"
                        disabled={forgotPasswordMutation.isPending}
                        className="h-[46px] mt-3 font-semibold"
                    >
                        {forgotPasswordMutation.isPending ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Sending...
                            </>
                        ) : (
                            "Send Reset Link"
                        )}
                    </Button>

                    <div className="text-center mt-2">
                        <Link
                            to="/login"
                            className="text-[0.82rem] font-semibold no-underline transition-colors duration-200 hover:underline hover:brightness-110"
                            style={{ color: "var(--color-growth-green)" }}
                        >
                            Back to Sign In
                        </Link>
                    </div>
                </form>
            ) : (
                <div className="flex flex-col gap-4 mt-2">
                    <Link to="/login" className="w-full">
                        <Button variant="outline" className="h-[46px] font-semibold">
                            Return to Sign In
                        </Button>
                    </Link>
                </div>
            )}
        </div>
    );
};