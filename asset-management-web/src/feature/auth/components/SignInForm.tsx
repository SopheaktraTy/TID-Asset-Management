import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import { Eye, EyeOff, Loader2 } from "lucide-react";

import { useSignIn } from "../hooks/useSignIn";
import { signInSchema, type SignInFormValues } from "../types/auth.types";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { Message } from "../../../components/ui/Message";
import { useTheme } from "../../../hooks/useTheme";

// ── Baker Tilly logo assets ──────────────────────────────────────────────────
import logoCharcoal from "../../../assets/Logo_Bakertilly/Baker Tilly Logo_Charcoal.png";
import logoWhite from "../../../assets/Logo_Bakertilly/Baker Tilly Logo_White.png";

export const SignInForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const signInMutation = useSignIn();
  const { theme } = useTheme();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: { rememberMe: false },
  });

  const onSubmit = (data: SignInFormValues) => {
    signInMutation.mutate(data);
  };

  /* ── Extract a readable error message ── */
  const errorMessage = (() => {
    if (!signInMutation.isError) return null;
    const err = signInMutation.error;
    return (
      err?.response?.data?.message ??
      err?.message ??
      "Something went wrong. Please try again."
    );
  })();

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
        <h1 className="text-2xl font-bold mb-1 text-[color:var(--text-main)]">Welcome back</h1>
        <p className="text-[0.82rem] text-[color:var(--text-muted)]">
          Sign in to your account to continue
        </p>
      </div>

      {/* ── Error / Success Message ── */}
      {errorMessage && (
        <Message variant="error" className="mb-4">
          {errorMessage}
        </Message>
      )}

      {/* ── Form ── */}
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">

        {/* Email */}
        <div className="flex flex-col">
          <label className="text-[0.82rem] font-semibold mb-1.5 text-[color:var(--text-main)]" htmlFor="identifier">
            Email or Username
          </label>
          <Input
            id="identifier"
            type="text"
            placeholder="your email or username"
            autoComplete="username"
            {...register("identifier")}
          />
          {errors.identifier && (
            <p className="mt-1 text-[0.75rem] text-red-500">{errors.identifier.message}</p>
          )}
        </div>

        {/* Password */}
        <div className="flex flex-col">
          <label className="text-[0.82rem] font-semibold mb-1.5 text-[color:var(--text-main)]" htmlFor="password">
            Password
          </label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="your password"
              autoComplete="current-password"
              {...register("password")}
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
          {errors.password && (
            <p className="mt-1 text-[0.75rem] text-red-500">{errors.password.message}</p>
          )}
        </div>

        {/* Remember / Forgot */}
        <div className="flex items-center justify-between pt-0.5">
          <label className="flex items-center gap-2 cursor-pointer text-[0.82rem] text-[color:var(--text-main)]">
            <input
              type="checkbox"
              {...register("rememberMe")}
              className="w-4 h-4 rounded cursor-pointer accent-[var(--color-growth-green)]"
            />
            <span>Remember me</span>
          </label>
          <Link
            to="/forgot-password"
            className="text-[0.82rem] font-semibold no-underline transition-colors duration-200 hover:underline hover:brightness-110"
            style={{ color: "var(--color-growth-green)" }}
          >
            Forgot Password?
          </Link>
        </div>

        {/* Submit */}
        <Button
          type="submit"
          disabled={signInMutation.isPending}
          className="h-[46px] mt-1 font-semibold"
        >
          {signInMutation.isPending ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Signing in…
            </>
          ) : (
            "Sign In"
          )}
        </Button>
      </form>

    </div>
  );
};
