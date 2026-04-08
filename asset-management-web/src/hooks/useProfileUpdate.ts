import { useState, useRef, useCallback } from "react";
import { useAuthStore } from "../store/authStore";
import { updateProfileApi } from "../services/user.service";
import { createLocalPreviewUrl, revokeLocalPreviewUrl, optimizeImage } from "../utils/image";

interface UseProfileUpdateOptions {
  onClose: () => void;
}

export function useProfileUpdate({ onClose }: UseProfileUpdateOptions) {
  const { user, setAuth, token } = useAuthStore();
  
  const [editedName, setEditedName] = useState("");
  const [editedDept, setEditedDept] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  
  const [tempImage, setTempImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isImageDeleted, setIsImageDeleted] = useState(false);
  
  const [isUpdating, setIsUpdating] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const nameRowRef = useRef<HTMLDivElement>(null);
  const deptRowRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);

  const resetForm = useCallback(() => {
    if (user) {
      setEditedName(user.username);
      setEditedDept((user as any).department || "");
      setTempImage(user.image || null);
      setSelectedFile(null);
      setIsImageDeleted(false);
      setIsEditing(false);
      setErrorMsg(null);
      setSuccessMsg(null);
      setCurrentPassword("");
      setNewPassword("");
    }
  }, [user]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const localUrl = createLocalPreviewUrl(file);
      revokeLocalPreviewUrl(tempImage);
      setTempImage(localUrl);
      setSelectedFile(file);
      setIsImageDeleted(false);
    }
  };

  const handleRemoveImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setTempImage(null);
    setSelectedFile(null);
    setIsImageDeleted(true);
  };

  const handleUpdateProfile = async () => {
    if (!user || !token) return;
    
    setIsUpdating(true);
    setErrorMsg(null);
    try {
      const formData = new FormData();
      formData.append("username", editedName);
      formData.append("department", editedDept);
      formData.append("removeImage", String(isImageDeleted));
      
      if (newPassword) {
        formData.append("currentPassword", currentPassword);
        formData.append("newPassword", newPassword);
      }
      
      if (selectedFile) {
        const optimizedBlob = await optimizeImage(selectedFile, 800, 800, 0.8);
        formData.append("image", optimizedBlob, "profile.jpg");
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
  };
}
