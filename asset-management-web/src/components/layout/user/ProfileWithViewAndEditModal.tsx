import { useEffect, useState } from "react";
import { Camera, X, User as UserIcon, Loader2, Pencil, Eye, EyeOff } from "lucide-react";
import { getSafeImageUrl } from "../../../utils/image";
import { Modal } from "../../ui/Modal";
import { Button } from "../../ui/Button";
import { Message } from "../../ui/Message";
import { useTheme } from "../../../hooks/useTheme";
import { DropdownReverseList, type DropdownOption } from "../../ui/DropdownReverseList";
import { useProfileUpdate } from "../../../hooks/useProfileUpdate";
import { ImageCropper } from "../../ui/ImageCropper";

// Baker Tilly logo assets
import logoCharcoal from "../../../assets/Logo_Bakertilly/Baker Tilly Logo_Charcoal.png";
import logoWhite from "../../../assets/Logo_Bakertilly/Baker Tilly Logo_White.png";

const DEPARTMENTS: DropdownOption[] = [
  { value: "OFFICE_ADMIN", label: "Office Admin" },
  { value: "TAX_ACCOUNTING_ADVISORY", label: "Tax & Accounting Advisory" },
  { value: "LEGAL_CORPORATE_ADVISORY", label: "Legal & Corporate Advisory" },
  { value: "AUDIT_ASSURANCE", label: "Audit & Assurance" },
  { value: "PRACTICE_DEVELOPMENT_MANAGEMENT", label: "Practice Development & Management" },
  { value: "CLIENT_OPERATION_MANAGEMENT", label: "Client & Operation Management" },
  { value: "FINANCE_HUMAN_RESOURCE", label: "Finance & Human Resource" },
  { value: "TECHNOLOGY_INNOVATION_DEVELOPMENT", label: "Technology Innovation and Development" },
];

