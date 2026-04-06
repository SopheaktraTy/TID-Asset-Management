import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X, Loader2, User as UserIcon } from "lucide-react";
import { z } from "zod";

import { useAuthStore } from "../../../store/authStore";
import { getProfileApi, updateProfileApi } from "../../../services/user.service";
import { Button } from "../../ui/Button";
import { Input } from "../../ui/AuthPlaceholder";
import { Message } from "../../ui/Message";

const profileSchema = z.object({
  username: z.string().min(1, "Username is required"),
  email: z.string().email("Invalid email format"),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ProfileModal({ isOpen, onClose }: ProfileModalProps) {
  const { user, setAuth, token } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
  });

  // Fetch true profile data when modal opens
  useEffect(() => {
    if (isOpen) {
      reset({
        username: user?.username || "",
        email: user?.email || "",
      });
      fetchProfile();
    }
  }, [isOpen, user, reset]);

  const fetchProfile = async () => {
    try {
      const data = await getProfileApi();
      reset({
        username: data.username,
        email: data.email,
      });
      // Optionally update the store
      if (token) setAuth(token, data);
    } catch {
      // Ignore initial load error
    }
  };

  if (!isOpen) return null;

  const handleClose = () => {
    setErrorMsg(null);
    setSuccessMsg(null);
    reset();
    onClose();
  };

  const onSubmit = async (data: ProfileFormValues) => {
    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const updatedProfile = await updateProfileApi({
        username: data.username,
        email: data.email,
      });
      if (token) setAuth(token, updatedProfile);
      setSuccessMsg("Profile updated successfully!");
    } catch (err: any) {
      setErrorMsg(
        err?.response?.data?.message || err.message || "Failed to update profile."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-[var(--surface)] w-full max-w-sm rounded-2xl shadow-xl overflow-hidden border border-[var(--border-color)]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border-color)]">
          <h2 className="text-lg font-semibold text-[var(--text-main)]">My Profile</h2>
          <button onClick={handleClose} className="p-1 rounded-full text-[var(--text-muted)] hover:bg-[var(--surface-hover)] transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="flex flex-col items-center mb-6">
            <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 border-2 border-[var(--color-growth-green)] flex items-center justify-center mb-3 overflow-hidden">
              {user?.image ? (
                <img src={user.image} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <UserIcon size={32} className="text-gray-400" />
              )}
            </div>
            <div className="text-center">
              <span className="inline-block px-2.5 py-1 text-xs font-semibold rounded-md bg-[var(--surface-hover)] text-[var(--text-main)] uppercase tracking-wider mb-1">
                {user?.role?.replace("_", " ") || "USER"}
              </span>
            </div>
          </div>

          {errorMsg && <Message variant="error" className="mb-4">{errorMsg}</Message>}
          {successMsg && <Message variant="success" className="mb-4">{successMsg}</Message>}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[var(--text-main)] mb-1">Username</label>
              <Input type="text" {...register("username")} />
              {errors.username && <p className="mt-1 text-xs text-red-500">{errors.username.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--text-main)] mb-1">Email</label>
              <Input type="email" {...register("email")} />
              {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
            </div>

            <div className="pt-4 flex gap-3">
              <Button type="button" variant="outline" className="flex-1" onClick={handleClose}>
                Close
              </Button>
              <Button type="submit" variant="primary" className="flex-1" disabled={loading}>
                {loading ? <Loader2 size={16} className="animate-spin" /> : "Save Changes"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
