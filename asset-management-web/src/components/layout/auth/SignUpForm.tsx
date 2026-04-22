import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import { Eye, EyeOff, Loader2, CheckCircle2 } from "lucide-react";

import { useSignUp } from "../../../hooks/useSignUp";
import { signUpSchema, type SignUpFormValues } from "../../../types/auth.types";
import { Button } from "../../ui/Button";
import { Input } from "../../ui/AuthPlaceholder";
import { DropdownReverseList } from "../../ui/DropdownReverseList";
import { Message } from "../../ui/Message";
import { useTheme } from "../../../hooks/useTheme";

// ── Baker Tilly logo assets ──────────────────────────────────────────────────
import logoCharcoal from "../../../assets/Logo_Bakertilly/Baker Tilly Logo_Charcoal.png";
import logoWhite from "../../../assets/Logo_Bakertilly/Baker Tilly Logo_White.png";

// ── Department options ────────────────────────────────────────────────────────
const DEPARTMENT_OPTIONS = [
    { value: "", label: "Select a department..." },
    { value: "OFFICE_ADMIN", label: "Office Admin" },
    { value: "TAX_ACCOUNTING_ADVISORY", label: "Tax & Accounting Advisory" },
    { value: "LEGAL_CORPORATE_ADVISORY", label: "Legal & Corporate Advisory" },
    { value: "AUDIT_ASSURANCE", label: "Audit & Assurance" },
    { value: "PRACTICE_DEVELOPMENT_MANAGEMENT", label: "Practice Development & Management" },
    { value: "CLIENT_OPERATION_MANAGEMENT", label: "Client & Operation Management" },
    { value: "FINANCE_HUMAN_RESOURCE", label: "Finance & Human Resource" },
    { value: "TECHNOLOGY_INNOVATION_DEVELOPMENT", label: "Technology Innovation and Development" },
];

const JOB_TITLE_OPTIONS = [
    { value: "", label: "Select a job title..." },
    { value: "ASSISTANT_MANAGER", label: "Assistant Manager" },
    { value: "ASSOCIATE", label: "Associate" },
    { value: "ASSOCIATE_DIRECTOR", label: "Associate Director" },
    { value: "CONSULTANT", label: "Consultant" },
    { value: "DIRECTOR", label: "Director" },
    { value: "EXECUTIVE", label: "Executive" },
    { value: "EXECUTIVE_ASSISTANT", label: "Executive Assistant" },
    { value: "INTERN", label: "Intern" },
    { value: "MANAGER", label: "Manager" },
    { value: "PERSONAL_ASSISTANT_TO_MANAGING_PARTNER", label: "Personal Assistant to Managing Partner" },
    { value: "RECEPTIONIST", label: "Receptionist" },
    { value: "SENIOR_ADMIN_EXECUTIVE", label: "Senior Admin Executive" },
    { value: "SENIOR_ASSOCIATE", label: "Senior Associate" },
    { value: "SENIOR_CONSULTANT", label: "Senior Consultant" },
    { value: "SENIOR_EXECUTIVE", label: "Senior Executive" },
    { value: "SENIOR_IT_EXECUTIVE", label: "Senior IT Executive" },
    { value: "SENIOR_MANAGER", label: "Senior Manager" },
    { value: "SUPERVISOR", label: "Supervisor" },
];

