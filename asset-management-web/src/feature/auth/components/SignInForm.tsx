import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import { Eye, EyeOff, Info, Loader2 } from "lucide-react";

import { useSignIn } from "../hooks/useSignIn";
import { signInSchema, type SignInFormValues } from "../types/auth.types";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { Message } from "../../../components/ui/Message";

export const SignInForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const signInMutation = useSignIn();

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

  /* ── Extract the readable error message from the backend ── */
  const errorMessage = signInMutation.isError
    ? signInMutation.error?.response?.data?.message ??
      "Something went wrong. Please try again."
    : null;

  return (
    <div className="w-full max-w-[440px] bg-[color:var(--surface)] rounded-2xl border border-[color:var(--border-color)] p-8 shadow-[0_1px_3px_rgba(0,0,0,0.06),0_6px_16px_rgba(0,0,0,0.04)] transition-[border-color,box-shadow] duration-200">
      {/* ── Logo ── */}
      <div className="flex justify-center mb-5">
        <img
          src="/Growth%20Symbol%20Charcoal%20JPEG.jpg"
          alt="TID Logo"
          className="w-[52px] h-[52px] rounded-xl object-cover"
        />
      </div>

      {/* ── Header ── */}
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold mb-1.5 text-[color:var(--text-main)]">Welcome back</h1>
        <p className="text-[0.875rem] text-[color:var(--text-muted)]">
          Sign in to your TID Asset Management account
        </p>
      </div>

      {/* ── Demo Callout ── */}
      <div className="flex items-start gap-2.5 bg-blue-500/10 border border-blue-500/15 rounded-xl p-3 text-[0.82rem] text-[color:var(--text-main)] mb-5 leading-relaxed">
        <Info className="w-[18px] h-[18px] text-blue-500 shrink-0 mt-px" />
        <p>
          Use <strong>demo@kt.com</strong> and <strong>demo123</strong> for demo
          access.
        </p>
      </div>

      {/* ── Error / Success Message ── */}
      {errorMessage && (
        <Message variant="error" className="mb-4">
          {errorMessage}
        </Message>
      )}

      {/* ── Social Login ── */}
      <Button type="button" variant="outline" className="h-[44px] mb-5">
        <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
          <path
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            fill="#4285F4"
          />
          <path
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            fill="#34A853"
          />
          <path
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            fill="#FBBC05"
          />
          <path
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            fill="#EA4335"
          />
        </svg>
        Sign in with Google
      </Button>

      {/* ── Divider ── */}
      <div className="flex items-center gap-3 mb-5">
        <div className="flex-1 h-px bg-[color:var(--border-color)]" />
        <span className="text-[0.75rem] font-semibold text-[color:var(--text-muted)] uppercase tracking-wider">OR</span>
        <div className="flex-1 h-px bg-[color:var(--border-color)]" />
      </div>

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
            placeholder="you@company.com"
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
              placeholder="••••••••"
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
              className="w-4 h-4 accent-blue-500 rounded cursor-pointer"
            />
            <span>Remember me</span>
          </label>
          <Link to="/forgot-password" className="text-[0.82rem] font-semibold text-blue-500 no-underline transition-colors duration-150 hover:text-blue-600 hover:underline">
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

      {/* ── Footer ── */}
      <p className="text-center text-[0.82rem] text-[color:var(--text-muted)] mt-6 pb-1">
        Don&apos;t have an account?{" "}
        <Link to="/signup" className="font-semibold text-blue-500 no-underline transition-colors duration-150 hover:text-blue-600 hover:underline">
          Sign Up
        </Link>
      </p>
    </div>
  );
};
