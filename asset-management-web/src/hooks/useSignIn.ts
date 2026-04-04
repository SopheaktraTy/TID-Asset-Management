import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { loginApi } from "../services/auth.service";
import type { SignInFormValues, LoginResponse, ApiErrorResponse } from "../types/auth.types";
import { useAuthStore } from "../store/authStore";
import { useNavigate } from "react-router-dom";

export const useSignIn = () => {
  const setAuth = useAuthStore((state) => state.setAuth);
  const navigate = useNavigate();

  return useMutation<LoginResponse, AxiosError<ApiErrorResponse>, SignInFormValues>({
    mutationFn: loginApi,
    onSuccess: (data) => {
      setAuth(data.token, data.user);
      navigate("/users-management");
    },
  });
};
