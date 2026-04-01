import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, X, Trash2 } from "lucide-react";

import { Button } from "../../ui/Button";
import { Input } from "../../ui/Input";
import { Select } from "../../ui/Select";
import { Message } from "../../ui/Message";

import type { EditUserFormValues, UserDto } from "../../../types/user.types";
import { editUserSchema } from "../../../types/user.types";
import { updateUserApi, deleteUserApi } from "../../../services/userManagement.service";
import { useState, useEffect } from "react";

interface EditUserModalProps {
  isOpen: boolean;
  user: UserDto | null;
  onClose: () => void;
  onUpdated: (user: UserDto) => void;
  onDeleted: (id: number) => void;
}

export default function EditUserModal({ isOpen, user, onClose, onUpdated, onDeleted }: EditUserModalProps) {
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EditUserFormValues>({
    resolver: zodResolver(editUserSchema),
  });

  useEffect(() => {
    if (user && isOpen) {
      reset({
        username: user.username,
        email: user.email,
        role: user.role,
        status: user.status,
      });
    }
  }, [user, isOpen, reset]);

  if (!isOpen || !user) return null;

  const handleClose = () => {
    reset();
    setErrorMsg(null);
    setShowConfirmDelete(false);
    onClose();
  };

  const onSubmit = async (data: EditUserFormValues) => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const updatedUser = await updateUserApi(user.id, data);
      onUpdated(updatedUser);
    } catch (err: any) {
      setErrorMsg(
        err?.response?.data?.message || err.message || "Failed to update user."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    setErrorMsg(null);
    try {
      await deleteUserApi(user.id);
      onDeleted(user.id);
    } catch (err: any) {
      setErrorMsg(
        err?.response?.data?.message || err.message || "Failed to delete user."
      );
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-[var(--surface)] w-full max-w-md rounded-2xl shadow-xl overflow-hidden border border-[var(--border-color)]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border-color)]">
          <h2 className="text-lg font-semibold text-[var(--text-main)]">Edit User</h2>
          <button onClick={handleClose} className="p-1 rounded-full text-[var(--text-muted)] hover:bg-[var(--surface-hover)] transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {errorMsg && <Message variant="error" className="mb-4">{errorMsg}</Message>}

          {!showConfirmDelete ? (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-left">
              <div>
                <label className="block text-sm font-medium text-[var(--text-main)] mb-1">Username</label>
                <Input type="text" {...register("username")} />
                {errors.username && <p className="mt-1 text-xs text-red-500">{errors.username.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--text-main)] mb-1">Email</label>
                <Input type="email" {...register("email")} />
                {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--text-main)] mb-1">Role</label>
                  <Select {...register("role")}>
                    <option value="SUPER_ADMIN">Super Admin</option>
                    <option value="ADMIN">Admin</option>
                    <option value="Manager">Manager</option>
                  </Select>
                  {errors.role && <p className="mt-1 text-xs text-red-500">{errors.role.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--text-main)] mb-1">Status</label>
                  <Select {...register("status")}>
                    <option value="ACTIVE">Active</option>
                    <option value="INACTIVE">Inactive</option>
                  </Select>
                  {errors.status && <p className="mt-1 text-xs text-red-500">{errors.status.message}</p>}
                </div>
              </div>

              {/* Actions */}
              <div className="pt-6 flex items-center justify-between border-t border-[var(--border-color)]">
                <button
                  type="button"
                  title="Delete user"
                  onClick={() => setShowConfirmDelete(true)}
                  className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
                >
                  <Trash2 size={18} />
                </button>

                <div className="flex gap-3">
                  <Button type="button" variant="outline" onClick={handleClose}>
                    Cancel
                  </Button>
                  <Button type="submit" variant="primary" disabled={loading}>
                    {loading ? <Loader2 size={16} className="animate-spin" /> : "Save Changes"}
                  </Button>
                </div>
              </div>
            </form>
          ) : (
            <div className="space-y-4 text-center">
              <div className="bg-red-100 dark:bg-red-900/40 p-3 rounded-full w-14 h-14 mx-auto flex items-center justify-center text-red-600 dark:text-red-400">
                <Trash2 size={24} />
              </div>
              <h3 className="text-lg font-semibold text-[var(--text-main)]">Delete User?</h3>
              <p className="text-sm text-[var(--text-muted)] pb-2">
                Are you sure you want to delete <span className="font-semibold">{user.username}</span>? This action cannot be undone.
              </p>

              <div className="flex justify-center gap-3 pt-2">
                <Button type="button" variant="outline" onClick={() => setShowConfirmDelete(false)}>
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={handleDelete}
                  disabled={deleting}
                  className="bg-red-600 hover:bg-red-700 text-white border-0"
                >
                  {deleting ? <Loader2 size={16} className="animate-spin" /> : "Yes, Delete"}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
