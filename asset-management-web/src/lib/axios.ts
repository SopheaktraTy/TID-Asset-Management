import axios from "axios";
import { useAuthStore } from "../store/authStore";

export const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true,
});

api.interceptors.request.use((config) => {
    const token = useAuthStore.getState().token;
    if (token && !config.url?.includes("/api/auth/")) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        
        if (error.response?.status === 401 && !originalRequest._retry) {
            
            // Do not retry for actual login credential failures
            if (originalRequest.url?.includes("/api/auth/login") || originalRequest.url?.includes("/api/auth/refresh")) {
                return Promise.reject(error);
            }

            originalRequest._retry = true;
            
            try {
                // Try to get a new access token via refresh token cookie
                const refreshResponse = await api.post("/api/auth/refresh");
                
                // The backend responds with the same LoginResponse (token, user) structure
                const newToken = refreshResponse.data.data.token;
                const user = refreshResponse.data.data.user;
                
                // Update our global auth store
                useAuthStore.getState().setAuth(newToken, user);
                
                // Retry the original request that failed
                originalRequest.headers.Authorization = `Bearer ${newToken}`;
                return api(originalRequest);
                
            } catch (refreshError) {
                // If the refresh token request fails (e.g. cookie missing or expired) log them out
                useAuthStore.getState().clearAuth();
                window.location.href = "/login";
                return Promise.reject(refreshError);
            }
        }
        
        return Promise.reject(error);
    }
);