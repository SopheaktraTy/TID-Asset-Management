import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useInitializeAuth } from "./hooks/useInitializeAuth";

import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import UserManagement from "./pages/UserManagement";
import UserDetailsPage from "./pages/UserDetails";
import AssetManagement from "./pages/AssetManagement";
import AssetDetailsPage from "./pages/AssetDetails";
import EmployeeManagement from "./pages/EmployeeManagement";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/layout/ProtectedRoute";
import AppLayout from "./components/layout/AppLayout";
import LoadingScreen from "./components/ui/LoadingScreen";

/**
 * AppRoutes wraps the application. 
 * Resolves authentication silently on load (useInitializeAuth) before rendering routes.
 */
function AppRoutes() {
  const isInitializing = useInitializeAuth();

  // Block the UI from rendering (and ProtectedRoute from redirecting) while we
  // silently check if the browser has a valid session cookie.
  if (isInitializing) {
    return <LoadingScreen />;
  }

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* Protected routes — role-gated, wrapped in shared AppLayout (Sidebar) */}
      <Route element={<ProtectedRoute allowedRoles={["SUPER_ADMIN", "ADMIN"]} />}>
        <Route element={<AppLayout />}>
          <Route path="/users-management" element={<UserManagement />} />
          <Route path="/user-detail/:id" element={<UserDetailsPage />} />
          <Route path="/assets-management" element={<AssetManagement />} />
          <Route path="/asset-detail/:id" element={<AssetDetailsPage />} />
          <Route path="/employee-management" element={<EmployeeManagement />} />
        </Route>
      </Route>

      {/* Default route */}
      <Route path="/" element={<SignIn />} />

      {/* 404 catch-all */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}