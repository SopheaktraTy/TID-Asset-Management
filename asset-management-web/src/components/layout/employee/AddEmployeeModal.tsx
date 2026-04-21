import {
  Loader2,
  Camera,
  X,
  User as UserIcon,
  Pencil,
} from "lucide-react";

import { Button } from "../../ui/Button";
import { Message } from "../../ui/Message";
import { Modal } from "../../ui/Modal";
import { DropdownReverseList } from "../../ui/DropdownReverseList";
import { Controller } from "react-hook-form";

import { useUserForm } from "../../../hooks/useUserForm";
import type { CreateEmployeeFormValues, EmployeeDto } from "../../../types/employee.types";
import { createEmployeeSchema } from "../../../types/employee.types";
import { createEmployeeApi } from "../../../services/employee.service";
import { useTheme } from "../../../hooks/useTheme";
import { useImageUpload } from "../../../hooks/useImageUpload";
import { ImageCropper } from "../../ui/ImageCropper";
import { getSafeImageUrl } from "../../../utils/image";

// Baker Tilly logo assets
import logoCharcoal from "../../../assets/Logo_Bakertilly/Baker Tilly Logo_Charcoal.png";
import logoWhite from "../../../assets/Logo_Bakertilly/Baker Tilly Logo_White.png";

const JOB_TITLE_OPTIONS = [
  { label: "Assistant Manager", value: "ASSISTANT_MANAGER" },
  { label: "Associate", value: "ASSOCIATE" },
  { label: "Associate Director", value: "ASSOCIATE_DIRECTOR" },
  { label: "Consultant", value: "CONSULTANT" },
  { label: "Director", value: "DIRECTOR" },
  { label: "Executive", value: "EXECUTIVE" },
  { label: "Executive Assistant", value: "EXECUTIVE_ASSISTANT" },
  { label: "Intern", value: "INTERN" },
  { label: "Manager", value: "MANAGER" },
  { label: "Personal Assistant", value: "PERSONAL_ASSISTANT_TO_MANAGING_PARTNER" },
  { label: "Receptionist", value: "RECEPTIONIST" },
  { label: "Senior Admin Executive", value: "SENIOR_ADMIN_EXECUTIVE" },
  { label: "Senior Associate", value: "SENIOR_ASSOCIATE" },
  { label: "Senior Consultant", value: "SENIOR_CONSULTANT" },
  { label: "Senior Executive", value: "SENIOR_EXECUTIVE" },
  { label: "Senior IT Executive", value: "SENIOR_IT_EXECUTIVE" },
  { label: "Senior Manager", value: "SENIOR_MANAGER" },
  { label: "Supervisor", value: "SUPERVISOR" },
];

const DEPARTMENT_OPTIONS = [
  { label: "— None —", value: "" },
  { label: "Office Admin", value: "OFFICE_ADMIN" },
  { label: "Tax & Accounting Advisory", value: "TAX_ACCOUNTING_ADVISORY" },
  { label: "Legal & Corporate Advisory", value: "LEGAL_CORPORATE_ADVISORY" },
  { label: "Audit & Assurance", value: "AUDIT_ASSURANCE" },
  { label: "Practice Development & Management", value: "PRACTICE_DEVELOPMENT_MANAGEMENT" },
  { label: "Client & Operation Management", value: "CLIENT_OPERATION_MANAGEMENT" },
  { label: "Finance & Human Resource", value: "FINANCE_HUMAN_RESOURCE" },
  { label: "Technology Innovation and Development", value: "TECHNOLOGY_INNOVATION_DEVELOPMENT" },
];

interface AddEmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (emp: EmployeeDto) => void;
}

