import axios from "axios";
import { getOrStartRefresh } from "./refreshLock";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:8080",
  withCredentials: true,
});

let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

function processQueue(error: unknown) {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve();
    }
  });
  failedQueue = [];
}

api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    const is401 = error.response?.status === 401;
    const isRetry = originalRequest._retry === true;
    const isRefreshEndpoint = originalRequest.url?.includes("/api/auth/refresh");
    const isAuthCheckEndpoint = originalRequest.url?.includes("/api/auth/view-profile");
    // Skip refresh for login — a 401 here means wrong credentials, not expired token.
    const isLoginEndpoint = originalRequest.url?.includes("/api/auth/signin") ||
      originalRequest.url?.includes("/api/auth/login");

    if (is401 && !isRetry && !isRefreshEndpoint && !isAuthCheckEndpoint && !isLoginEndpoint) {
      originalRequest._retry = true;
      // 🔄 Use shared lock: Wait for the single active refresh call to finish,
      // avoiding duplicate calls that would invalidate rotating refresh tokens.
      return new Promise((resolve, reject) => {
        failedQueue.push({
          resolve: () => resolve(api(originalRequest)),
          reject,
        });

        getOrStartRefresh()
          .then(() => processQueue(null))
          .catch(async (refreshError) => {
            processQueue(refreshError);
            const { useAuthStore } = await import("../store/authStore");
            useAuthStore.getState().clearAuth();
            reject(refreshError);
          });
      });
    }

    return Promise.reject(error);
  }
);
