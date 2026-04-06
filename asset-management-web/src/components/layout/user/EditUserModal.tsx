import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";

import { Button } from "../../ui/Button";
import { Input } from "../../ui/BackgroundColorPlaceholder";
import { Message } from "../../ui/Message";

import type { EditUserFormValues, UserDto } from "../../../types/user.types";
import { editUserSchema } from "../../../types/user.types";
import { updateUserApi } from "../../../services/userManagement.service";
import { Modal } from "../../ui/Modal";
import { DropdownList } from "../../ui/DropdownList";
import { ToggleSwitch } from "../../ui/ToggleSwitch";

interface EditUserModalProps {
  isOpen: boolean;
  user: UserDto | null;
  onClose: () => void;
  onUpdated: (user: UserDto) => void;
}

const MODULE_INFO = [
  { id: "ASSET", label: "Asset Management", description: "Allow users to view, create, edit and delete assets." },
  { id: "ASSIGNMENT", label: "Asset Assignment", description: "Control how assets are assigned and tracked." },
  { id: "ISSUE", label: "Issue Tracking", description: "Manage asset maintenance and issue reports." },
  { id: "PROCUREMENT", label: "Procurement", description: "Handle asset purchase requests and vendor info." },
] as const;

const PERMISSIONS_LIST = [
  { id: "READ", label: "Read Access", description: "Enables viewing and searching for assets and system records." },
  { id: "CREATE", label: "Create Access", description: "Enables creation of new assets, vendors, and assignments." },
  { id: "UPDATE", label: "Update Access", description: "Enables editing of existing asset data and status updates." },
  { id: "DELETE", label: "Delete Access", description: "Enables archival and permanent deletion of system data." },
] as const;


