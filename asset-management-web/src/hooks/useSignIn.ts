import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { loginApi, viewProfileApi } from "../services/auth.service";
import type { SignInFormValues, LoginResponse, ApiErrorResponse } from "../types/auth.types";
import { useAuthStore } from "../store/authStore";
import { useNavigate } from "react-router-dom";

export const useSignIn = () => {
  const setAuth = useAuthStore((state) => state.setAuth);
  const navigate = useNavigate();

  return useMutation<LoginResponse, AxiosError<ApiErrorResponse>, SignInFormValues>({
    mutationFn: loginApi,
    onSuccess: async (data) => {
      try {
        const profile = await viewProfileApi();
        setAuth(data.token, profile);
        navigate("/users-management");
      } catch (error) {
        console.error("Failed to fetch user profile after login", error);
        // Optional: you could clearAuth or show an error toast here
      }
    },
  });
};
