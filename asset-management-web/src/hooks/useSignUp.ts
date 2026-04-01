import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { signUpApi } from "../services/auth.service";
import type { SignUpFormValues, ApiErrorResponse } from "../types/auth.types";

export const useSignUp = () => {
  return useMutation<string, AxiosError<ApiErrorResponse>, SignUpFormValues>({
    mutationFn: signUpApi,
  });
};