export default function AddEmployeeModal({ isOpen, onClose, onSuccess }: AddEmployeeModalProps) {
  const { theme } = useTheme();

  const {
    register,
    control,
    formState: { errors },
    loading,
    errorMsg,
    handleClose,
    handleSubmit,
  } = useUserForm<CreateEmployeeFormValues>({
    schema: createEmployeeSchema,
    defaultValues: {
      username: "",
      department: "",
      jobTitle: "",
    },
    onSubmit: (data) => createEmployeeApi(data, selectedFile),
    onSuccess,
    onClose,
    successMessage: "Employee added to directory!",
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
  } = useImageUpload({ aspect: 1 });

  const handleCloseWrapped = () => {
    resetImage();
    handleClose();
  };

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={handleCloseWrapped} maxWidth="max-w-[520px]">
      <div className="flex flex-col gap-4">
        {/* Header - Logo on Right */}
        <div className="flex items-center justify-between mb-10 w-full px-2">
          <div className="flex flex-col gap-1">
            <h3 className="text-lg font-bold tracking-tight text-[var(--text-main)] leading-none">Employee Registration</h3>
            <p className="text-xs text-[var(--text-muted)] font-medium">Add a new employee to the directory</p>
          </div>
          <img src={theme === "dark" ? logoWhite : logoCharcoal} alt="Logo" className="h-7 w-auto object-contain" />
        </div>

        {errorMsg && (
          <div className="mb-4">
            <Message variant="error">{errorMsg}</Message>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          <div className="space-y-6 px-2">
            {/* Avatar Section - Profile Model Style */}
            <div className="flex flex-col items-center">
              <div className="relative group">
                <div
                  {...dragProps}
                  onClick={() => fileInputRef.current?.click()}
                  className={`w-32 h-32 rounded-full border-2 overflow-hidden ring-8 ring-[var(--color-growth-green)]/5 transition-all cursor-pointer relative ${
                    isDragging ? "border-[var(--color-growth-green)] scale-105" : "border-[var(--color-growth-green)]"
                  }`}
                >
                  {tempImage ? (
                    <img src={getSafeImageUrl(tempImage)} alt="Preview" className="w-full h-full object-cover shadow-inner" />
                  ) : (
                    <div className="w-full h-full rounded-full bg-[var(--surface-hover)] flex items-center justify-center">
                      <UserIcon size={48} className="text-[var(--text-muted)]" />
                    </div>
                  )}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-[1px]">
                    <Camera size={24} className="text-white" />
                  </div>
                </div>
                <div className="absolute bottom-1 right-1 w-8 h-8 bg-[var(--color-growth-green)] border-2 border-[var(--surface)] rounded-full flex items-center justify-center text-white shadow-md z-10 pointer-events-none">
                  <Pencil size={14} />
                </div>
                {tempImage && (
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute top-1 left-1 w-7 h-7 bg-[var(--surface)] border border-[var(--border-color)] rounded-full flex items-center justify-center text-[var(--text-muted)] hover:text-red-500 shadow-sm transition-colors z-20"
                  >
                    <X size={16} />
                  </button>
                )}
                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
              </div>
            </div>

            {/* Form Content - Profile Model Grid Style */}
            <div className="space-y-1">
              <div className="pt-2 mb-2">
                <h3 className="text-sm font-bold text-[var(--text-main)]">New Employee Information</h3>
                <div className="h-px bg-[var(--border-color)] w-full opacity-50 mt-2" />
              </div>

              {/* Name Row */}
              <div className="py-2 grid grid-cols-[120px_1fr] items-center gap-4">
                <label className="text-xs font-bold text-[var(--text-main)]">Full Name</label>
                <div className="w-full relative flex items-center">
                  <input
                    {...register("username")}
                    type="text"
                    placeholder="Enter full name"
                    className="w-full bg-[var(--surface-hover)] border border-[var(--color-growth-green)]/20 rounded-lg px-3 py-1.5 text-[11px] font-bold text-[var(--text-main)] outline-none focus:ring-2 focus:ring-[var(--color-growth-green)]/10 focus:border-[var(--color-growth-green)]/50 transition-all h-[36px]"
                  />
                  {errors.username && (
                    <div className="absolute right-2 text-red-500">
                      <X size={12} />
                    </div>
                  )}
                </div>
              </div>

              {/* Department Row */}
              <div className="py-2 grid grid-cols-[120px_1fr] items-center gap-4">
                <label className="text-xs font-bold text-[var(--text-main)]">Department</label>
                <Controller
                  name="department"
                  control={control}
                  render={({ field }) => (
                    <DropdownReverseList
                      options={DEPARTMENT_OPTIONS}
                      value={field.value}
                      onChange={field.onChange}
                      className="w-full"
                      triggerClassName="w-full bg-[var(--surface-hover)] border border-[var(--border-color)]/20 rounded-lg h-[36px] px-3 text-left"
                      panelClassName="bg-[var(--bg)]"
                    />
                  )}
                />
              </div>

              {/* Job Title Row */}
              <div className="py-2 grid grid-cols-[120px_1fr] items-center gap-4">
                <label className="text-xs font-bold text-[var(--text-main)]">Job Title</label>
                <Controller
                   name="jobTitle"
                  control={control}
                  render={({ field }) => (
                    <DropdownReverseList
                      options={JOB_TITLE_OPTIONS}
                      value={field.value}
                      onChange={field.onChange}
                      className="w-full"
                      triggerClassName="w-full bg-[var(--surface-hover)] border border-[var(--border-color)]/20 rounded-lg h-[36px] px-3 text-left"
                      panelClassName="bg-[var(--bg)]"
                    />
                  )}
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="flex-1 h-10 rounded-full font-bold  text-xs border-[var(--border-color)]/30"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={loading}
              className="flex-[1.5] h-10 bg-[var(--color-growth-green)] rounded-full font-bold  text-xs gap-2 shadow-lg shadow-[var(--color-growth-green)]/10"
            >
              {loading ? <Loader2 size={12} className="animate-spin" /> : <Plus size={12} />}
              Add Employee
            </Button>
          </div>
        </form>
      </div>

      {pendingCropImage && (
        <ImageCropper
          image={pendingCropImage}
          onCropComplete={handleCropComplete}
          onCancel={() => setPendingCropImage(null)}
          circular={true}
          aspect={1}
        />
      )}
    </Modal>
  );
}

const Plus = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
);