export default function EditUserModal({ isOpen, user, onClose, onUpdated }: EditUserModalProps) {
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    control,
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
        permissions: user.permissions || {},
      });
    }
  }, [user, isOpen, reset]);

  if (!isOpen || !user) return null;

  const handleClose = () => {
    reset();
    setErrorMsg(null);
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

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      maxWidth="max-w-[500px]"
    >
      <div className="flex flex-col gap-6">

        {/* Horizontal Info Card with Dashed Border - User Summary */}
        <div className="flex items-center gap-5 px-5 py-5 border border-dashed border-[var(--border-color)] dark:border-[var(--text-muted)]/30 rounded-xl bg-[var(--surface-hover)]/30 shadow-sm dark:shadow-none mb-2 transition-all">
          <div className="flex shrink-0">
            <div className="w-14 h-14 rounded-full border border-[var(--border-color)] flex items-center justify-center bg-[var(--surface)] text-[var(--text-main)] font-bold text-lg overflow-hidden ring-4 ring-[var(--surface-hover)]/50">
              {user.image ? (
                <img src={user.image} alt={user.username} className="w-full h-full object-cover" />
              ) : (
                user.username?.slice(0, 2).toUpperCase()
              )}
            </div>
          </div>

          <div className="flex flex-col min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-base font-bold text-[var(--text-main)] truncate leading-none">{user.username}</span>
              <div className="flex items-center gap-1.5 ml-1">
                <span className="px-2 py-0.5 rounded border border-[var(--border-color)] bg-[var(--surface-hover)]/40 text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-tight">
                  {user.role?.replace('_', ' ')}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs text-[var(--text-muted)] truncate">{user.email}</span>
              <div className={`w-1.5 h-1.5 rounded-full ${user.is_active || user.status === 'ACTIVE' ? 'bg-emerald-500' : 'bg-orange-500'}`} />
              <span className={`text-[11px] font-semibold tracking-tight ${(user.is_active || user.status === 'ACTIVE') ? 'text-emerald-500' : 'text-orange-500'}`}>
                {(user.is_active || user.status === 'ACTIVE') ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col">
          <h3 className="text-base font-semibold text-[var(--text-main)] mb-2">Edit User Information</h3>
          <div className="h-px bg-[var(--border-color)] w-full" />
        </div>

        {errorMsg && <Message variant="error" className="mb-4">{errorMsg}</Message>}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 text-left">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[var(--text-main)] mb-2 ml-1">Nickname</label>
              <Input
                type="text"
                placeholder="What should we call you?"
                className="bg-[var(--bg)] border-[var(--border-color)]/50"
                {...register("username")}
              />
              {errors.username && <p className="mt-1 text-[10px] text-red-500 ml-1">{errors.username.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-[var(--text-main)] mb-2 ml-1">Email address</label>
              <Input
                type="email"
                placeholder="Email Address"
                className="bg-[var(--bg)] border-[var(--border-color)]/50"
                {...register("email")}
              />
              {errors.email && <p className="mt-1 text-[10px] text-red-500 ml-1">{errors.email.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col">
                <label className="block text-xs font-bold text-[var(--text-main)] mb-2 ml-1">Role</label>
                <Controller
                  name="role"
                  control={control}
                  render={({ field }) => (
                    <DropdownList
                      options={[
                        { label: "Super Admin", value: "SUPER_ADMIN" },
                        { label: "Admin", value: "ADMIN" },
                      ]}
                      value={field.value}
                      onChange={field.onChange}
                      className="w-full"
                    />
                  )}
                />
                {errors.role && <p className="mt-1 text-[10px] text-red-500 ml-1">{errors.role.message}</p>}
              </div>

              <div className="flex flex-col">
                <label className="block text-xs font-bold text-[var(--text-main)] mb-2 ml-1">Status</label>
                <Controller
                  name="status"
                  control={control}
                  render={({ field }) => (
                    <DropdownList
                      options={[
                        { label: "Active", value: "ACTIVE" },
                        { label: "Inactive", value: "INACTIVE" },
                      ]}
                      value={field.value}
                      onChange={field.onChange}
                      className="w-full"
                    />
                  )}
                />
                {errors.status && <p className="mt-1 text-[10px] text-red-500 ml-1">{errors.status.message}</p>}
              </div>
            </div>
          </div>

          <div className="pt-2">
            <h3 className="text-sm font-bold text-[var(--text-main)] mb-2 px-1">Access Permissions</h3>
            <div className="h-px bg-[var(--border-color)] w-full mb-4" />
            <div className="flex flex-col">
              {MODULE_INFO.map((module) => (
                <div key={module.id} className="border-b border-[var(--border-color)]/20 last:border-0 transition-all duration-200">
                  <Controller
                    name={`permissions.${module.id}`}
                    control={control}
                    render={({ field }) => {
                      const isEnabled = (field.value || []).length > 0;
                      return (
                        <div className="flex flex-col">
                          <ToggleSwitch
                            label={module.label}
                            description={module.description}
                            checked={isEnabled}
                            size="sm"
                            onChange={(checked) => {
                              field.onChange(checked ? ["READ"] : []);
                            }}
                            className="px-2 !py-3 hover:bg-[var(--surface-hover)]/30 transition-colors rounded-lg flex-1"
                          />

                          {isEnabled && (
                            <div className="flex flex-col gap-1 pb-4 pr-2 pl-6 animate-in slide-in-from-top-2 fade-in duration-300">
                              <div className="flex flex-col">
                                {PERMISSIONS_LIST.map((perm) => (
                                  <ToggleSwitch
                                    key={perm.id}
                                    label={perm.label}
                                    description={perm.description}
                                    size="sm"
                                    reverse={true}
                                    checked={(field.value || []).includes(perm.id as any)}
                                    onChange={(checked) => {
                                      const current = field.value || [];
                                      const next = checked
                                        ? [...current, perm.id]
                                        : current.filter((p) => p !== perm.id);
                                      field.onChange(next);
                                    }}
                                    className="!py-2 border-b border-[var(--border-color)]/20 last:border-0 !justify-start gap-4"
                                  />
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    }}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="pt-1 flex items-center justify-end gap-3 translate-y-1">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="bg-transparent border-[var(--border-color)] text-[var(--text-main)] hover:bg-[var(--surface-hover)] rounded-full px-8 h-11 text-xs font-bold transition-all border-opacity-30"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={loading}
              className="w-auto min-w-[160px] h-11 gap-2 px-8 py-2 text-xs font-bold bg-[var(--color-growth-green)] text-[var(--btn-primary-text)] border-0 transition-all rounded-full shadow-[0_2px_8px_var(--btn-primary-shadow)] hover:shadow-[0_4px_14px_var(--btn-primary-shadow)] hover:brightness-110 transform active:scale-95"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : "Save Changes"}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
