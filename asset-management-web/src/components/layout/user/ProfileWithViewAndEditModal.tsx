import { useState, useRef, useEffect } from "react";
import { Camera, X, User as UserIcon, Loader2, Pencil } from "lucide-react";
import { useAuthStore } from "../../../store/authStore";
import { updateProfileApi } from "../../../services/user.service";
import { getSafeImageUrl, createLocalPreviewUrl, revokeLocalPreviewUrl } from "../../../utils/image";
import { Modal } from "../../ui/Modal";
import { Button } from "../../ui/Button";
import { useTheme } from "../../../hooks/useTheme";
import { DropdownReverseList, type DropdownOption } from "../../ui/DropdownReverseList";

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

interface ProfileWithViewAndEditModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProfileWithViewAndEditModal = ({ isOpen, onClose }: ProfileWithViewAndEditModalProps) => {
  const { user, setAuth, token } = useAuthStore();
  const { theme } = useTheme();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Refs for click-outside detection
  const nameRowRef = useRef<HTMLDivElement>(null);
  const deptRowRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);

  const [editedName, setEditedName] = useState("");
  const [editedDept, setEditedDept] = useState("");
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingDept, setIsEditingDept] = useState(false);
  const [tempImage, setTempImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isImageDeleted, setIsImageDeleted] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && user) {
      setEditedName(user.username);
      setEditedDept((user as any).department || "");
      setTempImage(user.image || null);
      setSelectedFile(null);
      setIsImageDeleted(false);
      setIsEditingName(false);
      setIsEditingDept(false);
      setError(null);
    }
  }, [isOpen, user]);

  // Handle click outside to close editing modes
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (!user) return;

      // Don't close if clicking the footer/action buttons
      if (footerRef.current && footerRef.current.contains(target)) {
        return;
      }

      // If editing name, close if click is not in name row
      if (isEditingName && nameRowRef.current && !nameRowRef.current.contains(target)) {
        setEditedName(user.username);
        setIsEditingName(false);
      }

      // If editing dept, close if click is not in dept row
      if (isEditingDept && deptRowRef.current && !deptRowRef.current.contains(target)) {
        setEditedDept((user as any).department || "");
        setIsEditingDept(false);
      }
    };

    if (isEditingName || isEditingDept) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isEditingName, isEditingDept]);

  if (!user) return null;

  const handleUpdateProfile = async () => {
    setIsUpdating(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("username", editedName);
      formData.append("department", editedDept);
      formData.append("removeImage", String(isImageDeleted));
      
      if (selectedFile) {
        formData.append("image", selectedFile);
      }

      const data = await updateProfileApi(formData);
      if (token && user) setAuth(token, { ...user, ...data });
      setIsEditingName(false);
      setIsEditingDept(false);
      onClose();
      window.location.reload();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update profile");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleModalImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // 💡 High Performance 'URL Base Method':
      // Create a fast, local reference URL for immediate preview without reading the whole file yet.
      const localUrl = createLocalPreviewUrl(file);

      // Revoke the old preview URL if it exists to avoid memory leaks
      revokeLocalPreviewUrl(tempImage);

      setTempImage(localUrl);
      setSelectedFile(file);
      setIsImageDeleted(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col w-full max-w-md mx-auto p-2 gap-2">
        {/* Header - Logo on Right */}
        <div className="flex items-center justify-between mb-10 w-full px-2">
          <div className="flex flex-col gap-1">
            <h3 className="text-normal  font-black text-[var(--text-main)] tracking-tight">Account Settings</h3>
            <p className="text-xs text-[var(--text-muted)] font-medium">Manage your profile and personal information</p>
          </div>
          <img
            src={theme === "dark" ? logoWhite : logoCharcoal}
            alt="Logo"
            className="h-7 w-auto object-contain opacity-90"
          />
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-xs text-center">
            {error}
          </div>
        )}

        <div className="space-y-6 px-2">
          {/* Clean Avatar Section */}
          <div className="flex flex-col items-center">
            <div className="relative group">
              <div
                onClick={() => fileInputRef.current?.click()}
                className="w-32 h-32 rounded-full border-2 border-emerald-500 p-1.5 overflow-hidden ring-4 ring-emerald-500/5 transition-all cursor-pointer relative"
              >
                {tempImage ? (
                  <img src={getSafeImageUrl(tempImage)} alt="Profile" className="w-full h-full rounded-full object-cover" />
                ) : (
                  <div className="w-full h-full rounded-full bg-[var(--surface-hover)] flex items-center justify-center">
                    <UserIcon size={48} className="text-[var(--text-muted)]" />
                  </div>
                )}
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-[1px]">
                  <Camera size={24} className="text-white" />
                </div>
              </div>
              <div className="absolute bottom-1 right-1 w-8 h-8 bg-emerald-500 border-2 border-[var(--surface)] rounded-full flex items-center justify-center text-white shadow-md z-10 pointer-events-none">
                <Pencil size={14} />
              </div>
              {tempImage && (
                <button
                  onClick={(e) => { 
                    e.stopPropagation(); 
                    setTempImage(null); 
                    setSelectedFile(null);
                    setIsImageDeleted(true);
                  }}
                  className="absolute top-1 left-1 w-7 h-7 bg-[var(--surface)] border border-[var(--border-color)] rounded-full flex items-center justify-center text-[var(--text-muted)] hover:text-red-500 shadow-sm transition-colors z-20"
                >
                  <X size={16} />
                </button>
              )}
              <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleModalImageUpload} />
            </div>
          </div>

          {/* Form Content - Compact Grid */}
          <div className="divide-y divide-[var(--border-color)] border-t border-b border-[var(--border-color)]">
            {/* Username Row */}
            <div className="py-4 grid grid-cols-[120px_1fr] items-center group">
              <label className="text-sm [0.75rem] font-bold text-[var(--text-muted)]">Username</label>
              <div ref={nameRowRef} className="flex items-center justify-between gap-4 min-h-[36px]">
                {isEditingName ? (
                  <div className="w-full relative flex items-center">
                    <input
                      autoFocus
                      type="text"
                      value={editedName}
                      onChange={(e) => setEditedName(e.target.value)}
                      placeholder="Enter username"
                      className="w-full bg-[var(--surface-hover)] border border-emerald-500/50 rounded-lg px-3 py-1.5 text-sm font-semibold text-[var(--text-main)] outline-none focus:ring-2 focus:ring-emerald-500/5 transition-all"
                    />
                    <button
                      onClick={() => setIsEditingName(false)}
                      className="absolute right-2 p-1 text-emerald-500 hover:bg-emerald-500/10 rounded-md transition-colors"
                    >
                      <Pencil size={12} />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between w-full">
                    <span
                      className="text-xs font-bold text-[var(--text-main)] cursor-pointer hover:text-emerald-500 transition-colors"
                      onClick={() => {
                        setIsEditingName(true);
                        setIsEditingDept(false);
                      }}
                    >
                      {user.username}
                    </span>
                    <button
                      onClick={() => {
                        setIsEditingName(true);
                        setIsEditingDept(false);
                      }}
                      className="p-1.5 opacity-0 group-hover:opacity-100 text-[var(--text-muted)] hover:text-emerald-500 transition-all"
                    >
                      <Pencil size={14} />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Department Row */}
            <div className="py-4 grid grid-cols-[120px_1fr] items-center group">
              <label className="text-sm [0.75rem] font-bold text-[var(--text-muted)]">Department</label>
              <div ref={deptRowRef} className="flex items-center justify-between gap-4 min-h-[36px]">
                {isEditingDept ? (
                  <div className="w-full">
                    <DropdownReverseList
                      options={DEPARTMENTS}
                      value={editedDept}
                      onChange={(val) => setEditedDept(val)}
                      placeholder="Select department..."
                      className="w-full"
                    />
                  </div>
                ) : (
                  <div className="flex items-center justify-between w-full">
                    <span
                      className="text-xs font-medium text-[var(--text-main)] cursor-pointer hover:text-emerald-500 transition-colors"
                      onClick={() => {
                        setIsEditingDept(true);
                        setIsEditingName(false);
                      }}
                    >
                      {DEPARTMENTS.find(d => d.value === (user as any).department)?.label || (user as any).department || "Not specified"}
                    </span>
                    <button
                      onClick={() => {
                        setIsEditingDept(true);
                        setIsEditingName(false);
                      }}
                      className="p-1.5 opacity-0 group-hover:opacity-100 text-[var(--text-muted)] hover:text-emerald-500 transition-all"
                    >
                      <Pencil size={14} />
                    </button>
                  </div>
                )}
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
              className="px-7 py-2.5 rounded-lg text-xs font-bold shadow-lg shadow-emerald-500/10"
            >
              {isUpdating ? <Loader2 size={12} className="animate-spin" /> : "Save Changes"}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
