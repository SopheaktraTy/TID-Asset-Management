import { useEffect } from "react";
import { Loader2, Edit3 } from "lucide-react";

import { Button } from "../../ui/Button";
import { Message } from "../../ui/Message";
import { Modal } from "../../ui/Modal";
import { DropdownSelect } from "../../ui/DropdownSelect";
import { useUserForm } from "../../../hooks/useUserForm";
import { useTheme } from "../../../hooks/useTheme";
import type {
  UpdateIssueFormValues,
  IssueResponse,
  IssueTitleType,
} from "../../../types/issue.types";
import {
  updateIssueSchema,
  IssueTitleEnumValues,
} from "../../../types/issue.types";
import { updateIssueApi } from "../../../services/issue.service";
import { toPascalCase } from "../../../utils/format";

// Baker Tilly logo assets
import logoCharcoal from "../../../assets/Logo_Bakertilly/Baker Tilly Growth Symbol Charcoal.png";
import logoWhite from "../../../assets/Logo_Bakertilly/Baker Tilly Growth Symbol White.png";

interface EditIssueModalProps {
  isOpen: boolean;
  issue: IssueResponse | null;
  onClose: () => void;
  onSuccess: (issue: IssueResponse) => void;
}

export default function EditIssueModal({ isOpen, issue, onClose, onSuccess }: EditIssueModalProps) {
  const { theme } = useTheme();

  const {
    register,
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
      issueTitle: issue?.issueTitle || "MALFUNCTION",
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
    successMessage: "Issue updated successfully!",
  });

  useEffect(() => {
    if (isOpen && issue) {
      reset({
        issueTitle: issue.issueTitle,
        remark: issue.remark || "",
      });
    }
  }, [isOpen, issue, reset]);

  if (!isOpen || !issue) return null;

  const currentTitle = watch("issueTitle");

  const titleOptions = IssueTitleEnumValues.map((val) => ({
    label: toPascalCase(val),
    value: val,
  }));

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
            <h3 className="text-xl mt-2 font-bold tracking-tight text-[var(--text-main)] leading-none">Update Issue</h3>
            <p className="text-[13px] text-[var(--text-muted)] mt-1.5 lowercase font-bold">
              manage report
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          <div className="border border-[var(--border-color)]/30 rounded-2xl p-4 bg-[var(--surface-hover)]/5 space-y-5">
            <div className="px-1 flex items-center gap-2">
              <Edit3 size={16} className="text-[var(--color-growth-green)]" />
              <h3 className="text-sm font-bold text-[var(--text-main)]">Issue Modification</h3>
            </div>

            <p className="text-xs text-[var(--text-muted)] px-1 leading-relaxed">
              Updating the details for the reported issue on <span className="font-bold text-[var(--text-main)]">{issue.deviceName}</span>.
            </p>

            {/* Status Dropdown */}
            <div className="space-y-2 px-1">
              <DropdownSelect
                label="Nature of Issue *"
                options={titleOptions}
                value={currentTitle || ""}
                onChange={(val) => setValue("issueTitle", val as IssueTitleType, { shouldValidate: true })}
                className="w-full"
              />
              {errors.issueTitle && (
                <p className="text-[10px] text-red-500 ml-1 font-bold">{errors.issueTitle.message}</p>
              )}
            </div>

            {/* Remark */}
            <div className="space-y-2 px-1">
              <label className="block text-xs font-bold text-[var(--text-main)] mb-2 ml-1">
                Description / Remarks
              </label>
              <textarea
                {...register("remark")}
                className="w-full px-4 py-3 bg-[var(--bg)] border border-[var(--border-color)]/50 rounded-xl focus:outline-none focus:border-[var(--color-growth-green)] focus:ring-2 focus:ring-[var(--color-growth-green)]/20 text-xs text-[var(--text-main)] placeholder:text-[var(--text-muted)] transition-all duration-200 min-h-[100px] resize-none"
                placeholder="Update the issue description or add remarks..."
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
              {loading ? <Loader2 size={16} className="animate-spin" /> : "Update Issue"}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
