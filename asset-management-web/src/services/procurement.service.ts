import { api } from "../lib/axios";
import type { ProcurementResponse, ProcurementFormValues } from "../types/procurement.types";

export const getAssetProcurementApi = async (assetId: number): Promise<ProcurementResponse> => {
  const response = await api.get(`/api/assets/${assetId}/procurement`);
  return response.data.data;
};

export const createAssetProcurementApi = async (assetId: number, data: ProcurementFormValues): Promise<ProcurementResponse> => {
  const response = await api.post(`/api/assets/${assetId}/procurement`, data);
  return response.data.data;
};

export const updateAssetProcurementApi = async (assetId: number, data: ProcurementFormValues): Promise<ProcurementResponse> => {
  const response = await api.patch(`/api/assets/${assetId}/procurement`, data);
  return response.data.data;
};

export const deleteAssetProcurementApi = async (assetId: number): Promise<void> => {
  await api.delete(`/api/assets/${assetId}/procurement`);
};
