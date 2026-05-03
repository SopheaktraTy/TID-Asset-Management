import { useEffect } from "react";
import { Loader2, RefreshCw } from "lucide-react";

import { Button } from "../../ui/Button";
import { Message } from "../../ui/Message";
import { Modal } from "../../ui/Modal";
import { DropdownSelect } from "../../ui/DropdownSelect";
import { useUserForm } from "../../../hooks/useUserForm";
import { useTheme } from "../../../hooks/useTheme";
import type {
  UpdateIssueFormValues,
  IssueResponse,
  IssueStatusType,
} from "../../../types/issue.types";
import {
  updateIssueSchema,
  IssueStatusEnumValues,
} from "../../../types/issue.types";
import { updateIssueApi } from "../../../services/issue.service";
import { toPascalCase } from "../../../utils/format";

// Baker Tilly logo assets
import logoCharcoal from "../../../assets/Logo_Bakertilly/Baker Tilly Growth Symbol Charcoal.png";
import logoWhite from "../../../assets/Logo_Bakertilly/Baker Tilly Growth Symbol White.png";

interface UpdateIssueStatusModalProps {
  isOpen: boolean;
  issue: IssueResponse | null;
  onClose: () => void;
  onSuccess: (issue: IssueResponse) => void;
}

export default function UpdateIssueStatusModal({ isOpen, issue, onClose, onSuccess }: UpdateIssueStatusModalProps) {
  const { theme } = useTheme();

  const {
    reset,
    setValue,
    watch,
    formState: { errors },
    loading,
    errorMsg,
    handleSubmit,
    handleClose: baseHandleClose,
  } = useUserForm<UpdateIssueFormValues>({
    schema: updateIssueSchema,
    defaultValues: {
      issueStatus: issue?.issueStatus || "OPEN",
      remark: issue?.remark || "",
    },
    onSubmit: async (data) => {
      if (!issue) throw new Error("No issue selected");
      return updateIssueApi(issue.id, data);
    },
    onSuccess: (updatedIssue) => {
      onSuccess(updatedIssue);
      onClose();
    },
    onClose,
    successMessage: "Issue status updated successfully!",
  });

  useEffect(() => {
    if (isOpen && issue) {
      reset({
        issueStatus: issue.issueStatus,
        remark: issue.remark || "",
      });
    }
  }, [isOpen, issue, reset]);

  if (!isOpen || !issue) return null;

  const currentStatus = watch("issueStatus");

  const statusOptions = IssueStatusEnumValues.map((val) => {
    let label = toPascalCase(val);
    if (val === "CANT_RESOLVED") label = "Cannot Resolved";
    return { label, value: val };
  });

  return (
    <Modal
      isOpen={isOpen}
      onClose={baseHandleClose}
      maxWidth="max-w-[480px]"
    >
      <div className="flex flex-col gap-2">
        {/* Header - Logo & Title */}
        <div className="w-full flex items-center justify-center mb-2 pt-1">
          <img
            src={theme === "dark" ? logoWhite : logoCharcoal}
            alt="Logo"
            className="h-14 w-auto object-contain"
          />
          <div className="flex flex-col text-left">
            <h3 className="text-xl mt-2 font-bold tracking-tight text-[var(--text-main)] leading-none">Update Status</h3>
            <p className="text-[13px] text-[var(--text-muted)] mt-1.5 lowercase font-bold">
              maintenance workflow
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          <div className="border border-[var(--border-color)]/30 rounded-2xl p-4 bg-[var(--surface-hover)]/5 space-y-5">
            <div className="px-1 flex items-center gap-2">
              <RefreshCw size={16} className="text-[var(--color-growth-green)]" />
              <h3 className="text-sm font-bold text-[var(--text-main)]">Status Transition</h3>
            </div>

            <p className="text-xs text-[var(--text-muted)] px-1 leading-relaxed">
              Updating progress for <span className="font-bold text-[var(--text-main)]">{toPascalCase(issue.issueTitle)}</span> on <span className="font-bold text-[var(--text-main)]">{issue.deviceName}</span>.
            </p>

            {/* Status Dropdown */}
            <div className="space-y-2 px-1">
              <DropdownSelect
                label="Current Status *"
                options={statusOptions}
                value={currentStatus || ""}
                onChange={(val) => setValue("issueStatus", val as IssueStatusType, { shouldValidate: true })}
                className="w-full"
              />
              {errors.issueStatus && (
                <p className="text-[10px] text-red-500 ml-1 font-bold">{errors.issueStatus.message}</p>
              )}
            </div>

            {/* Remark */}
            <div className="space-y-2 px-1">
              <label className="block text-xs font-bold text-[var(--text-main)] mb-2 ml-1">
                Resolution / Progress Notes
              </label>
              <textarea
                onChange={(e) => setValue("remark", e.target.value)}
                value={watch("remark") || ""}
                className="w-full px-4 py-3 bg-[var(--bg)] border border-[var(--border-color)]/50 rounded-xl focus:outline-none focus:border-[var(--color-growth-green)] focus:ring-2 focus:ring-[var(--color-growth-green)]/20 text-xs text-[var(--text-main)] placeholder:text-[var(--text-muted)] transition-all duration-200 min-h-[100px] resize-none"
                placeholder="Describe current progress or resolution details..."
              />
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
              {loading ? <Loader2 size={16} className="animate-spin" /> : "Update Status"}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
