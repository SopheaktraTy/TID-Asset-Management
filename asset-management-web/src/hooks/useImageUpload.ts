import { useState, useRef, useCallback } from "react";
import { revokeLocalPreviewUrl, optimizeImage } from "../utils/image";

interface UseImageUploadOptions {
  initialImage?: string | null;
  onImageChange?: (file: File | Blob | null) => void;
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  aspect?: number;
}

export function useImageUpload({
  initialImage = null,
  onImageChange,
  maxWidth = 1024,
  maxHeight = 1024,
  quality = 0.9,
  aspect = 1,
}: UseImageUploadOptions = {}) {
  const [tempImage, setTempImage] = useState<string | null>(initialImage);
  const [selectedFile, setSelectedFile] = useState<File | Blob | null>(null);
  const [isImageDeleted, setIsImageDeleted] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [pendingCropImage, setPendingCropImage] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageFile = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) return;
    setPendingCropImage(URL.createObjectURL(file));
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleImageFile(file);
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => {
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleImageFile(file);
  };

  const handleCropComplete = useCallback(async (croppedBlob: Blob) => {
    // Optimize the cropped image
    const optimizedBlob = await optimizeImage(croppedBlob, maxWidth, maxHeight, quality);
    const localUrl = URL.createObjectURL(optimizedBlob);
    
    revokeLocalPreviewUrl(tempImage);
    setTempImage(localUrl);
    setSelectedFile(optimizedBlob);
    setIsImageDeleted(false);
    setPendingCropImage(null);
    
    if (onImageChange) onImageChange(optimizedBlob);
  }, [tempImage, maxWidth, maxHeight, quality, onImageChange]);

  const handleRemoveImage = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    revokeLocalPreviewUrl(tempImage);
    setTempImage(null);
    setSelectedFile(null);
    setIsImageDeleted(true);
    if (onImageChange) onImageChange(null);
  };

  const resetImage = useCallback((newInitialImage: string | null = null) => {
    revokeLocalPreviewUrl(tempImage);
    setTempImage(newInitialImage);
    setSelectedFile(null);
    setIsImageDeleted(false);
    setPendingCropImage(null);
  }, [tempImage]);

  return {
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
    isDragging,
    aspect,
    dragProps: {
      onDragOver,
      onDragLeave,
      onDrop,
    },
  };
}
