import { useEffect } from "react";
import { Loader2, ClipboardList } from "lucide-react";
import { Controller } from "react-hook-form";

import { Button } from "../../ui/Button";
import { Input } from "../../ui/BackgroundColorPlaceholder";
import { Message } from "../../ui/Message";
import { Modal } from "../../ui/Modal";
import { DropdownReverseList } from "../../ui/DropdownReverseList";
import { useUserForm } from "../../../hooks/useUserForm";
import { useTheme } from "../../../hooks/useTheme";
import type {
  AssignAssetFormValues,
  AssignmentResponse,
} from "../../../types/assignment.types";
import {
  assignAssetSchema,
  DepartmentEnumValues,
  JobTitleEnumValues
} from "../../../types/assignment.types";
import { assignAssetApi } from "../../../services/assignment.service";
import type { AssetDto } from "../../../types/asset.types";

// Baker Tilly logo assets
import logoCharcoal from "../../../assets/Logo_Bakertilly/Baker Tilly Growth Symbol Charcoal.png";
import logoWhite from "../../../assets/Logo_Bakertilly/Baker Tilly Growth Symbol White.png";

interface AssignAssetModalProps {
  isOpen: boolean;
  asset: AssetDto | null;
  onClose: () => void;
  onSuccess: (assignment: AssignmentResponse) => void;
}

const DEPARTMENT_OPTIONS = DepartmentEnumValues.map(v => ({
  label: v.replace(/_/g, " "),
  value: v
}));

const JOB_TITLE_OPTIONS = JobTitleEnumValues.map(v => ({
  label: v.replace(/_/g, " "),
  value: v
}));

export default function AssignAssetModal({ isOpen, asset, onClose, onSuccess }: AssignAssetModalProps) {
  const { theme } = useTheme();
  const {
    register,
    reset,
    control,
    formState: { errors },
    loading,
    errorMsg,
    handleSubmit,
    handleClose: baseHandleClose,
  } = useUserForm<AssignAssetFormValues>({
    schema: assignAssetSchema,
    defaultValues: {
      assignedTo: "",
      department: "OFFICE_ADMIN",
      jobTitle: "ASSOCIATE",
    },
    onSubmit: async (data) => {
      if (!asset) throw new Error("No asset selected");
      return assignAssetApi(asset.id, data);
    },
    onSuccess: (assignment) => {
      onSuccess(assignment);
      onClose();
    },
    onClose,
    successMessage: "Asset assigned successfully!",
  });

  useEffect(() => {
    if (isOpen) {
      reset({
        assignedTo: "",
        department: "OFFICE_ADMIN",
        jobTitle: "ASSOCIATE",
      });
    }
  }, [isOpen, reset]);

  if (!isOpen || !asset) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={baseHandleClose}
      maxWidth="max-w-[480px]"
    >
      <div className="flex flex-col gap-2">
        {/* Header - Logo & Title */}
        <div className="w-full flex items-center justify-center mb-4 pt-1">
          <img
            src={theme === "dark" ? logoWhite : logoCharcoal}
            alt="Logo"
            className="h-14 w-auto object-contain"
          />
          <div className="flex flex-col text-left">
            <h3 className="text-xl mt-2 font-bold tracking-tight text-[var(--text-main)] leading-none">Assign Asset</h3>
            <p className="text-[13px] text-[var(--text-muted)] mt-1.5 lowercase font-bold">
              asset assignment
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 text-left">
          <div className="border border-[var(--border-color)] rounded-2xl p-5 bg-[var(--surface-hover)]/10 space-y-5">
            <div className="px-1 flex items-center gap-2">
              <ClipboardList size={16} className="text-[var(--color-growth-green)]" />
              <h3 className="text-sm font-bold text-[var(--text-main)] uppercase tracking-tight">Asset Assignment</h3>
            </div>

            <p className="text-xs text-[var(--text-muted)] px-1 leading-relaxed">
              Assigning <span className="font-bold text-[var(--text-main)]">{asset.deviceName}</span> ({asset.assetTag}) to a team member.
            </p>

            {/* Assigned To */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-[var(--text-main)] mb-2 ml-1">
                Employee Name *
              </label>
              <Input
                placeholder="Enter full name"
                className="bg-[var(--bg)] border-[var(--border-color)]/50"
                {...register("assignedTo")}
              />
              {errors.assignedTo && (
                <p className="text-[10px] text-red-500 ml-1 font-bold">{errors.assignedTo.message}</p>
              )}
            </div>

            {/* Department */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-[var(--text-main)] mb-2 ml-1">
                Department *
              </label>
              <Controller
                name="department"
                control={control}
                render={({ field }) => (
                  <DropdownReverseList
                    options={DEPARTMENT_OPTIONS}
                    value={field.value}
                    onChange={field.onChange}
                    className="w-full"
                    panelClassName="bg-[var(--bg)]"
                  />
                )}
              />
              {errors.department && (
                <p className="text-[10px] text-red-500 ml-1 font-bold">{errors.department.message}</p>
              )}
            </div>

            {/* Job Title */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-[var(--text-main)] mb-2 ml-1">
                Job Title *
              </label>
              <Controller
                name="jobTitle"
                control={control}
                render={({ field }) => (
                  <DropdownReverseList
                    options={JOB_TITLE_OPTIONS}
                    value={field.value}
                    onChange={field.onChange}
                    className="w-full"
                    panelClassName="bg-[var(--bg)]"
                  />
                )}
              />
              {errors.jobTitle && (
                <p className="text-[10px] text-red-500 ml-1 font-bold">{errors.jobTitle.message}</p>
              )}
            </div>
          </div>

          {errorMsg && <Message variant="error">{errorMsg}</Message>}

          <div className="pt-2 flex items-center justify-end gap-3 translate-y-1">
            <Button
              type="button"
              variant="outline"
              onClick={baseHandleClose}
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
              {loading ? <Loader2 size={16} className="animate-spin" /> : "Assign Asset"}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
