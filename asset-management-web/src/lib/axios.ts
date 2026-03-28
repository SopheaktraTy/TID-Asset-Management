import axios from "axios";
import { useAuthStore } from "../store/authStore";

export const api = axios.create({
    // In dev: Vite proxy forwards /api/* → http://localhost:8080
    // In prod: set VITE_API_URL to your backend base URL
    baseURL: import.meta.env.VITE_API_URL ?? "",
});

api.interceptors.request.use((config) => {
    const token = useAuthStore.getState().token;

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});