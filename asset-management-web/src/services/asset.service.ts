import { api } from "../lib/axios";
import type { ApiResponse } from "../types/auth.types";
import type {
  AssetDto,
  PagedAssetResponse,
  AssetQueryParams,
  CreateAssetFormValues,
  EditAssetFormValues,
} from "../types/asset.types";

const BASE = "/api/assets";

export const getAssetsApi = async (
  params: AssetQueryParams
): Promise<PagedAssetResponse<AssetDto>> => {
  const response = await api.get<ApiResponse<AssetDto[]>>(BASE);
  let allAssets = response.data.data || [];

  // 1. Filter
  if (params.search) {
    const s = params.search.toLowerCase();
    allAssets = allAssets.filter(
      (a) =>
        (a.assetTag && a.assetTag.toLowerCase().includes(s)) ||
        (a.deviceName && a.deviceName.toLowerCase().includes(s)) ||
        (a.serialNumber && a.serialNumber.toLowerCase().includes(s)) ||
        (a.manufacturer && a.manufacturer.toLowerCase().includes(s)) ||
        (a.model && a.model.toLowerCase().includes(s))
    );
  }
  if (params.status) {
    allAssets = allAssets.filter((a) => a.status === params.status);
  }
  if (params.deviceType) {
    allAssets = allAssets.filter((a) => a.deviceType === params.deviceType);
  }

  // 2. Sort
  const sortBy = params.sortBy || "createdAt";
  const sortDir = params.sortDir || "desc";
  allAssets.sort((a: any, b: any) => {
    const valA = a[sortBy] ?? "";
    const valB = b[sortBy] ?? "";
    if (valA < valB) return sortDir === "asc" ? -1 : 1;
    if (valA > valB) return sortDir === "asc" ? 1 : -1;
    return 0;
  });

  // 3. Paginate
  const page = params.page ?? 0;
  const size = params.size ?? 10;
  const totalElements = allAssets.length;
  const totalPages = Math.ceil(totalElements / size);
  const content = allAssets.slice(page * size, page * size + size);

  return {
    content,
    totalElements,
    totalPages,
    size,
    number: page,
  };
};

export const getAssetByIdApi = async (id: number): Promise<AssetDto> => {
  const response = await api.get<ApiResponse<AssetDto>>(`${BASE}/${id}`);
  return response.data.data;
};

export const createAssetApi = async (
  data: CreateAssetFormValues
): Promise<AssetDto> => {
  // Strip empty strings to null/undefined so backend validation passes
  const payload: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(data)) {
    if (v === "" || v === undefined) continue;
    payload[k] = v;
  }
  const response = await api.post<ApiResponse<AssetDto>>(BASE, payload);
  return response.data.data;
};

export const updateAssetApi = async (
  id: number,
  data: EditAssetFormValues
): Promise<AssetDto> => {
  const payload: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(data)) {
    if (v === "" || v === undefined) continue;
    payload[k] = v;
  }
  const response = await api.patch<ApiResponse<AssetDto>>(
    `${BASE}/${id}`,
    payload
  );
  return response.data.data;
};

export const deleteAssetApi = async (id: number): Promise<void> => {
  await api.delete(`${BASE}/${id}`);
};