const JOB_TITLE_OPTIONS: DropdownOption[] = [
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

interface ProfileWithViewAndEditModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProfileWithViewAndEditModal = ({ isOpen, onClose }: ProfileWithViewAndEditModalProps) => {
  const { theme } = useTheme();

  const {
    user,
    editedName,
    setEditedName,
    editedDept,
    setEditedDept,
    editedJobTitle,
    setEditedJobTitle,
    isEditing,
    setIsEditing,
    tempImage,
    handleImageUpload,
    handleRemoveImage,
    isUpdating,
    errorMsg,
    successMsg,
    handleUpdateProfile,
    fileInputRef,
    nameRowRef,
    deptRowRef,
    footerRef,
    resetForm,
    currentPassword,
    setCurrentPassword,
    newPassword,
    setNewPassword,
    pendingCropImage,
    setPendingCropImage,
    handleCropComplete,
  } = useProfileUpdate({ onClose });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  useEffect(() => {
    if (isOpen) {
      resetForm();
    }
  }, [isOpen, resetForm]);

  // Handle click outside to close editing mode
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (!user) return;

      // Don't close if clicking the footer/action buttons
      if (footerRef.current && footerRef.current.contains(target)) {
        return;
      }

      // If editing, close if click is not in any row
      if (isEditing) {
        const inNameRow = nameRowRef.current && nameRowRef.current.contains(target);
        const inDeptRow = deptRowRef.current && deptRowRef.current.contains(target);
        const inJobRow = document.getElementById('job-title-row')?.contains(target);

        if (!inNameRow && !inDeptRow && !inJobRow) {
          setEditedName(user.username);
          setEditedDept((user as any).department || "");
          if (setEditedJobTitle) setEditedJobTitle((user as any).jobTitle || "");
          setIsEditing(false);
        }
      }
    };

    if (isEditing) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isEditing, user, editedName, editedDept, setEditedName, setEditedDept, setIsEditing, footerRef, nameRowRef, deptRowRef]);

  if (!user) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col w-full max-w-md mx-auto p-2 gap-2">
        {/* Header - Logo on Right */}
        <div className="flex items-center justify-between mb-10 w-full px-2">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-[var(--text-main)] tracking-tight">Account Settings</h3>

            </div>
            <p className="text-xs text-[var(--text-muted)] font-medium">Manage your profile and personal information</p>
          </div>
          <img
            src={theme === "dark" ? logoWhite : logoCharcoal}
            alt="Logo"
            className="h-7 w-auto object-contain opacity-90"
          />
        </div>

        {errorMsg && (
          <div className="mb-4">
            <Message variant="error">{errorMsg}</Message>
          </div>
        )}

        {successMsg && (
          <div className="mb-4">
            <Message variant="success">{successMsg}</Message>
          </div>
        )}

        <div className="space-y-3 px-2">
          {/* Clean Avatar Section */}
          <div className="flex flex-col items-center">
            <div className="relative group">
              <div
                onClick={() => fileInputRef.current?.click()}
                className="w-32 h-32 rounded-full border-2 border-[var(--color-growth-green)] overflow-hidden ring-8 ring-[var(--color-growth-green)]/5 transition-all cursor-pointer relative"
              >
                {tempImage ? (
                  <img
                    src={getSafeImageUrl(tempImage)}
                    alt="Profile"
                    className="w-full h-full object-cover shadow-inner"
                  />
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
                  onClick={handleRemoveImage}
                  className="absolute top-1 left-1 w-7 h-7 bg-[var(--surface)] border border-[var(--border-color)] rounded-full flex items-center justify-center text-[var(--text-muted)] hover:text-red-500 shadow-sm transition-colors z-20"
                >
                  <X size={16} />
                </button>
              )}
              <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
            </div>
          </div>

          {/* Form Content - Clean Stack */}
          <div className="space-y-1">
            {/* Basic Info Section Title */}
            <div className="pt-2">
              <h3 className="text-sm font-bold text-[var(--text-main)]">Basic Information</h3>
              <div className="h-px bg-[var(--border-color)] w-full opacity-50 mt-2" />
            </div>

            {/* Username Row */}
            <div className="py-1.5 grid grid-cols-[120px_1fr] items-center group">
              <label className="text-xs font-bold text-[var(--text-main)]">Username</label>
              <div ref={nameRowRef} className="flex items-center justify-between gap-4 min-h-[36px]">
                {isEditing ? (
                  <div className="w-full relative flex items-center">
                    <input
                      autoFocus
                      type="text"
                      value={editedName}
                      onChange={(e) => setEditedName(e.target.value)}
                      placeholder="Enter username"
                      className="w-full bg-[var(--surface-hover)] border border-[var(--color-growth-green)]/50 rounded-lg px-3 py-1.5 text-[11px] font-semibold text-[var(--text-main)] outline-none focus:ring-2 focus:ring-[var(--color-growth-green)]/10 focus:border-[var(--color-growth-green)]/50 transition-all"
                    />
                    <div className="absolute right-2 p-1 text-[var(--color-growth-green)] opacity-50">
                      <Pencil size={12} />
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between w-full">
                    <span
                      className="text-[11px] font-bold text-[var(--text-main)] cursor-pointer hover:text-[var(--color-growth-green)] transition-colors"
                      onClick={() => setIsEditing(true)}
                    >
                      {user.username}
                    </span>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="p-1.5 opacity-0 group-hover:opacity-100 text-[var(--text-muted)] hover:text-[var(--color-growth-green)] transition-all font-semibold"
                    >
                      <Pencil size={14} />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Department Row */}
            <div className="py-1.5 grid grid-cols-[120px_1fr] items-center group">
              <label className="text-xs font-bold text-[var(--text-main)]">Department</label>
              <div ref={deptRowRef} className="flex items-center justify-between gap-4 min-h-[36px]">
                {isEditing ? (
                  <div className="w-full">
                    <DropdownReverseList
                      options={DEPARTMENTS}
                      value={editedDept}
                      onChange={(val) => setEditedDept(val)}
                      placeholder="Select department..."
                      className="w-full font-semibold"
                      panelClassName="bg-[var(--bg)]"
                      triggerClassName="border-[var(--color-growth-green)]/50 focus:border-[var(--color-growth-green)]"
                    />
                  </div>
                ) : (
                  <div className="flex items-center justify-between w-full">
                    <span
                      className="text-[11px] font-medium text-[var(--text-main)] cursor-pointer hover:text-[var(--color-growth-green)] transition-colors"
                      onClick={() => setIsEditing(true)}
                    >
                      {DEPARTMENTS.find(d => d.value === (user as any).department)?.label || (user as any).department || "Not specified"}
                    </span>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="p-1.5 opacity-0 group-hover:opacity-100 text-[var(--text-muted)] hover:text-[var(--color-growth-green)] transition-all"
                    >
                      <Pencil size={14} />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Job Title Row */}
            <div id="job-title-row" className="py-1.5 grid grid-cols-[120px_1fr] items-center group">
              <label className="text-xs font-bold text-[var(--text-main)]">Job Title</label>
              <div className="flex items-center justify-between gap-4 min-h-[36px]">
                {isEditing ? (
                  <div className="w-full">
                    <DropdownReverseList
                      options={JOB_TITLE_OPTIONS}
                      value={editedJobTitle || ""}
                      onChange={(val) => setEditedJobTitle && setEditedJobTitle(val)}
                      placeholder="Select job title..."
                      className="w-full font-semibold"
                      panelClassName="bg-[var(--bg)]"
                      triggerClassName="border-[var(--color-growth-green)]/50 focus:border-[var(--color-growth-green)]"
                    />
                  </div>
                ) : (
                  <div className="flex items-center justify-between w-full">
                    <span
                      className="text-[11px] font-medium text-[var(--text-main)] cursor-pointer hover:text-[var(--color-growth-green)] transition-colors"
                      onClick={() => setIsEditing(true)}
                    >
                      {JOB_TITLE_OPTIONS.find(j => j.value === (user as any).jobTitle)?.label || (user as any).jobTitle || "Not specified"}
                    </span>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="p-1.5 opacity-0 group-hover:opacity-100 text-[var(--text-muted)] hover:text-[var(--color-growth-green)] transition-all"
                    >
                      <Pencil size={14} />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Password Section Title */}
            <div className="pt-3">
              <h3 className="text-sm font-bold text-[var(--text-main)] px-1">Security Settings</h3>
              <div className="h-px bg-[var(--border-color)] w-full opacity-50 mt-2" />
            </div>

            {/* Current Password Row */}
            <div className="py-1.5 grid grid-cols-[120px_1fr] items-center group">
              <label className="text-xs font-bold text-[var(--text-main)]">Current Password</label>
              <div className="flex items-center justify-between gap-4 min-h-[36px]">
                <div className="w-full relative flex items-center">
                  <input
                    type={showCurrentPassword ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password"
                    className="w-full bg-[var(--surface-hover)] border border-[var(--border-color)] rounded-lg px-3 py-1.5 pr-10 text-[11px] font-semibold text-[var(--text-main)] outline-none focus:ring-2 focus:ring-[var(--color-growth-green)]/10 focus:border-[var(--color-growth-green)]/50 transition-all placeholder:text-[var(--text-muted)] placeholder:opacity-50"
                  />
                  {currentPassword && (
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute right-2 p-1 text-[var(--text-muted)] hover:text-[var(--color-growth-green)] transition-colors"
                    >
                      {showCurrentPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* New Password Row */}
            <div className="py-1.5 grid grid-cols-[120px_1fr] items-center group">
              <label className="text-xs font-bold text-[var(--text-main)]">New Password</label>
              <div className="flex items-center justify-between gap-4 min-h-[36px]">
                <div className="w-full relative flex items-center">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    className="w-full bg-[var(--surface-hover)] border border-[var(--border-color)] rounded-lg px-3 py-1.5 pr-10 text-[11px] font-semibold text-[var(--text-main)] outline-none focus:ring-2 focus:ring-[var(--color-growth-green)]/10 focus:border-[var(--color-growth-green)]/50 transition-all placeholder:text-[var(--text-muted)] placeholder:opacity-50"
                  />
                  {newPassword && (
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-2 p-1 text-[var(--text-muted)] hover:text-[var(--color-growth-green)] transition-colors"
                    >
                      {showNewPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons - Scaled Down */}
          <div ref={footerRef} className="flex items-center justify-end gap-3 pt-2">
            <Button
              variant="outline"
              onClick={onClose}
              className="px-5 py-2.5 rounded-lg text-xs font-semibold"
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleUpdateProfile}
              disabled={isUpdating}
              className="px-7 py-2.5 rounded-lg text-xs font-bold shadow-lg shadow-[var(--color-growth-green)]/10"
            >
              {isUpdating ? <Loader2 size={12} className="animate-spin" /> : "Save Changes"}
            </Button>
          </div>
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
      </div>
    </Modal>
  );
};