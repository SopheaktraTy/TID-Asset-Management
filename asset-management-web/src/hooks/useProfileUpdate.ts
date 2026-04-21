import { useState, useRef, useCallback } from "react";
import { useAuthStore } from "../store/authStore";
import { updateProfileApi } from "../services/user.service";
import { useImageUpload } from "./useImageUpload";

interface UseProfileUpdateOptions {
  onClose: () => void;
}

export function useProfileUpdate({ onClose }: UseProfileUpdateOptions) {
  const { user, setAuth, token } = useAuthStore();

  const [editedName, setEditedName] = useState("");
  const [editedDept, setEditedDept] = useState("");
  const [editedJobTitle, setEditedJobTitle] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  const [isUpdating, setIsUpdating] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const {
    tempImage,
    selectedFile,
    isImageDeleted,
    pendingCropImage,
    setPendingCropImage,
    fileInputRef,
    handleImageUpload,
    handleCropComplete,
    handleRemoveImage,
    resetImage,
  } = useImageUpload({
    initialImage: user?.image || null,
  });

  const nameRowRef = useRef<HTMLDivElement>(null);
  const deptRowRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);

  const resetForm = useCallback(() => {
    if (user) {
      setEditedName(user.username);
      setEditedDept((user as any).department || "");
      setEditedJobTitle((user as any).jobTitle || "");
      resetImage(user.image || null);
      setIsEditing(false);
      setErrorMsg(null);
      setSuccessMsg(null);
      setCurrentPassword("");
      setNewPassword("");
    }
  }, [user, resetImage]);


  const handleUpdateProfile = async () => {
    if (!user || !token) return;

    setIsUpdating(true);
    setErrorMsg(null);
    try {
      const formData = new FormData();
      formData.append("username", editedName);
      formData.append("department", editedDept);
      formData.append("jobTitle", editedJobTitle);
      formData.append("removeImage", String(isImageDeleted));

      if (newPassword) {
        formData.append("currentPassword", currentPassword);
        formData.append("newPassword", newPassword);
      }

      if (selectedFile) {
        formData.append("image", selectedFile, "profile.jpg");
      }

      const data = await updateProfileApi(formData);
      setAuth(token, { ...user, ...data });
      setSuccessMsg("Profile updated successfully!");

      setTimeout(() => {
        onClose();
        setSuccessMsg(null);
        window.location.reload();
      }, 2500);

    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || "Failed to update profile");
    } finally {
      setIsUpdating(false);
    }
  };

  return {
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
  };
}
