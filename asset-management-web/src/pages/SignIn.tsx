import { SignInForm } from "../feature/auth/components/SignInForm";
import { Shield, BarChart3, Package } from "lucide-react";

export default function SignInPage() {
  return (
    <div className="flex min-h-screen text-[color:var(--text-main)] bg-[color:var(--bg)]">
      {/* ── Left Panel – Hero / Branding ── */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden bg-gradient-to-br from-[color:var(--color-charcoal)] via-[#1f242d] to-[color:var(--color-charcoal)] items-center justify-center">
        <div className="relative z-10 max-w-[480px] p-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-sm font-semibold tracking-wider text-[color:var(--color-growth-green)] bg-[rgba(209,236,81,0.1)] border border-[rgba(209,236,81,0.2)] mb-8">
            <Shield className="w-5 h-5" />
            Enterprise Asset Platform
          </div>

          <h2 className="text-5xl font-extrabold leading-tight text-white mb-5">
            TID Asset
            <br />
            <span className="bg-gradient-to-br from-[color:var(--color-growth-green)] to-[color:var(--color-aqua)] bg-clip-text text-transparent">Management</span>
          </h2>

          <p className="text-[1.05rem] leading-[1.7] text-gray-400 mb-10">
            Track, assign, and manage every asset in your organization with
            real‑time insights and granular permissions.
          </p>

          <div className="flex flex-col gap-5">
            <div className="flex items-start gap-3.5 bg-white/5 border border-white/10 rounded-xl p-4 transition-all hover:bg-white/10 hover:border-white/20">
              <div className="flex items-center justify-center w-10 h-10 rounded-[10px] bg-[rgba(209,236,81,0.12)] text-[color:var(--color-growth-green)] shrink-0">
                <Package className="w-5 h-5" />
              </div>
              <div>
                <p className="font-semibold text-[0.95rem] text-white mb-0.5">Asset Tracking</p>
                <p className="text-[0.82rem] text-gray-400 leading-relaxed">
                  Monitor all hardware & software across departments.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5 bg-white/5 border border-white/10 rounded-xl p-4 transition-all hover:bg-white/10 hover:border-white/20">
              <div className="flex items-center justify-center w-10 h-10 rounded-[10px] bg-[rgba(209,236,81,0.12)] text-[color:var(--color-growth-green)] shrink-0">
                <BarChart3 className="w-5 h-5" />
              </div>
              <div>
                <p className="font-semibold text-[0.95rem] text-white mb-0.5">
                  Real-time Reporting
                </p>
                <p className="text-[0.82rem] text-gray-400 leading-relaxed">
                  Procurement, assignments & issue dashboards at a glance.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* decorative blobs */}
        <div className="absolute rounded-full blur-[100px] opacity-35 pointer-events-none w-[360px] h-[360px] -top-20 -right-15 bg-[color:var(--color-aqua)]" />
        <div className="absolute rounded-full blur-[100px] opacity-35 pointer-events-none w-[300px] h-[300px] -bottom-15 -left-10 bg-[color:var(--color-growth-green)]" />
      </div>

      {/* ── Right Panel – Form ── */}
      <div className="flex items-center justify-center flex-1 p-8 lg:max-w-[560px] lg:p-12 bg-[color:var(--bg)]">
        <SignInForm />
      </div>
    </div>
  );
}
