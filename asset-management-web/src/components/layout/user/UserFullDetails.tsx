import React from "react";
import { User as UserIcon } from "lucide-react";
import { toPascalCase, formatDateTime } from "../../../utils/format";
import { getSafeImageUrl } from "../../../utils/image";
import type { UserDto } from "../../../types/user.types";

interface UserFullDetailsProps {
  user: UserDto;
  onEdit: () => void;
  onReset: () => void;
  onDelete: () => void;
  isDeleting?: boolean;
}

export const UserFullDetails: React.FC<UserFullDetailsProps> = ({
  user,
  onEdit,
  onReset,
  onDelete,
  isDeleting = false,
}) => {
  const isUserActive = user.status === "ACTIVE";

  return (
    <div className="space-y-8">
      {/* Profile Header Summary */}
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-[var(--surface-hover)] flex items-center justify-center text-xl font-bold border border-[var(--border-color)] uppercase overflow-hidden">
          {user.image ? (
            <img src={getSafeImageUrl(user.image)} alt={user.username} className="w-full h-full object-cover" />
          ) : (
            user.username ? user.username.substring(0, 2) : "U"
          )}
        </div>
        <div className="flex flex-col">
          <h2 className="text-xl font-bold">{user.username}</h2>
          <span className="text-[var(--text-muted)] text-sm">{user.email}</span>
          <div className="mt-1 px-3 py-1 bg-[#12131a] border border-[#292a33] text-xs text-gray-300 rounded-md inline-block w-max">
            User ID: {user.id}
          </div>
        </div>
      </div>

      {/* Tabs Placeholder */}
      <div className="flex items-center gap-6 border-b border-[var(--border-color)]">
        <button className="flex items-center gap-2 pb-3 border-b-2 border-blue-500 text-blue-500 font-medium text-xs">
          <UserIcon size={16} />
          Profile
        </button>
      </div>

      {/* Profile Details Card */}
      <div className="bg-[var(--bg)] border border-[var(--border-color)] rounded-xl p-6 text-xs">
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
              <div className={`w-1.5 h-1.5 rounded-full ${user.status === 'ACTIVE' ? 'bg-emerald-500' :
                user.status === 'SUSPENDED' ? 'bg-red-500' :
                'bg-gray-400 dark:bg-gray-500'
              }`}></div>
              <span className={`${user.status === 'ACTIVE' ? 'text-emerald-600 dark:text-emerald-400' :
                user.status === 'SUSPENDED' ? 'text-red-500 dark:text-red-400' :
                'text-[var(--text-muted)]'
              } font-medium`}>
                {user.status === 'ACTIVE' ? 'Active' : user.status === 'SUSPENDED' ? 'Suspended' : 'Inactive'}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-[150px_1fr] items-center">
            <span className="text-[var(--text-muted)]">Department:</span>
            <span className="text-[var(--text-main)] font-medium">{toPascalCase(user.department)}</span>
          </div>

          <div className="grid grid-cols-[150px_1fr] items-center">
            <span className="text-[var(--text-muted)]">Created At:</span>
            <span className="text-[var(--text-main)] font-medium">{formatDateTime(user.created_at || (user as any).createdAt)}</span>
          </div>

          <div className="grid grid-cols-[150px_1fr] items-center">
            <span className="text-[var(--text-muted)]">Updated At:</span>
            <span className="text-[var(--text-main)] font-medium">{formatDateTime(user.updated_at || (user as any).updatedAt || user.created_at || (user as any).createdAt)}</span>
          </div>

          <div className="mt-4">
            <button
              onClick={onEdit}
              className="px-4 py-2 bg-transparent border border-[var(--border-color)] text-[var(--text-main)] rounded-md hover:bg-[var(--surface-hover)] transition-colors font-medium text-xs"
            >
              Edit user details
            </button>
          </div>
        </div>
      </div>

      {/* Access Permissions Card */}
      <div className="bg-[var(--bg)] border border-[var(--border-color)] rounded-xl p-6 text-xs">
        <h3 className="text-sm font-bold text-[var(--text-main)] mb-4 px-1">Access Permissions</h3>
        <div className="h-px bg-[var(--border-color)] w-full mb-4 opacity-50" />

        <div className="flex flex-col gap-6">
          {user.role === 'SUPER_ADMIN' ? (
            <div className="flex items-center gap-3 px-4 py-4 rounded-lg bg-emerald-500/5 border border-emerald-500/20">
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-500">
                <UserIcon size={16} />
              </div>
              <div>
                <h4 className="text-[var(--text-main)] font-bold text-sm">Full System Access</h4>
                <p className="text-[var(--text-muted)] text-[11px] mt-0.5">This user has a Super Admin role and bypasses individual module permission checks.</p>
              </div>
            </div>
          ) : !user.permissions || Object.keys(user.permissions).length === 0 ? (
            <div className="px-4 py-8 text-center border border-dashed border-[var(--border-color)] rounded-lg">
              <p className="text-[var(--text-muted)] text-sm">No specific permissions assigned.</p>
            </div>
          ) : (
            <div className={`grid grid-cols-1 gap-4 ${
              Object.keys(user.permissions || {}).length >= 4 ? 'lg:grid-cols-4 md:grid-cols-2' : 
              Object.keys(user.permissions || {}).length === 3 ? 'lg:grid-cols-3 md:grid-cols-3' : 
              'md:grid-cols-2'
            }`}>
              {Object.entries(user.permissions || {}).map(([module, perms]) => (
                <div key={module} className="flex flex-col bg-[var(--surface)] dark:bg-[var(--bg)] border border-[var(--border-color)]/60 rounded-lg p-4 transition-all hover:border-[var(--border-color)] hover:shadow-sm">
                  <h4 className="text-[var(--text-main)] font-bold text-xs mb-1 uppercase tracking-wider">{module.replace(/_/g, ' ')}</h4>
                  <p className="text-[var(--text-muted)] text-[10px] mb-3">Module access allowed</p>
                  <div className="flex flex-wrap gap-2">
                    {Array.isArray(perms) && perms.map((p) => (
                      <span key={p} className="px-2 py-1 bg-[var(--surface-hover)] border border-[var(--border-color)] rounded text-[10px] font-semibold text-[var(--text-main)] transition-colors hover:bg-[var(--surface-hover)]/70 cursor-default">
                        {p}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
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
                onClick={onReset}
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
                onClick={onDelete}
                disabled={isDeleting}
                className="shrink-0 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-900 text-white border-0 rounded-md transition-all font-bold text-[11px] shadow-lg shadow-red-600/20 active:scale-95 uppercase tracking-wide"
              >
                {isDeleting ? "Deleting..." : "Delete user account"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
