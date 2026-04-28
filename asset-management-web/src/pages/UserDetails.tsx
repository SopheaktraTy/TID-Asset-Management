import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import EditUserModal from "../components/layout/user/EditUserModal";
import DeleteUserModal from "../components/layout/user/DeleteUserModal";
import ResetPasswordModal from "../components/layout/user/ResetPasswordModal";
import { useUserDetails } from "../hooks/useUserDetails";
import { UserFullDetails } from "../components/layout/user/UserFullDetails";

export default function UserDetailsPage() {
  const navigate = useNavigate();

  const {
    user,
    loading,
    errorDetails,
    isEditModalOpen,
    setIsEditModalOpen,
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    isResetModalOpen,
    setIsResetModalOpen,
    isDeleting,
    handleBack,
    handleDeleteSuccess,
    handleUpdateSuccess,
    handleResetSuccess,
  } = useUserDetails();

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
    <div className="bg-[var(--bg)] text-[var(--text-main)] min-h-screen">
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

        <UserFullDetails
          user={user}
          onEdit={() => setIsEditModalOpen(true)}
          onReset={() => setIsResetModalOpen(true)}
          onDelete={() => setIsDeleteModalOpen(true)}
          isDeleting={isDeleting}
        />

      </main>

      <EditUserModal
        isOpen={isEditModalOpen}
        user={user}
        onClose={() => setIsEditModalOpen(false)}
        onUpdated={handleUpdateSuccess}
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
        onSuccess={handleResetSuccess}
      />
    </div>
  );
}
