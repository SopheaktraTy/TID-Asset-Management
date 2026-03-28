import { SignInForm } from "../feature/auth/components/SignInForm";
import { ThemeToggle } from "../components/ui/ThemeToggle";

export default function SignInPage() {

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-[color:var(--bg)] transition-colors duration-300">
      {/* ── Background decorative blobs ── */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 -left-32 h-[420px] w-[420px] rounded-full bg-[color:var(--color-aqua)] opacity-10 blur-[120px]" />
        <div className="absolute -bottom-32 -right-32 h-[420px] w-[420px] rounded-full bg-[color:var(--color-growth-green)] opacity-10 blur-[120px]" />
      </div>

      {/* ── Dark / Light toggle — fixed to viewport top-right ── */}
      <ThemeToggle className="fixed top-4 right-4 z-50" />

      {/* ── Centered Form ── */}
      <div className="relative z-10 w-full px-4 py-12 flex justify-center">
        <SignInForm />
      </div>
    </div>
  );
}
