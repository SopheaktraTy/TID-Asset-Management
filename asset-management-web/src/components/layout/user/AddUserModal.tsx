import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, X } from "lucide-react";

import { Button } from "../../ui/Button";
import { Input } from "../../ui/Input";
import { Select } from "../../ui/Select";
import { Message } from "../../ui/Message";

import type { CreateUserFormValues, UserDto } from "../../../types/user.types";
import { createUserSchema } from "../../../types/user.types";
import { createUserApi } from "../../../services/userManagement.service";
import { useState } from "react";

interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: UserDto) => void;
}

export default function AddUserModal({ isOpen, onClose, onSuccess }: AddUserModalProps) {
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateUserFormValues>({
    resolver: zodResolver(createUserSchema),
  });

  if (!isOpen) return null;

  const handleClose = () => {
    reset();
    setErrorMsg(null);
    onClose();
  };

  const onSubmit = async (data: CreateUserFormValues) => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const newUser = await createUserApi(data);
      reset();
      onSuccess(newUser);
    } catch (err: any) {
      setErrorMsg(
        err?.response?.data?.message || err.message || "Failed to create user."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-[var(--surface)] w-full max-w-md rounded-2xl shadow-xl overflow-hidden border border-[var(--border-color)]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border-color)]">
          <h2 className="text-lg font-semibold text-[var(--text-main)]">Add New User</h2>
          <button onClick={handleClose} className="p-1 rounded-full text-[var(--text-muted)] hover:bg-[var(--surface-hover)] transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {errorMsg && <Message variant="error" className="mb-4">{errorMsg}</Message>}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-left">
            <div>
              <label className="block text-sm font-medium text-[var(--text-main)] mb-1">Username</label>
              <Input type="text" placeholder="John Doe" {...register("username")} />
              {errors.username && <p className="mt-1 text-xs text-red-500">{errors.username.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--text-main)] mb-1">Email</label>
              <Input type="email" placeholder="john@example.com" {...register("email")} />
              {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--text-main)] mb-1">Password</label>
              <Input type="password" placeholder="••••••••" {...register("password")} />
              {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--text-main)] mb-1">Role</label>
              <Select {...register("role")}>
                <option value="">Select a role...</option>
                <option value="SUPER_ADMIN">Super Admin</option>
                <option value="ADMIN">Admin</option>
                <option value="Manager">Manager</option>
              </Select>
              {errors.role && <p className="mt-1 text-xs text-red-500">{errors.role.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--text-main)] mb-1">Department</label>
              <Select {...register("department")}>
                <option value="">Select a department...</option>
                <option value="OFFICE_ADMIN">Office Admin</option>
                <option value="TAX_ACCOUNTING_ADVISORY">Tax & Accounting Advisory</option>
                <option value="LEGAL_CORPORATE_ADVISORY">Legal & Corporate Advisory</option>
              </Select>
              {errors.department && <p className="mt-1 text-xs text-red-500">{errors.department.message}</p>}
            </div>

            <div className="pt-4 flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" disabled={loading}>
                {loading ? <Loader2 size={16} className="animate-spin" /> : "Create User"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
