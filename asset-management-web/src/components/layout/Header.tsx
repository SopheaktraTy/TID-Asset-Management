import { useHeader } from "../../hooks/useHeader";
import { useOnClickOutside } from "../../hooks/useOnClickOutside";
import { useRef } from "react";
import {
  Bell,
  User,
  Moon,
  Menu,
} from "lucide-react";
import { useTheme } from "../../hooks/useTheme";
import { ProfileWithViewAndEditModal } from "./user/ProfileWithViewAndEditModal";
import { getSafeImageUrl } from "../../utils/image";

export default function Header({
  collapsed,
  isMobile
}: {
  collapsed: boolean;
  isMobile: boolean;
}) {
  const {
    user,
    dropdownOpen,
    setDropdownOpen,
    isProfileModalOpen,
    setIsProfileModalOpen,
    isLoggingOut,
    handleLogout,
  } = useHeader();

  const { theme, toggleTheme } = useTheme();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useOnClickOutside(dropdownRef, () => setDropdownOpen(false));

  const toggleMobileMenu = () => {
    window.dispatchEvent(new CustomEvent("toggle-mobile-menu"));
  };

  return (
    <>
      <header
        className="h-20 flex items-center justify-between px-4 lg:px-6 bg-[var(--bg)] shadow-sm transition-all duration-300 fixed top-0 right-0 z-40"
        style={{ left: isMobile ? "0" : (collapsed ? "80px" : "260px") }}
      >
        {/* ── Left: Mobile Menu Toggle ── */}
        {isMobile && (
          <button
            onClick={toggleMobileMenu}
            className="p-2 mr-2 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--surface-hover)] transition-colors"
          >
            <Menu size={24} />
          </button>
        )}

        <div className="flex-1" />

        {/* ── Right: Notification + Avatar ── */}
        <div className="flex items-center space-x-4 min-w-[160px] justify-end">
          <button className=" rounded-full hover:bg-[var(--surface-hover)] transition-colors text-[var(--text-muted)] hover:text-[var(--text-main)]">
            <Bell size={20} />
          </button>

          {/* User Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center space-x-2 rounded-full overflow-hidden hover:opacity-80 transition-opacity"
            >
              {user?.image ? (
                <img
                  src={getSafeImageUrl(user.image)}
                  alt="User avatar"
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-[var(--surface-hover)] flex items-center justify-center">
                  <User size={16} className="text-[var(--text-muted)]" />
                </div>
              )}
            </button>

            {/* Dropdown Menu */}
            {dropdownOpen && (
              <div className="absolute right-0 mt-3 w-60 bg-[var(--surface)] dark:bg-[var(--bg)] border border-[var(--border-color)] shadow-xl rounded-xl z-50 overflow-hidden divide-y divide-[var(--border-color)] transform origin-top-right transition-all">
                {/* User Info */}
                <div className="py-3 px-3.5 flex items-center">
                  <div className="flex items-center space-x-3 truncate">
                    <div className="relative flex-shrink-0">
                      {user?.image ? (
                        <img
                          src={getSafeImageUrl(user.image)}
                          alt="User avatar"
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-[var(--surface-hover)] flex items-center justify-center">
                          <User size={18} className="text-[var(--text-muted)]" />
                        </div>
                      )}
                    </div>
                    <div className="truncate flex flex-col justify-center">
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="text-xs font-bold text-[var(--text-main)] truncate leading-none">
                          {user?.username || "Guest User"}
                        </p>
                        {user?.role && (
                          <span className="px-1.5 py-0.5 bg-[var(--surface-hover)] border border-[var(--border-color)] text-[8px] font-black text-[var(--text-muted)] rounded uppercase tracking-tight whitespace-nowrap">
                            {user.role.replace(/_/g, ' ')}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] font-medium text-[var(--text-muted)] truncate">
                        {user?.email || "No email"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-1.5 flex flex-col gap-0.5">
                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      setIsProfileModalOpen(true);
                    }}
                    className="w-full text-left px-3 py-1.5 text-[13px] text-[var(--text-main)] hover:bg-[var(--surface-hover)] rounded-lg flex items-center space-x-3 transition-colors"
                  >
                    <User size={16} className="text-[var(--text-main)]" />
                    <span className="font-medium">My Profile</span>
                  </button>

                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleTheme();
                    }}
                    className="px-3 py-1.5 flex items-center justify-between hover:bg-[var(--surface-hover)] rounded-lg transition-colors cursor-pointer"
                  >
                    <div className="flex items-center space-x-3 text-[13px] text-[var(--text-main)]">
                      <Moon size={16} className="text-[var(--text-main)]" />
                      <span className="font-medium">Dark Mode</span>
                    </div>
                    <div className={`relative inline-flex h-4.5 w-8 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${theme === 'dark' ? 'bg-[var(--color-growth-green)]' : 'bg-[var(--border-color)]'}`}>
                      <span className={`pointer-events-none inline-block h-3.5 w-3.5 transform rounded-full bg-[var(--surface)] shadow ring-0 transition duration-200 ease-in-out ${theme === 'dark' ? 'translate-x-3.5' : 'translate-x-0'}`} />
                    </div>
                  </div>
                </div>

                <div className="p-3">
                  <button
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className="w-full px-4 py-1.5 text-[13px] font-bold text-[var(--text-main)] border border-[var(--border-color)] rounded-lg hover:bg-[var(--surface-hover)] flex justify-center items-center transition-colors disabled:opacity-60 disabled:cursor-not-allowed shadow-sm"
                  >
                    {isLoggingOut ? "Logging out..." : "Logout"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>
      <ProfileWithViewAndEditModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />
    </>
  );
}
