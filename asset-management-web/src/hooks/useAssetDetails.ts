import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getAssetByIdApi } from "../services/asset.service";
import type { AssetDto } from "../types/asset.types";

export function useAssetDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [asset, setAsset] = useState<AssetDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorDetails, setErrorDetails] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const fetchAsset = useCallback(async (isBackgroundRefresh = false) => {
    try {
      if (!isBackgroundRefresh) setLoading(true);
      if (!id) throw new Error("No asset ID provided.");
      const data = await getAssetByIdApi(Number(id));
      setAsset(data);
    } catch (err: any) {
      if (!isBackgroundRefresh) {
        setErrorDetails(err?.response?.data?.message || err.message || "Failed to load asset.");
      } else {
        console.error("Background refresh failed", err);
      }
    } finally {
      if (!isBackgroundRefresh) setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchAsset();
  }, [fetchAsset]);

  const handleBack = () => navigate("/assets-management");
  const handleDeleteSuccess = () => navigate("/assets-management");

  const handleUpdateSuccess = (updated: AssetDto) => {
    setAsset(updated);
    setIsEditModalOpen(false);
    fetchAsset(true);
  };

  return {
    asset,
    setAsset,
    loading,
    errorDetails,
    isEditModalOpen,
    setIsEditModalOpen,
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    isDeleting,
    setIsDeleting,
    fetchAsset,
    handleBack,
    handleDeleteSuccess,
    handleUpdateSuccess,
  };
}
