import { useState, useRef, useEffect } from "react";
import { api } from "../../lib/axios";
import { useAuthStore } from "../../store/authStore";
import { useNavigate } from "react-router-dom";
import {
  Bell,
  User,
  Moon,
} from "lucide-react";
import { ThemeToggle } from "../ui/ThemeToggle";
import ProfileModal from "./user/ProfileModal";

export default function Header() {
  const { user, clearAuth } = useAuthStore();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
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
          <button className="p-2 rounded-full hover:bg-[var(--surface-hover)] transition-colors text-[var(--text-muted)] hover:text-[var(--text-main)]">
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
                  src={user.image}
                  alt="User avatar"
                  className="w-8 h-8 rounded-full object-cover ring-2 ring-[var(--color-growth-green)]"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-[var(--surface-hover)] flex items-center justify-center ring-2 ring-[var(--color-growth-green)]">
                  <User size={16} className="text-[var(--text-muted)]" />
                </div>
              )}
            </button>

            {/* Dropdown Menu */}
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-[var(--surface)] border border-[var(--border-color)] shadow-lg rounded-xl z-50 overflow-hidden divide-y divide-[var(--border-color)] transform origin-top-right transition-all">
                {/* User Info */}
                <div className="p-4 flex items-center justify-between bg-[var(--surface-hover)]">
                  <div className="flex items-center space-x-3 truncate">
                    {user?.image ? (
                      <img
                        src={user.image}
                        alt="User avatar"
                        className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-[var(--surface)] border border-[var(--border-color)] flex items-center justify-center flex-shrink-0">
                        <User size={20} className="text-[var(--text-muted)]" />
                      </div>
                    )}
                    <div className="truncate">
                      <p className="text-sm font-semibold text-[var(--text-main)] truncate">
                        {user?.username || "Guest User"}
                      </p>
                      <p className="text-xs text-[var(--text-muted)] truncate">
                        {user?.email || "No email"}
                      </p>
                    </div>
                  </div>
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-[var(--color-growth-green)] text-white opacity-90">
                    Pro
                  </span>
                </div>

                <div className="py-1">
                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      setProfileModalOpen(true);
                    }}
                    className="w-full text-left px-4 py-3 text-sm text-[var(--text-main)] hover:bg-[var(--surface-hover)] flex items-center space-x-3 transition-colors"
                  >
                    <User size={16} className="text-[var(--text-muted)]" />
                    <span>My Profile</span>
                  </button>
                </div>

                <div className="py-1">
                  <div className="px-4 py-3 flex items-center justify-between hover:bg-[var(--surface-hover)] transition-colors">
                    <div className="flex items-center space-x-3 text-sm text-[var(--text-main)]">
                      <Moon size={16} className="text-[var(--text-muted)]" />
                      <span>Dark Mode</span>
                    </div>
                    {/* The ThemeToggle component can render a switch */}
                    <div onClick={(e) => e.stopPropagation()}>
                      <ThemeToggle />
                    </div>
                  </div>
                </div>

                <div className="p-2">
                  <button
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className="w-full text-left px-4 py-2.5 text-sm text-[var(--text-main)] border border-[var(--border-color)] rounded-lg hover:bg-[var(--surface-hover)] flex justify-center items-center font-medium transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {isLoggingOut ? "Logging out..." : "Logout"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      <ProfileModal
        isOpen={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
      />
    </>
  );
}