export const SignUpForm = () => {
    const [showPassword, setShowPassword] = useState(false);
    const signUpMutation = useSignUp();
    const { theme } = useTheme();

    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
    } = useForm<SignUpFormValues>({
        resolver: zodResolver(signUpSchema),
    });

    const onSubmit = (data: SignUpFormValues) => {
        signUpMutation.mutate(data);
    };

    /* ── Extract a readable error message ── */
    const errorMessage = (() => {
        if (!signUpMutation.isError) return null;
        const err = signUpMutation.error;
        return (
            err?.response?.data?.message ??
            err?.message ??
            "Something went wrong. Please try again."
        );
    })();

    if (signUpMutation.isSuccess) {
        return (
            <div className="w-full max-w-[440px] bg-[color:var(--surface)] rounded-2xl border border-[color:var(--border-color)] px-5 py-7 sm:p-8 shadow-[0_1px_3px_rgba(0,0,0,0.06),0_6px_16px_rgba(0,0,0,0.04)] transition-[border-color,box-shadow] duration-200 text-center">
                <div className="flex justify-center mb-6">
                    <img
                        src={theme === "dark" ? logoWhite : logoCharcoal}
                        alt="Baker Tilly Logo"
                        className="h-[44px] w-auto object-contain"
                    />
                </div>
                <div className="flex justify-center mb-4">
                    <CheckCircle2 className="w-12 h-12 text-[color:var(--color-growth-green)]" />
                </div>
                <h1 className="text-2xl font-bold mb-3 text-[color:var(--text-main)]">Account Created</h1>
                <p className="text-[0.9rem] text-[color:var(--text-muted)] mb-6">
                    Your account has been created successfully. However, it requires approval from a Super Admin before you can log in.
                    <br /><br />
                    Please contact your administration team for activation.
                </p>
                <Link to="/login" className="w-full inline-block">
                    <Button variant="primary" className="w-full h-[46px] font-semibold">
                        Return to Sign In
                    </Button>
                </Link>
            </div>
        );
    }

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
                <h1 className="text-2xl font-bold mb-1 text-[color:var(--text-main)]">Create Account</h1>
                <p className="text-[0.82rem] text-[color:var(--text-muted)]">
                    Sign up for a new account
                </p>
            </div>

            {/* ── Error Message ── */}
            {errorMessage && (
                <Message variant="error" className="mb-4">
                    {errorMessage}
                </Message>
            )}

            {/* ── Form ── */}
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">

                {/* Username */}
                <div className="flex flex-col">
                    <label className="text-[0.82rem] font-semibold mb-1.5 text-[color:var(--text-main)]" htmlFor="username">
                        Username
                    </label>
                    <Input
                        id="username"
                        type="text"
                        placeholder="choose a username"
                        autoComplete="username"
                        {...register("username")}
                    />
                    {errors.username && (
                        <p className="mt-1 text-[0.75rem] text-red-500">{errors.username.message}</p>
                    )}
                </div>

                {/* Email */}
                <div className="flex flex-col">
                    <label className="text-[0.82rem] font-semibold mb-1.5 text-[color:var(--text-main)]" htmlFor="email">
                        Email
                    </label>
                    <Input
                        id="email"
                        type="email"
                        placeholder="your email address"
                        autoComplete="email"
                        {...register("email")}
                    />
                    {errors.email && (
                        <p className="mt-1 text-[0.75rem] text-red-500">{errors.email.message}</p>
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
                            placeholder="choose a password"
                            autoComplete="new-password"
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

                {/* Department */}
                <div className="flex flex-col">
                    <label className="text-[0.82rem] font-semibold mb-1.5 text-[color:var(--text-main)]" htmlFor="department">
                        Department
                    </label>
                    <Controller
                        name="department"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                            <DropdownReverseList
                                options={DEPARTMENT_OPTIONS}
                                value={field.value}
                                onChange={field.onChange}
                                placeholder="Select a department..."
                                className="w-full"
                                triggerClassName="bg-[var(--surface)] !text-sm min-h-[42px]"
                            />
                        )}
                    />
                    {errors.department && (
                        <p className="mt-1 text-[0.75rem] text-red-500">{errors.department.message}</p>
                    )}
                </div>

                {/* Job Title */}
                <div className="flex flex-col">
                    <label className="text-[0.82rem] font-semibold mb-1.5 text-[color:var(--text-main)]" htmlFor="jobTitle">
                        Job Title
                    </label>
                    <Controller
                        name="jobTitle"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                            <DropdownReverseList
                                options={JOB_TITLE_OPTIONS}
                                value={field.value}
                                onChange={field.onChange}
                                placeholder="Select a job title..."
                                className="w-full"
                                triggerClassName="bg-[var(--surface)] !text-sm min-h-[42px]"
                            />
                        )}
                    />
                    {errors.jobTitle && (
                        <p className="mt-1 text-[0.75rem] text-red-500">{errors.jobTitle.message}</p>
                    )}
                </div>

                {/* Submit */}
                <Button
                    type="submit"
                    disabled={signUpMutation.isPending}
                    className="h-[46px] mt-3 font-semibold"
                >
                    {signUpMutation.isPending ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Signing up…
                        </>
                    ) : (
                        "Sign Up"
                    )}
                </Button>

                {/* Links */}
                <div className="text-center mt-2">
                    <p className="text-[0.82rem] text-[color:var(--text-muted)]">
                        Already have an account?{" "}
                        <Link
                            to="/login"
                            className="font-semibold no-underline transition-colors duration-200 hover:underline hover:brightness-110"
                            style={{ color: "var(--color-growth-green)" }}
                        >
                            Sign In
                        </Link>
                    </p>
                </div>
            </form>
        </div>
    );
};