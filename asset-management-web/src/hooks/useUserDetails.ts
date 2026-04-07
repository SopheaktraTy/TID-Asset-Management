import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getUserByIdApi } from "../services/userManagement.service";
import type { UserDto } from "../types/user.types";

export function useUserDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState<UserDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorDetails, setErrorDetails] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);

  const fetchUser = useCallback(async (isBackgroundRefresh = false) => {
    try {
      if (!isBackgroundRefresh) setLoading(true);
      if (!id) throw new Error("No user ID provided.");
      const data = await getUserByIdApi(Number(id));
      setUser(data);
    } catch (err: any) {
      if (!isBackgroundRefresh) {
        setErrorDetails(err?.response?.data?.message || err.message || "Failed to load user.");
      } else {
        console.error("Background refresh failed", err);
      }
    } finally {
      if (!isBackgroundRefresh) setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const handleBack = () => navigate("/users-management");
  const handleDeleteSuccess = () => navigate("/users-management");

  const handleUpdateSuccess = (updated: UserDto) => {
    setUser(updated);
    setIsEditModalOpen(false);
    fetchUser(true);
  };

  const handleResetSuccess = (updated: UserDto) => {
    setUser(updated);
    setIsResetModalOpen(false);
    fetchUser(true);
  };

  return {
    user,
    setUser,
    loading,
    errorDetails,
    isEditModalOpen,
    setIsEditModalOpen,
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    isResetModalOpen,
    setIsResetModalOpen,
    isDeleting,
    setIsDeleting,
    fetchUser,
    handleBack,
    handleDeleteSuccess,
    handleUpdateSuccess,
    handleResetSuccess,
  };
}
