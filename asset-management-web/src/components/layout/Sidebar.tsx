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
export default function Sidebar() {
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
        `}
      >
        {/* ── Toggle Button (Floating on the border) ── */}
        <button
          onClick={toggle}
          className={`
            absolute -right-3.5 top-[23px] z-50
            w-7 h-7 flex items-center justify-center
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
        <div className={`
          flex items-center h-[70px] shrink-0 transition-all duration-300
          ${collapsed ? "justify-center px-0" : "px-8"}
        `}>
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
              {/* Section label */}
              <p className={`
                px-8 mb-1.5 text-[12px] uppercase text-[var(--text-muted)] opacity-50 select-none
                transition-all duration-300 overflow-hidden whitespace-nowrap
                ${collapsed ? "w-0 opacity-0 invisible" : "w-full"}
              `}>
                {section.label}
              </p>

              {collapsed && (
                <div className="mx-auto w-6 border-t border-[var(--border-color)] mb-3 opacity-50" />
              )}

              <ul className="space-y-0.5 px-4">
                {section.items.map(({ to, icon: Icon, label }) => (
                  <li key={to}>
                    <NavLink
                      to={to}
                      title={collapsed ? label : undefined}
                      className={({ isActive }) =>
                        `flex items-center rounded-lg transition-all duration-300 group
                        ${collapsed ? "justify-center px-0 py-3 mx-1" : "px-5 py-2.5"}
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
                            ml-3.5 text-[13.5px] font-semibold leading-none
                            transition-all duration-300 overflow-hidden whitespace-nowrap
                            ${collapsed ? "w-0 opacity-0 invisible ml-0" : "w-32 opacity-100 visible"}
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
