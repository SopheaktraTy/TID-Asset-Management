import { useState, useRef, useCallback } from "react";
import { optimizeImage } from "../utils/image";

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
  const [pendingCropImage, setPendingCropImageState] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const tempImageRef = useRef<string | null>(initialImage);
  const pendingCropRef = useRef<string | null>(null);

  const handleImageFile = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) return;
    
    // Revoke previous pending if any
    if (pendingCropRef.current) {
      URL.revokeObjectURL(pendingCropRef.current);
    }
    
    const url = URL.createObjectURL(file);
    pendingCropRef.current = url;
    setPendingCropImageState(url);
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
    try {
      // Optimize the cropped image
      const optimizedBlob = await optimizeImage(croppedBlob, maxWidth, maxHeight, quality);
      const localUrl = URL.createObjectURL(optimizedBlob);
      
      // Revoke old preview
      if (tempImageRef.current && tempImageRef.current.startsWith("blob:")) {
        URL.revokeObjectURL(tempImageRef.current);
      }
      
      // Revoke pending crop image
      if (pendingCropRef.current) {
        URL.revokeObjectURL(pendingCropRef.current);
        pendingCropRef.current = null;
      }
      
      tempImageRef.current = localUrl;
      setTempImage(localUrl);
      setSelectedFile(optimizedBlob);
      setIsImageDeleted(false);
      setPendingCropImageState(null);
      
      if (onImageChange) onImageChange(optimizedBlob);
    } catch (error) {
      console.error("Error processing cropped image:", error);
      // Clean up even on error
      setPendingCropImageState(null);
      if (pendingCropRef.current) {
        URL.revokeObjectURL(pendingCropRef.current);
        pendingCropRef.current = null;
      }
    }
  }, [maxWidth, maxHeight, quality, onImageChange]);

  const handleRemoveImage = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    
    if (tempImageRef.current && tempImageRef.current.startsWith("blob:")) {
      URL.revokeObjectURL(tempImageRef.current);
    }
    
    tempImageRef.current = null;
    setTempImage(null);
    setSelectedFile(null);
    setIsImageDeleted(true);
    if (onImageChange) onImageChange(null);
  };

  const resetImage = useCallback((newInitialImage: string | null = null) => {
    if (tempImageRef.current && tempImageRef.current.startsWith("blob:")) {
      URL.revokeObjectURL(tempImageRef.current);
    }
    
    tempImageRef.current = newInitialImage;
    setTempImage(newInitialImage);
    setSelectedFile(null);
    setIsImageDeleted(false);
    
    if (pendingCropRef.current) {
      URL.revokeObjectURL(pendingCropRef.current);
      pendingCropRef.current = null;
    }
    setPendingCropImageState(null);
  }, []);

  return {
    tempImage,
    selectedFile,
    isImageDeleted,
    pendingCropImage,
    setPendingCropImage: useCallback((val: string | null) => {
      if (val === null && pendingCropRef.current) {
        URL.revokeObjectURL(pendingCropRef.current);
        pendingCropRef.current = null;
      }
      setPendingCropImageState(val);
    }, []),
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
