import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  HardDrive,
  Users,
  Contact,
  PanelLeftClose,
} from "lucide-react";
import { useSidebar } from "../../hooks/useSidebar";
import { useTheme } from "../../hooks/useTheme";
import { ProfileWithViewAndEditModal } from "./user/ProfileWithViewAndEditModal";

// ── Baker Tilly brand assets ──────────────────────────────────────────────────
import symbolWhite from "../../assets/Logo_Bakertilly/Baker Tilly Sidebar Growth Symbol White.png";
import symbolCharcoal from "../../assets/Logo_Bakertilly/Baker Tilly Sidebar Growth Symbol Charcoal.png";
import logoWhite from "../../assets/Logo_Bakertilly/Baker Tilly Sidebar Logo_White.png";
import logoCharcoal from "../../assets/Logo_Bakertilly/Baker Tilly Sidebar Logo_Charcoal.png";

// ── Navigation structure ──────────────────────────────────────────────────────
const NAV_SECTIONS = [
  {
    label: "Management",
    items: [
      { to: "/assets-management", icon: HardDrive, label: "Assets" },
      { to: "/users-management", icon: Users, label: "Users" },
      { to: "/employee-management", icon: Contact, label: "Employees" },
    ],
  },
];

// ── Component ─────────────────────────────────────────────────────────────────
export default function Sidebar({
  isMobileOpen,
  setIsMobileOpen
}: {
  isMobileOpen?: boolean;
  setIsMobileOpen?: (open: boolean) => void
}) {
  const [collapsed, setCollapsed] = useState(false);

  const {
    isProfileModalOpen,
    setIsProfileModalOpen,
  } = useSidebar();

  const { theme } = useTheme();

  // Notify AppLayout of width change
  const toggle = () => {
    const next = !collapsed;
    setCollapsed(next);
    window.dispatchEvent(
      new CustomEvent("sidebar-toggle", { detail: { collapsed: next } })
    );
  };

  return (
    <>
      <aside
        className={`
          fixed top-0 left-0 h-screen z-50 flex flex-col
          bg-[var(--bg)] border-r border-[var(--border-color)]
          transition-all duration-300 ease-in-out
          ${collapsed ? "w-[80px]" : "w-[260px]"}
          ${isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* ── Toggle Button (Floating on the border) ── */}
        <button
          onClick={toggle}
          className={`
            absolute -right-3.5 top-[23px] z-50
            w-7 h-7 hidden lg:flex items-center justify-center
            bg-[var(--bg)] border border-[var(--border-color)]
            rounded-lg text-[var(--text-muted)] hover:text-[var(--text-main)]
            shadow-sm transition-all duration-300 group
            ${collapsed ? "rotate-180" : ""}
          `}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <PanelLeftClose size={14} className="group-hover:scale-110 transition-transform" />
        </button>
        {/* ── Brand header ─────────────────────────────────────────────────── */}
        <div className="flex items-center  shrink-0 pt-[26px] pb-[15px] pl-[26px]">
          <div className="flex items-center gap-2 overflow-hidden">
            {/* Symbol — always visible */}
            <img
              src={theme === "dark" ? symbolWhite : symbolCharcoal}
              alt="Baker Tilly Symbol"
              className="w-7 h-7 object-contain shrink-0"
            />

            {/* Logo Text — slides in/out */}
            <div className={`
              transition-all duration-300 ease-in-out overflow-hidden whitespace-nowrap
              ${collapsed ? "w-0 opacity-0 invisible" : "w-32 opacity-100 visible"}
            `}>
              <img
                src={theme === "dark" ? logoWhite : logoCharcoal}
                alt="Baker Tilly Logo"
                className="h-7 object-contain"
              />
            </div>
          </div>
        </div>



        {/* ── Navigation ───────────────────────────────────────────────────── */}
        <nav className="flex-1 overflow-y-auto custom-scrollbar">
          {NAV_SECTIONS.map((section) => (
            <div key={section.label} className="mb-2">
              <div className="h-6 relative flex items-center mb-1">
                {/* Expanded state: Label + Line */}
                <div className={`
                  absolute inset-0 flex items-center gap-3 px-6 transition-all duration-300
                  ${collapsed ? "opacity-0 invisible -translate-x-2" : "opacity-100 visible translate-x-0"}
                `}>
                  <p className="text-[10.5px] uppercase font-bold text-[var(--text-muted)] opacity-50 select-none">
                    {section.label}
                  </p>
                  <div className="flex-1 border-t border-[var(--border-color)] mt-[1px]" />
                </div>

                {/* Collapsed state: Small centered line */}
                <div className={`
                  absolute inset-0 flex items-center justify-center transition-all duration-300
                  ${collapsed ? "opacity-100 visible scale-x-100" : "opacity-0 invisible scale-x-0"}
                `}>
                  <div className="w-6 border-t border-[var(--border-color)]" />
                </div>
              </div>

              <ul className="space-y-0.5">
                {section.items.map(({ to, icon: Icon, label }) => (
                  <li key={to}>
                    <NavLink
                      to={to}
                      onClick={() => setIsMobileOpen?.(false)}
                      title={collapsed ? label : undefined}
                      className={({ isActive }) =>
                        `flex items-center rounded-lg transition-colors group
                        py-2.5 mx-4 px-3.5
                        ${isActive
                          ? "bg-[var(--color-growth-green)]/10 text-[var(--color-growth-green)]"
                          : "text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--surface-hover)]"
                        }`
                      }
                    >
                      {({ isActive }) => (
                        <>
                          <Icon
                            size={18}
                            className={`shrink-0 transition-colors ${isActive
                              ? "text-[var(--color-growth-green)]"
                              : "text-[var(--text-muted)] group-hover:text-[var(--text-main)]"
                              }`}
                          />
                          <span className={`
                            text-[13.5px] font-semibold leading-none
                            transition-all duration-300 overflow-hidden whitespace-nowrap
                            ${collapsed ? "w-0 opacity-0 invisible ml-0" : "w-32 opacity-100 visible ml-3.5"}
                          `}>
                            {label}
                          </span>
                        </>
                      )}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </aside>

      <ProfileWithViewAndEditModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />
    </>
  );
}
