import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import type { RoleEnum } from "../../types/auth.types";

interface ProtectedRouteProps {
  allowedRoles?: RoleEnum[];
}

export default function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const { user, token } = useAuthStore();

  // 1. If no token or user, redirect to login
  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  // 2. If roles are specified, check if the user has one of the allowed roles
  if (allowedRoles && allowedRoles.length > 0) {
    if (!allowedRoles.includes(user.role)) {
      // You can redirect to an "Unauthorized" page or the dashboard here
      return <Navigate to="/" replace />;
    }
  }

  // 3. Render the child routes if authorized
  return <Outlet />;
}
