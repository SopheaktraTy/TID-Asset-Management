import { useState, useRef, useEffect } from "react";
import { useAuthStore } from "../../store/authStore";
import { Link, useNavigate } from "react-router-dom";
import {
  Bell,
  ChevronRight,
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

  const handleLogout = () => {
    clearAuth();
    navigate("/login");
  };

  return (
    <>
      <header className="h-16 flex items-center justify-between px-6 bg-white dark:bg-gray-800 shadow-sm transition-colors border-b border-gray-200 dark:border-gray-700">
        {/* Left Side: Breadcrumb */}
        <div className="flex items-center space-x-2 text-sm text-gray-700 dark:text-gray-300">
          <Link to="/" className="hover:text-green-600 dark:hover:text-green-400 transition-colors font-medium">
            My Account
          </Link>
          <ChevronRight size={14} className="text-gray-400" />
          <span className="font-medium text-gray-500 dark:text-gray-400 cursor-default">Account</span>
          <ChevronRight size={14} className="text-gray-400" />
          <span className="font-semibold text-gray-900 dark:text-white cursor-default">Get Started</span>
        </div>

        {/* Right Side: Notification and User Profile */}
        <div className="flex items-center space-x-4">
          <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-500 dark:text-gray-400">
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
                  className="w-8 h-8 rounded-full object-cover ring-2 ring-green-500"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center ring-2 ring-green-500">
                  <User size={16} className="text-gray-500 dark:text-gray-300" />
                </div>
              )}
            </button>

            {/* Dropdown Menu */}
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-lg rounded-xl z-50 overflow-hidden divide-y divide-gray-100 dark:divide-gray-700 transform origin-top-right transition-all">
                {/* User Info */}
                <div className="p-4 flex items-center justify-between bg-gray-50/50 dark:bg-gray-900/50">
                  <div className="flex items-center space-x-3 truncate">
                    {user?.image ? (
                      <img
                        src={user.image}
                        alt="User avatar"
                        className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 flex items-center justify-center flex-shrink-0">
                        <User size={20} className="text-gray-500 dark:text-gray-400" />
                      </div>
                    )}
                    <div className="truncate">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                        {user?.username || "Guest User"}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {user?.email || "No email"}
                      </p>
                    </div>
                  </div>
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300">
                    Pro
                  </span>
                </div>

                <div className="py-1">
                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      setProfileModalOpen(true);
                    }}
                    className="w-full text-left px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 flex items-center space-x-3 transition-colors"
                  >
                    <User size={16} className="text-gray-400" />
                    <span>My Profile</span>
                  </button>
                </div>

                <div className="py-1">
                  <div className="px-4 py-3 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <div className="flex items-center space-x-3 text-sm text-gray-700 dark:text-gray-300">
                      <Moon size={16} className="text-gray-400" />
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
                    className="w-full text-left px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 flex justify-center items-center font-medium transition-colors"
                  >
                    Logout
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
