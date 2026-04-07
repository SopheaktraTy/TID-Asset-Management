import { useState } from "react";
import { useForm, type DefaultValues, type FieldValues, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

interface UseUserFormOptions<T extends FieldValues> {
  schema: z.ZodType<T, any, any>;
  defaultValues: DefaultValues<T>;
  onSubmit: (data: T) => Promise<any>;
  onSuccess?: (result: any) => void;
  onClose: () => void;
  successMessage?: string;
}

export function useUserForm<T extends FieldValues>({
  schema,
  defaultValues,
  onSubmit,
  onSuccess,
  onClose,
  successMessage = "Saved successfully!",
}: UseUserFormOptions<T>) {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const form = useForm<T>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const handleClose = () => {
    form.reset();
    setErrorMsg(null);
    setSuccessMsg(null);
    onClose();
  };

  const submitWrapper: SubmitHandler<T> = async (data) => {
    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);
    try {
      const result = await onSubmit(data);
      if (onSuccess) onSuccess(result);
      setSuccessMsg(successMessage);
      setTimeout(() => handleClose(), 1200);
    } catch (err: any) {
      setErrorMsg(
        err?.response?.data?.message || err.message || "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  };

  return {
    ...form,
    loading,
    errorMsg,
    successMsg,
    handleClose,
    handleSubmit: form.handleSubmit(submitWrapper),
    setErrorMsg,
    setSuccessMsg,
  };
}
