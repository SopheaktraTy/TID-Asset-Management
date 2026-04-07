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
