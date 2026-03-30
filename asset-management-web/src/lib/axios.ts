import axios from "axios";
import { useAuthStore } from "../store/authStore";

export const api = axios.create({
    // In dev: Vite proxy forwards /api/* → http://localhost:8080
    // In prod: set VITE_API_URL to your backend base URL
    baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.request.use((config) => {
    const token = useAuthStore.getState().token;

    // Do not attach token for authentication endpoints like login or forgot-password
    if (token && !config.url?.includes("/api/auth/")) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

// Intercept 401 Unauthorized responses to clear expired tokens
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Token is likely expired or invalid, auto-logout the user
            useAuthStore.getState().clearAuth();
            window.location.href = "/login";
        }
        return Promise.reject(error);
    }
);