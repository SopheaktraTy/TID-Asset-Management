import { useEffect, useState } from "react";
import { Loader2, ClipboardList, Calendar } from "lucide-react";

import { Button } from "../../ui/Button";
import { SuggestionInput } from "../../ui/SuggestionInput";
import { Input } from "../../ui/BackgroundColorPlaceholder";
import { Message } from "../../ui/Message";
import { Modal } from "../../ui/Modal";
import { useUserForm } from "../../../hooks/useUserForm";
import { useTheme } from "../../../hooks/useTheme";
import type {
  UpdateAssignmentFormValues,
  AssignmentResponse,
} from "../../../types/assignment.types";
import {
  updateAssignmentSchema,
} from "../../../types/assignment.types";
import { updateAssignmentApi } from "../../../services/assignment.service";
import { getEmployeesApi } from "../../../services/employee.service";

// Baker Tilly logo assets
import logoCharcoal from "../../../assets/Logo_Bakertilly/Baker Tilly Growth Symbol Charcoal.png";
import logoWhite from "../../../assets/Logo_Bakertilly/Baker Tilly Growth Symbol White.png";

interface EditAssignmentModalProps {
  isOpen: boolean;
  assignment: AssignmentResponse | null;
  onClose: () => void;
  onSuccess: (assignment: AssignmentResponse) => void;
}

export default function EditAssignmentModal({ isOpen, assignment, onClose, onSuccess }: EditAssignmentModalProps) {
  const { theme } = useTheme();
  const [employeeNames, setEmployeeNames] = useState<string[]>([]);

  const {
    register,
    reset,
    setValue,
    formState: { errors },
    loading,
    errorMsg,
    handleSubmit,
    handleClose: baseHandleClose,
  } = useUserForm<UpdateAssignmentFormValues>({
    schema: updateAssignmentSchema,
    defaultValues: {
      employeeName: "",
      assignedDate: "",
      returnedDate: null,
      returnCondition: null,
      remark: "",
    },
    onSubmit: async (data) => {
      if (!assignment) throw new Error("No assignment selected");
      return updateAssignmentApi(assignment.id, data);
    },
    onSuccess: (updated) => {
      onSuccess(updated);
      onClose();
    },
    onClose,
    successMessage: "Assignment updated successfully!",
  });

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const result = await getEmployeesApi({ size: 1000 });
        setEmployeeNames(result.content.map(e => e.username));
      } catch (err) {
        console.error("Failed to fetch employees for suggestions", err);
      }
    };

    if (isOpen && assignment) {
      reset({
        employeeName: assignment.employee?.username || "",
        assignedDate: assignment.assignedDate ? assignment.assignedDate.split('T')[0] : "",
        returnedDate: assignment.returnedDate ? assignment.returnedDate.split('T')[0] : null,
        returnCondition: assignment.returnCondition || null,
        remark: assignment.remark || "",
      });
      fetchEmployees();
    }
  }, [isOpen, assignment, reset]);

  if (!isOpen || !assignment) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={baseHandleClose}
      maxWidth="max-w-[500px]"
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
            <h3 className="text-xl mt-2 font-bold tracking-tight text-[var(--text-main)] leading-none">Edit Record</h3>
            <p className="text-[13px] text-[var(--text-muted)] mt-1.5 lowercase font-bold">
              update assignment history
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          <div className="border border-[var(--border-color)]/30 rounded-2xl p-4 bg-[var(--surface-hover)]/5 space-y-5">
            <div className="px-1 flex items-center gap-2">
              <ClipboardList size={16} className="text-[var(--color-growth-green)]" />
              <h3 className="text-sm font-bold text-[var(--text-main)]">Assignment Details</h3>
            </div>

            {/* Employee Name */}
            <div className="space-y-2 px-1">
              <label className="block text-xs font-bold text-[var(--text-main)] mb-1 ml-1">
                Employee Name *
              </label>
              <SuggestionInput
                placeholder="Type or select employee"
                className="bg-[var(--bg)] border-[var(--border-color)]/50"
                suggestions={employeeNames}
                onSuggestionSelect={(val) => setValue("employeeName", val, { shouldValidate: true })}
                {...register("employeeName")}
              />
              {errors.employeeName && (
                <p className="text-[10px] text-red-500 ml-1 font-bold">{errors.employeeName.message}</p>
              )}
            </div>

            {/* Assigned Date */}
            <div className="space-y-2 px-1">
              <label className="block text-xs font-bold text-[var(--text-main)] mb-1 ml-1">
                Assigned Date *
              </label>
              <div className="relative">
                <Input
                  type="date"
                  className="bg-[var(--bg)] border-[var(--border-color)]/50 pr-10 cursor-pointer"
                  onClick={(e) => (e.target as HTMLInputElement).showPicker?.()}
                  {...register("assignedDate")}
                />
                <Calendar size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] pointer-events-none" />
              </div>
              {errors.assignedDate && (
                <p className="text-[10px] text-red-500 ml-1 font-bold">{errors.assignedDate.message}</p>
              )}
            </div>

            {/* If returned, allow editing return details */}
            {assignment.returnedDate && (
              <div className="space-y-5">

                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-[var(--text-main)] mb-1 ml-1">
                      Returned Date
                    </label>
                    <div className="relative">
                      <Input
                        type="date"
                        className="bg-[var(--bg)] border-[var(--border-color)]/50 pr-10 cursor-pointer"
                        onClick={(e) => (e.target as HTMLInputElement).showPicker?.()}
                        {...register("returnedDate")}
                      />
                      <Calendar size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] pointer-events-none" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-[var(--text-main)] mb-1 ml-1">
                      Return Condition
                    </label>
                    <textarea
                      {...register("returnCondition")}
                      className="w-full px-4 py-3 bg-[var(--bg)] border border-[var(--border-color)]/50 rounded-xl focus:outline-none focus:border-[var(--color-growth-green)] focus:ring-2 focus:ring-[var(--color-growth-green)]/20 text-xs text-[var(--text-main)] placeholder:text-[var(--text-muted)] transition-all duration-200 min-h-[80px] resize-none"
                      placeholder="e.g. Scratched screen, Battery issues..."
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Shared Remark */}
            <div className="space-y-2 px-1">
              <label className="block text-xs font-bold text-[var(--text-main)] mb-1 ml-1">
                Remark
              </label>
              <textarea
                {...register("remark")}
                className="w-full px-4 py-3 bg-[var(--bg)] border border-[var(--border-color)]/50 rounded-xl focus:outline-none focus:border-[var(--color-growth-green)] focus:ring-2 focus:ring-[var(--color-growth-green)]/20 text-xs text-[var(--text-main)] placeholder:text-[var(--text-muted)] transition-all duration-200 min-h-[80px] resize-none"
                placeholder="Add any additional remarks..."
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
              {loading ? <Loader2 size={16} className="animate-spin" /> : "Save Changes"}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
