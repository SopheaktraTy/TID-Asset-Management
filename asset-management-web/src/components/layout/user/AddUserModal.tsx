import { useState } from "react";
import {
  Loader2,
  Eye,
  EyeOff,
  User as UserIcon,
  Fingerprint,
  Pencil,
  ShieldCheck,
  Trash2,
} from "lucide-react";

import { Button } from "../../ui/Button";
import { Input } from "../../ui/BackgroundColorPlaceholder";
import { Message } from "../../ui/Message";
import { Modal } from "../../ui/Modal";
import { DropdownList } from "../../ui/DropdownList";
import { DropdownReverseList } from "../../ui/DropdownReverseList";
import { ToggleSwitch } from "../../ui/ToggleSwitch";
import { Controller } from "react-hook-form";
import { Camera } from "lucide-react";

import { useUserForm } from "../../../hooks/useUserForm";
import type { CreateUserFormValues, UserDto } from "../../../types/user.types";
import { createUserSchema } from "../../../types/user.types";
import { createUserApi } from "../../../services/userManagement.service";
import { useTheme } from "../../../hooks/useTheme";
import { useImageUpload } from "../../../hooks/useImageUpload";
import { ImageCropper } from "../../ui/ImageCropper";
import { getSafeImageUrl } from "../../../utils/image";

// Baker Tilly logo assets
import logoCharcoal from "../../../assets/Logo_Bakertilly/Baker Tilly Growth Symbol Charcoal.png";
import logoWhite from "../../../assets/Logo_Bakertilly/Baker Tilly Growth Symbol White.png";

const JOB_TITLE_OPTIONS = [
  { label: "— None —", value: "" },
  { label: "Assistant Manager", value: "ASSISTANT_MANAGER" },
  { label: "Associate", value: "ASSOCIATE" },
  { label: "Associate Director", value: "ASSOCIATE_DIRECTOR" },
  { label: "Consultant", value: "CONSULTANT" },
  { label: "Director", value: "DIRECTOR" },
  { label: "Executive", value: "EXECUTIVE" },
  { label: "Executive Assistant", value: "EXECUTIVE_ASSISTANT" },
  { label: "Intern", value: "INTERN" },
  { label: "Manager", value: "MANAGER" },
  { label: "Personal Assistant to Managing Partner", value: "PERSONAL_ASSISTANT_TO_MANAGING_PARTNER" },
  { label: "Receptionist", value: "RECEPTIONIST" },
  { label: "Senior Admin Executive", value: "SENIOR_ADMIN_EXECUTIVE" },
  { label: "Senior Associate", value: "SENIOR_ASSOCIATE" },
  { label: "Senior Consultant", value: "SENIOR_CONSULTANT" },
  { label: "Senior Executive", value: "SENIOR_EXECUTIVE" },
  { label: "Senior IT Executive", value: "SENIOR_IT_EXECUTIVE" },
  { label: "Senior Manager", value: "SENIOR_MANAGER" },
  { label: "Supervisor", value: "SUPERVISOR" },
];


const MODULE_INFO = [
  { id: "ASSET", label: "Asset Management", description: "Allow users to view, create, edit and delete assets." },
  { id: "ASSIGNMENT", label: "Asset Assignment", description: "Control how assets are assigned and tracked." },
  { id: "ISSUE", label: "Issue Tracking", description: "Manage asset maintenance and issue reports." },
  { id: "PROCUREMENT", label: "Procurement", description: "Handle asset purchase requests and vendor info." },
  { id: "EMPLOYEE", label: "Employee Directory", description: "Manage team member profiles and directory data." },
] as const;

const PERMISSIONS_LIST = [
  { id: "READ", label: "Read Access", description: "Enables viewing and searching for assets and system records." },
  { id: "CREATE", label: "Create Access", description: "Enables creation of new assets, vendors, and assignments." },
  { id: "UPDATE", label: "Update Access", description: "Enables editing of existing asset data and status updates." },
  { id: "DELETE", label: "Delete Access", description: "Enables archival and permanent deletion of system data." },
] as const;



interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: UserDto) => void;
}

