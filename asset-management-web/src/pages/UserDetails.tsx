import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, User as UserIcon } from "lucide-react";
import Header from "../components/layout/Header";

import { getUserByIdApi } from "../services/userManagement.service";
import type { UserDto } from "../types/user.types";
import EditUserModal from "../components/layout/user/EditUserModal";
import DeleteUserModal from "../components/layout/user/DeleteUserModal";
import ResetPasswordModal from "../components/layout/user/ResetPasswordModal";

function toPascalCase(str: string | null | undefined) {
  if (!str) return "–";
  return str
    .split(/[_\s]+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

export default function UserDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState<UserDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorDetails, setErrorDetails] = useState<string | null>(null);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [deleting] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        if (!id) throw new Error("No user ID provided.");
        const data = await getUserByIdApi(Number(id));
        // Ensure status property exists for the UI
        const isActiveValue = data.is_active ?? (data as any).isActive;
        data.status = data.status || (isActiveValue === false ? "INACTIVE" : "ACTIVE");
        setUser(data);
      } catch (err: any) {
        setErrorDetails(err?.response?.data?.message || err.message || "Failed to load user.");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  // Handlers
  const handleBack = () => navigate("/users-management");

  const handleDeleteSuccess = () => {
    navigate("/users-management");
  };

  const isUserActive = user?.is_active ?? (user as any)?.isActive ?? (user?.status === 'ACTIVE');

  if (loading) return <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center text-[var(--text-main)]">Loading...</div>;

  if (errorDetails || !user) return (
    <div className="min-h-screen bg-[var(--bg)] flex flex-col items-center justify-center text-[var(--text-main)] gap-4">
      <h2 className="text-xl font-bold text-red-500">Error Loading User</h2>
      <p className="text-[var(--text-muted)]">{errorDetails}</p>
      <button onClick={handleBack} className="px-4 py-2 border border-[var(--border-color)] rounded hover:bg-[var(--surface-hover)] transition-colors">
        Go Back
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text-main)]">
      <Header />
      <main className="max-w-7xl mx-auto px-6 py-8">

        {/* Top Header & Breadcrumbs */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-[var(--text-main)] mb-2">User</h1>
            <div className="flex items-center gap-2 text-sm text-[var(--text-muted)]">
              <span onClick={() => navigate("/")} className="hover:text-[var(--text-main)] cursor-pointer transition-colors">Home</span>
              <span>›</span>
              <span onClick={() => navigate("/users-management")} className="hover:text-[var(--text-main)] cursor-pointer transition-colors">User Management</span>
              <span>›</span>
              <span className="text-[var(--text-main)]">Users</span>
            </div>
          </div>

          <button
            onClick={handleBack}
            className="flex items-center gap-2 px-3 py-1.5 bg-transparent border border-[var(--border-color)] text-sm text-[var(--text-main)] rounded-md hover:bg-[var(--surface-hover)] transition-colors"
          >
            <ArrowLeft size={16} />
            Back to users
          </button>
        </div>

        {/* Profile Header Summary */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 rounded-full bg-[#12131a] flex items-center justify-center text-xl font-bold border border-[#292a33] uppercase">
            {user.username ? user.username.substring(0, 2) : "U"}
          </div>
          <div className="flex flex-col">
            <h2 className="text-xl font-bold">{user.username}</h2>
            <span className="text-[var(--text-muted)] text-sm">{user.email}</span>
            <div className="mt-1 px-3 py-1 bg-[#12131a] border border-[#292a33] text-xs text-gray-300 rounded-md inline-block w-max">
              User ID: {user.id}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-6 border-b border-[var(--border-color)] mb-6">
          <button className="flex items-center gap-2 pb-3 border-b-2 border-blue-500 text-blue-500 font-medium text-xs">
            <UserIcon size={16} />
            Profile
          </button>
        </div>

        {/* Profile Details Card */}
        <div className="bg-[var(--bg)] border border-[var(--border-color)] rounded-xl p-6 mb-8 text-xs">
          <div className="flex flex-col gap-4">

            <div className="grid grid-cols-[150px_1fr] items-center">
              <span className="text-[var(--text-muted)]">Full name:</span>
              <span className="text-[var(--text-main)] font-medium">{user.username}</span>
            </div>

            <div className="grid grid-cols-[150px_1fr] items-center">
              <span className="text-[var(--text-muted)]">Email address:</span>
              <div className="flex items-center gap-3">
                <span className="text-[var(--text-main)] font-medium">{user.email}</span>
                <span className={`text-[10px] font-medium px-2 py-0.5 rounded border ${isUserActive
                  ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:text-emerald-400'
                  : 'bg-orange-500/10 text-orange-600 border-orange-500/20 dark:text-orange-400'
                  }`}>
                  {isUserActive ? 'Verified' : 'Not verified'}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-[150px_1fr] items-center">
              <span className="text-[var(--text-muted)]">Role:</span>
              <span className="text-[var(--text-main)] font-medium">
                {user.role === 'SUPER_ADMIN' ? 'Super Admin' : user.role === 'ADMIN' ? 'Admin' : 'Site Manager'}
              </span>
            </div>

            <div className="grid grid-cols-[150px_1fr] items-center">
              <span className="text-[var(--text-muted)]">Status:</span>
              <div className="flex items-center gap-2">
                <div className={`w-1.5 h-1.5 rounded-full ${isUserActive ? 'bg-emerald-500' : 'bg-gray-400 dark:bg-gray-500'}`}></div>
                <span className={`${isUserActive ? 'text-emerald-600 dark:text-emerald-400' : 'text-[var(--text-muted)]'} font-medium`}>
                  {isUserActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-[150px_1fr] items-center">
              <span className="text-[var(--text-muted)]">Department:</span>
              <span className="text-[var(--text-main)] font-medium">{toPascalCase(user.department)}</span>
            </div>

            <div className="grid grid-cols-[150px_1fr] items-center">
              <span className="text-[var(--text-muted)]">Created At:</span>
              <span className="text-[var(--text-main)] font-medium">{(user.created_at || (user as any).createdAt) ? new Date(user.created_at || (user as any).createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" }) : "–"}</span>
            </div>

            <div className="grid grid-cols-[150px_1fr] items-center">
              <span className="text-[var(--text-muted)]">Updated At:</span>
              <span className="text-[var(--text-main)] font-medium">{(user.updated_at || (user as any).updatedAt) ? new Date(user.updated_at || (user as any).updatedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" }) : "–"}</span>
            </div>

            <div className="mt-4">
              <button
                onClick={() => setIsEditModalOpen(true)}
                className="px-4 py-2 bg-transparent border border-[var(--border-color)] text-[var(--text-main)] rounded-md hover:bg-[var(--surface-hover)] transition-colors font-medium text-xs"
              >
                Edit user details
              </button>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="mb-4 text-xs">
          <h3 className="text-red-500 font-bold mb-4 text-sm px-1">Danger Zone</h3>
          <div className="bg-[var(--bg)] border border-red-500/20 rounded-xl overflow-hidden shadow-sm">

            {/* Reset Password Card */}
            <div className="p-6 border-b border-[var(--border-color)] hover:bg-orange-50/10 transition-colors">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex flex-col gap-1">
                  <h4 className="text-[var(--text-main)] font-bold text-sm">Force Password Reset</h4>
                  <p className="text-[var(--text-muted)] text-[11px] max-w-lg ">
                    Instantly update this user's password. They will be required to use the new credentials upon their next sign-in.
                  </p>
                </div>
                <button
                  onClick={() => setIsResetModalOpen(true)}
                  className="shrink-0 px-4 py-2 bg-transparent border border-orange-500/30 text-orange-600 hover:bg-orange-500/10 rounded-md transition-colors font-bold text-[11px] shadow-sm active:scale-95 uppercase tracking-wide"
                >
                  Reset credentials
                </button>
              </div>
            </div>

            {/* Delete Account Card */}
            <div className="p-6 hover:bg-red-50/10 transition-colors">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex flex-col gap-1">
                  <h4 className="text-[var(--text-main)] font-bold text-sm">Permanently delete account</h4>
                  <p className="text-[var(--text-muted)] text-[11px] max-w-lg ">
                    This will permanently remove the user and all associated permissions. This action is irreversible once performed.
                  </p>
                </div>
                <button
                  onClick={() => setIsDeleteModalOpen(true)}
                  disabled={deleting}
                  className="shrink-0 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-900 text-white border-0 rounded-md transition-all font-bold text-[11px] shadow-lg shadow-red-600/20 active:scale-95 uppercase tracking-wide"
                >
                  {deleting ? "Deleting..." : "Delete user account"}
                </button>
              </div>
            </div>

          </div>
        </div>

      </main>

      {/* Edit Modal connection */}
      <EditUserModal
        isOpen={isEditModalOpen}
        user={user}
        onClose={() => setIsEditModalOpen(false)}
        onUpdated={(updated: any) => {
          // Normalize status field after update to ensure UI renders properly
          updated.status = updated.status || (updated.is_active === false ? 'INACTIVE' : 'ACTIVE');
          setUser(updated);
          setIsEditModalOpen(false);
        }}
      />

      <DeleteUserModal
        isOpen={isDeleteModalOpen}
        user={user}
        onClose={() => setIsDeleteModalOpen(false)}
        onDeleted={handleDeleteSuccess}
      />

      <ResetPasswordModal
        isOpen={isResetModalOpen}
        user={user}
        onClose={() => setIsResetModalOpen(false)}
        onSuccess={(updated: any) => {
          // Re-normalize status and update local state
          updated.status = updated.status || (updated.is_active === false ? 'INACTIVE' : 'ACTIVE');
          setUser(updated);
          setIsResetModalOpen(false);
        }}
      />
    </div>
  );
}
