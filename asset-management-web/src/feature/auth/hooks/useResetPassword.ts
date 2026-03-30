import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { resetPasswordApi } from "../api/auth.api";
import type { ApiErrorResponse } from "../types/auth.types";

export const useResetPassword = () => {
  return useMutation<
    string,
    AxiosError<ApiErrorResponse>,
    { token: string; newPassword: string }
  >({
    mutationFn: resetPasswordApi,
  });
};
