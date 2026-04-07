import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { api } from "../lib/axios";

export function useHeader() {
  const { user, clearAuth } = useAuthStore();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    try {
      await api.post("/api/auth/logout");
    } catch {
      // Ignore failure to logout on server, clear client state anyway
    } finally {
      clearAuth();
      navigate("/login");
    }
  };

  return {
    user,
    dropdownOpen,
    setDropdownOpen,
    isProfileModalOpen,
    setIsProfileModalOpen,
    isLoggingOut,
    handleLogout,
  };
}
