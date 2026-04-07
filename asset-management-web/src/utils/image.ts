/**
 * Utilities for image handling, focusing on the 'URL Path method'.
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

/**
 * Ensures an image source is a valid URL or blob preview string.
 * @param src The image source string from database or file selection
 * @returns A safe, absolute URL for <img> tags
 */
export const getSafeImageUrl = (src: string | null | undefined): string => {
  if (!src) return "";

  // 📁 URL Path Method Handling:
  // If the path starts with /uploads/, it's a server file.
  // We prefix it with the API base URL to generate the absolute static link.
  if (src.startsWith("/uploads/")) {
    return `${API_BASE_URL}${src}`;
  }

  // 🔗 Pre-existing full URLs (e.g. http://...)
  if (src.startsWith("http://") || src.startsWith("https://") || src.startsWith("blob:") || src.startsWith("data:")) {
    return src;
  }

  // 🖼️ Fallback for relative paths: assuming they might be server assets too
  if (src.startsWith("/") || src.endsWith(".png") || src.endsWith(".jpg") || src.endsWith(".jpeg") || src.endsWith(".gif") || src.endsWith(".svg")) {
      return `${API_BASE_URL}${src.startsWith("/") ? src : "/" + src}`;
  }

  return src;
};

/**
 * High-performance 'URL Base Method' (Blob Storage) for instant local previews.
 */
export const createLocalPreviewUrl = (file: File): string => {
  return URL.createObjectURL(file);
};

/**
 * Revokes a local blob preview URL to avoid browser memory leaks.
 */
export const revokeLocalPreviewUrl = (url: string | null | undefined) => {
  if (url && url.startsWith("blob:")) {
    try {
      URL.revokeObjectURL(url);
    } catch (e) {
      console.warn("Failed to revoke object URL", e);
    }
  }
};

/**
 * Optimizes an image before upload by resizing and compressing it.
 * Improves performance (small file size) and consistency (standard resolution).
 */
export const optimizeImage = (file: File, maxWidth = 800, maxHeight = 800, quality = 0.8): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const reader = new FileReader();

    reader.onload = (e) => {
      const url = e.target?.result as string;
      img.src = url;
    };

    img.onload = () => {
      let width = img.width;
      let height = img.height;

      // Keep aspect ratio
      if (width > height) {
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = Math.round((height * maxHeight) / height);
          height = maxHeight;
        }
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");
      if (!ctx) return reject(new Error("Failed to get canvas context"));

      // Higher quality scaling
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";

      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error("Canvas to Blob conversion failed"));
          }
        },
        "image/jpeg",
        quality
      );
    };

    img.onerror = () => reject(new Error("Image loading failed"));
    reader.onerror = () => reject(new Error("File reading failed"));
    reader.readAsDataURL(file);
  });
};
