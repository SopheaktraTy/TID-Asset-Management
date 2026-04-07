import { useState, useRef, useEffect } from "react";
import { api } from "../../lib/axios";
import { useAuthStore } from "../../store/authStore";
import { useNavigate } from "react-router-dom";
import {
  Bell,
  User,
  Moon,
} from "lucide-react";
import { useTheme } from "../../hooks/useTheme";
import { ProfileWithViewAndEditModal } from "./user/ProfileWithViewAndEditModal";
import { getSafeImageUrl } from "../../utils/image";

export default function Header() {
  const { user, clearAuth } = useAuthStore();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    try {
      // Tell the backend to delete this session's refresh token and expire cookies
      await api.post("/api/auth/logout");
    } catch {
      // Even if the request fails (e.g. network issue), still clear the client state
    } finally {
      clearAuth();
      navigate("/login");
    }
  };

  return (
    <>
      <header className="h-16 flex items-center justify-end px-6 bg-[var(--bg)] shadow-sm transition-colors border-b border-[var(--border-color)]">
        {/* Right Side: Notification and User Profile */}
        <div className="flex items-center space-x-4">
          <button className=" rounded-full hover:bg-[var(--surface-hover)] transition-colors text-[var(--text-muted)] hover:text-[var(--text-main)]">
            <Bell size={20} />
          </button>

          {/* User Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center space-x-2 p-1 rounded-full overflow-hidden hover:opacity-80 transition-opacity"
            >
              {user?.image ? (
                <img
                  src={getSafeImageUrl(user.image)}
                  alt="User avatar"
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-[var(--surface-hover)] border border-[var(--border-color)] flex items-center justify-center">
                  <User size={16} className="text-[var(--text-muted)]" />
                </div>
              )}
            </button>

            {/* Dropdown Menu */}
            {dropdownOpen && (
              <div className="absolute right-0 mt-3 w-64 bg-[var(--surface)] dark:bg-[var(--bg)] border border-[var(--border-color)] shadow-xl rounded-xl z-50 overflow-hidden divide-y divide-[var(--border-color)] transform origin-top-right transition-all">
                {/* User Info */}
                <div className="py-4 px-4 flex items-center">
                  <div className="flex items-center space-x-3 truncate">
                    <div className="relative flex-shrink-0">
                      {user?.image ? (
                        <img
                          src={getSafeImageUrl(user.image)}
                          alt="User avatar"
                          className="w-10 h-10 rounded-full object-cover ring-1 ring-[var(--border-color)]"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-[var(--surface-hover)] border border-[var(--border-color)] flex items-center justify-center">
                          <User size={20} className="text-[var(--text-muted)]" />
                        </div>
                      )}
                    </div>
                    <div className="truncate flex flex-col justify-center">
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="text-sm font-semibold text-[var(--text-main)] truncate">
                          {user?.username || "Guest User"}
                        </p>
                        {user?.role && (
                          <span className="px-1.5 py-0.5 bg-[var(--surface-hover)] border border-[var(--border-color)] text-[9px] font-bold text-[var(--text-muted)] rounded uppercase tracking-wider whitespace-nowrap">
                            {user.role.replace(/_/g, ' ')}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[var(--text-muted)] truncate">
                        {user?.email || "No email"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-2 flex flex-col gap-0.5">
                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      setIsProfileModalOpen(true);
                    }}
                    className="w-full text-left px-3 py-2 text-sm text-[var(--text-main)] hover:bg-[var(--surface-hover)] rounded-lg flex items-center space-x-3 transition-colors"
                  >
                    <User size={18} className="text-[var(--text-main)]" />
                    <span className="font-normal">My Profile</span>
                  </button>

                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleTheme();
                    }}
                    className="px-3 py-2 flex items-center justify-between hover:bg-[var(--surface-hover)] rounded-lg transition-colors cursor-pointer"
                  >
                    <div className="flex items-center space-x-3 text-sm text-[var(--text-main)]">
                      <Moon size={18} className="text-[var(--text-main)]" />
                      <span className="font-normal">Dark Mode</span>
                    </div>
                    <div className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${theme === 'dark' ? 'bg-[var(--color-growth-green)]' : 'bg-[var(--border-color)]'}`}>
                      <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-[var(--surface)] shadow ring-0 transition duration-200 ease-in-out ${theme === 'dark' ? 'translate-x-4' : 'translate-x-0'}`} />
                    </div>
                  </div>
                </div>

                <div className="p-3">
                  <button
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className="w-full px-4 py-2 text-sm text-[var(--text-main)] border border-[var(--border-color)] rounded-lg hover:bg-[var(--surface-hover)] flex justify-center items-center transition-colors disabled:opacity-60 disabled:cursor-not-allowed shadow-sm"
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
