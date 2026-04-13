import { api } from "../lib/axios";
import type { ApiResponse } from "../types/auth.types";
import type {
  AssetDto,
  PagedAssetResponse,
  AssetQueryParams,
  CreateAssetFormValues,
  EditAssetFormValues,
} from "../types/asset.types";

/** Build a FormData payload for the "JSON + File" pattern. */
function buildFormData(data: Record<string, unknown>, imageFile?: File | Blob | null): FormData {
  const fd = new FormData();

  // Create a JSON Blob for the asset data part
  const jsonBlob = new Blob([JSON.stringify(data)], { type: "application/json" });
  fd.append("asset", jsonBlob);

  if (imageFile) {
    // If it's a raw Blob (from optimizeImage), it might not have a name.
    // We provide a default name with .jpg extension so the backend can detect it.
    if (!(imageFile instanceof File)) {
      fd.append("imageFile", imageFile, "optimized-image.jpg");
    } else {
      fd.append("imageFile", imageFile);
    }
  }

  return fd;
}


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
  data: CreateAssetFormValues,
  imageFile?: File | Blob | null
): Promise<AssetDto> => {
  const payload: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(data)) {
    if (k === "image") continue;
    // Keep empty strings for required fields so backend validation triggers properly
    payload[k] = (v === undefined || v === null) ? null : v;
  }

  const fd = buildFormData(payload, imageFile);
  const response = await api.post<ApiResponse<AssetDto>>(BASE, fd);
  return response.data.data;
};

export const updateAssetApi = async (
  id: number,
  data: EditAssetFormValues,
  imageFile?: File | Blob | null,
  removeImage?: boolean
): Promise<AssetDto> => {
  const payload: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(data)) {
    if (k === "image") continue;
    payload[k] = (v === undefined || v === null) ? null : v;
  }

  const fd = buildFormData(payload, imageFile);
  if (removeImage) fd.append("removeImage", String(removeImage));

  const response = await api.patch<ApiResponse<AssetDto>>(`${BASE}/${id}`, fd);
  return response.data.data;
};

export const deleteAssetApi = async (id: number): Promise<void> => {
  await api.delete(`${BASE}/${id}`);
};