export default function AddUserModal({ isOpen, onClose, onSuccess }: AddUserModalProps) {
  const { theme } = useTheme();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    control,
    watch,
    formState: { errors },
    loading,
    errorMsg,
    successMsg,
    handleClose,
    handleSubmit,
  } = useUserForm<CreateUserFormValues>({
    schema: createUserSchema,
    defaultValues: {
      username: "",
      email: "",
      password: "",
      role: "ADMIN",
      jobTitle: "",
      department: "",
      permissions: {},
    },
    onSubmit: (data) => createUserApi(data, selectedFile),
    onSuccess,
    onClose,
    successMessage: "User created successfully!",
  });

  const {
    tempImage,
    selectedFile,
    pendingCropImage,
    setPendingCropImage,
    fileInputRef,
    handleImageUpload,
    handleCropComplete,
    handleRemoveImage,
    resetImage,
    isDragging,
    dragProps,
  } = useImageUpload();

  const handleCloseWrapped = () => {
    resetImage();
    handleClose();
  };


  const currentRole = watch("role");

  if (!isOpen) return null;

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={handleCloseWrapped}
        maxWidth="max-w-[520px]"
      >
        <div className="flex flex-col gap-2">
          {/* Header - Logo & Title */}
          <div className="w-full flex items-center justify-center mb-2 pt-2">
            <img
              src={theme === "dark" ? logoWhite : logoCharcoal}
              alt="Logo"
              className="h-14 w-auto object-contain"
            />
            <div className="flex flex-col text-left">
              <h3 className="text-xl mt-2 font-bold tracking-tight text-[var(--text-main)] leading-none">Create New User</h3>
              <p className="text-[13px] text-[var(--text-muted)] opacity-80 lowercase font-medium">
                user registration
              </p>
            </div>
          </div>


          {/* Header content below (no line) */}

          <form onSubmit={handleSubmit} className="space-y-3 text-left">
            {/* ── Basic Information ── */}
            <div className="border border-[var(--border-color)]/30 rounded-2xl p-4 bg-[var(--surface-hover)]/5">
              <div className="px-1 mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Fingerprint size={16} className="text-[var(--color-growth-green)]" />
                  <h3 className="text-sm font-bold text-[var(--text-main)]">Basic Information</h3>
                </div>
              </div>
              <div className="px-[10px] space-y-4">
                <div className="flex items-center gap-5">
                  <div className="flex-1">
                    <label className="block text-xs font-bold text-[var(--text-main)] mb-2 ml-1">Username</label>
                    <Input
                      type="text"
                      placeholder="What should we call you?"
                      className="bg-[var(--bg)] border-[var(--border-color)]/50"
                      {...register("username")}
                    />
                    {errors.username && <p className="mt-1 text-[10px] text-red-500 ml-1">{errors.username.message}</p>}
                  </div>

                  {/* Avatar Selector */}
                  <div className="relative group shrink-0">
                    <div
                      {...dragProps}
                      onClick={() => fileInputRef.current?.click()}
                      className={`w-20 h-20 rounded-full border border-[var(--border-color)] flex items-center justify-center bg-[var(--bg)] text-[var(--text-main)] font-bold text-sm overflow-hidden ring-4 cursor-pointer transition-all ${isDragging
                        ? "ring-[var(--color-growth-green)] scale-110"
                        : "ring-[var(--surface-hover)]/30"
                        }`}
                    >
                      {tempImage ? (
                        <img src={getSafeImageUrl(tempImage)} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <UserIcon size={28} className="text-[var(--text-muted)]" />
                      )}
                      {!tempImage && (
                        <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <Camera size={20} className="text-white" />
                        </div>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (tempImage) {
                          handleRemoveImage();
                        } else {
                          fileInputRef.current?.click();
                        }
                      }}
                      className={`absolute bottom-0 right-0 w-7 h-7 border-2 border-[var(--surface)] rounded-full flex items-center justify-center text-white shadow-md z-40 transition-all duration-300 ${tempImage
                        ? "bg-[var(--color-growth-green)] group-hover:bg-red-500"
                        : "bg-[var(--color-growth-green)]"
                        }`}
                      title={tempImage ? "Remove image" : "Upload image"}
                    >
                      {tempImage ? (
                        <div className="relative w-full h-full flex items-center justify-center">
                          <Trash2 size={12} className="absolute opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          <Pencil size={12} className="absolute opacity-100 group-hover:opacity-0 transition-opacity duration-300" />
                        </div>
                      ) : (
                        <Pencil size={12} />
                      )}
                    </button>
                    <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
                  </div>
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
                    <label className="block text-xs font-bold text-[var(--text-main)] mb-2 ml-1">Password</label>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        className="bg-[var(--bg)] border-[var(--border-color)]/50"
                        {...register("password")}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors"
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                    {errors.password && <p className="mt-1 text-[10px] text-red-500 ml-1">{errors.password.message}</p>}
                  </div>

                  <div className="flex flex-col">
                    <label className="block text-xs font-bold text-[var(--text-main)] mb-2 ml-1">Role</label>
                    <Controller
                      name="role"
                      control={control}
                      render={({ field }) => (
                        <DropdownList
                          options={[
                            { label: "Super Admin", value: "SUPER_ADMIN" },
                            { label: "Admin", value: "ADMIN" }
                          ]}
                          value={field.value}
                          onChange={field.onChange}
                          className="w-full"
                          triggerClassName="bg-[var(--bg)]"
                          panelClassName="bg-[var(--bg)]"
                        />
                      )}
                    />
                    {errors.role && <p className="mt-1 text-[10px] text-red-500 ml-1">{errors.role.message}</p>}
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[var(--text-main)] mb-2 ml-1">Job Title</label>
                    <Controller
                      name="jobTitle"
                      control={control}
                      render={({ field }) => (
                        <DropdownReverseList
                          options={JOB_TITLE_OPTIONS}
                          value={field.value ?? ""}
                          onChange={field.onChange}
                          className="w-full"
                          triggerClassName="bg-[var(--bg)]"
                          panelClassName="bg-[var(--bg)]"
                        />
                      )}
                    />
                    {errors.jobTitle && <p className="mt-1 text-[10px] text-red-500 ml-1">{errors.jobTitle.message}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[var(--text-main)] mb-2 ml-1">Department</label>
                    <Controller
                      name="department"
                      control={control}
                      render={({ field }) => (
                        <DropdownReverseList
                          options={[
                            { label: "— None —", value: "" },
                            { label: "Office Admin", value: "OFFICE_ADMIN" },
                            { label: "Tax & Accounting Advisory", value: "TAX_ACCOUNTING_ADVISORY" },
                            { label: "Legal & Corporate Advisory", value: "LEGAL_CORPORATE_ADVISORY" },
                            { label: "Audit & Assurance", value: "AUDIT_ASSURANCE" },
                            { label: "Practice Development & Management", value: "PRACTICE_DEVELOPMENT_MANAGEMENT" },
                            { label: "Client & Operation Management", value: "CLIENT_OPERATION_MANAGEMENT" },
                            { label: "Finance & Human Resource", value: "FINANCE_HUMAN_RESOURCE" },
                            { label: "Technology Innovation and Development", value: "TECHNOLOGY_INNOVATION_DEVELOPMENT" },
                          ]}
                          value={field.value ?? ""}
                          onChange={field.onChange}
                          className="w-full"
                          triggerClassName="bg-[var(--bg)]"
                          panelClassName="bg-[var(--bg)]"
                        />
                      )}
                    />
                    {errors.department && <p className="mt-1 text-[10px] text-red-500 ml-1">{errors.department.message}</p>}
                  </div>
                </div>
              </div>
            </div>

            {/* ── Access Permissions ── */}
            <div className="border border-[var(--border-color)]/30 rounded-2xl p-4 bg-[var(--surface-hover)]/5">
              <div className="px-1 mb-3 flex items-center gap-2">
                <ShieldCheck size={16} className="text-[var(--color-growth-green)]" />
                <h3 className="text-sm font-bold text-[var(--text-main)]">Access Permissions</h3>
              </div>
              <div className="px-[10px]">
                {currentRole === "SUPER_ADMIN" ? (
                  <div className="flex items-center gap-3 px-4 py-5 rounded-xl bg-emerald-500/5 border border-emerald-500/10 mb-4 animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 shrink-0">
                      <UserIcon size={20} />
                    </div>
                    <div>
                      <h4 className="text-emerald-600 dark:text-emerald-400 font-bold text-sm">Full System Access</h4>
                      <p className="text-[var(--text-muted)] text-sm mt-1 leading-relaxed">
                        This user will have a <span className="text-emerald-500 font-bold">Super Admin</span> role and bypasses individual module permission checks.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col">
                    {MODULE_INFO.map((module) => (
                      <div key={module.id} className="border-b border-[var(--border-color)]/20 last:border-0 transition-all duration-200">
                        <Controller
                          name={`permissions.${module.id}`}
                          control={control}
                          defaultValue={[]}
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
                                      {PERMISSIONS_LIST.map((perm) => {
                                        const hasOtherPermissions = (field.value || []).some((p: string) => p !== "READ");
                                        const isReadLocked = perm.id === "READ" && hasOtherPermissions;

                                        return (
                                          <ToggleSwitch
                                            key={perm.id}
                                            label={perm.label}
                                            description={perm.description}
                                            size="sm"
                                            reverse={true}
                                            checked={isReadLocked ? true : (field.value || []).includes(perm.id as any)}
                                            disabled={isReadLocked}
                                            onChange={(checked) => {
                                              const current = field.value || [];
                                              const next = checked
                                                ? [...current, perm.id]
                                                : current.filter((p: string) => p !== perm.id);
                                              field.onChange(next);
                                            }}
                                            className="!py-2 border-b border-[var(--border-color)]/20 last:border-0 !justify-start gap-4"
                                          />
                                        );
                                      })}
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
                )}
              </div>
            </div>

            {errorMsg && <Message variant="error">{errorMsg}</Message>}
            {successMsg && <Message variant="success">{successMsg}</Message>}

            <div className="pt-2 flex items-center justify-end gap-3 translate-y-1">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                className="bg-transparent border-[var(--border-color)] text-[var(--text-main)] hover:bg-[var(--surface-hover)] rounded-full px-8 h-10 text-sm font-bold transition-all border-opacity-30"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={loading}
                className="w-auto min-w-[160px] h-10 gap-2 px-8 py-2 text-sm font-bold bg-[var(--color-growth-green)] text-[var(--btn-primary-text)] border-0 transition-all rounded-full shadow-[0_2px_8px_var(--btn-primary-shadow)] hover:shadow-[0_4px_14px_var(--btn-primary-shadow)] hover:brightness-110 transform active:scale-95 flex items-center justify-center"
              >
                {loading ? <Loader2 size={16} className="animate-spin" /> : "Create User"}
              </Button>
            </div>
          </form>
        </div>
      </Modal>
      {pendingCropImage && (
        <ImageCropper
          image={pendingCropImage}
          onCropComplete={handleCropComplete}
          onCancel={() => setPendingCropImage(null)}
          circular={true}
          aspect={1}
        />
      )}
    </>
  );
}
