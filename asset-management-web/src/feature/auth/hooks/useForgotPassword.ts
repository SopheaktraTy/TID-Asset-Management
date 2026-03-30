import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { forgotPasswordApi } from "../api/auth.api";
import type { ApiErrorResponse } from "../types/auth.types";

export const useForgotPassword = () => {
  return useMutation<
    string,
    AxiosError<ApiErrorResponse>,
    string
  >({
    mutationFn: forgotPasswordApi,
  });
};
