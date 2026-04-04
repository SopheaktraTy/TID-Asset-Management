import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import type { RoleEnum } from "../../types/auth.types";

interface ProtectedRouteProps {
  /** If provided, only users whose role is in this list may enter. */
  allowedRoles?: RoleEnum[];
}

/**
 * 🛡️ ProtectedRoute: Gates access using authStore.
 * - Redirects to /login if unauthenticated.
 * - Optionally checks allowedRoles.
 * Relies on useInitializeAuth completing first.
 */
export default function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const { token, user } = useAuthStore();

  // ① Not authenticated
  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  // ② Authenticated but missing required role
  if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to="/login" replace />;
  }

  // ③ All checks passed — render child routes
  return <Outlet />;
}
