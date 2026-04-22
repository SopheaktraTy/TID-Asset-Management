import { api } from "../lib/axios";
import type { ApiResponse } from "../types/auth.types";
import type { 
  EmployeeDto, 
  CreateEmployeeFormValues, 
  UpdateEmployeeFormValues,
  EmployeeQueryParams,
  PagedEmployeeResponse
} from "../types/employee.types";

/** Build a FormData payload for the "JSON + File" pattern. */
function buildFormData(data: Record<string, unknown>, imageFile?: File | Blob | null): FormData {
  const fd = new FormData();

  // Create a JSON Blob for the employee data part
  const jsonBlob = new Blob([JSON.stringify(data)], { type: "application/json" });
  fd.append("employee", jsonBlob);

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

const BASE = "/api/employees";

export const getEmployeesApi = async (
  params: EmployeeQueryParams
): Promise<PagedEmployeeResponse<EmployeeDto>> => {
  const response = await api.get<ApiResponse<EmployeeDto[]>>(BASE);
  let allEmployees = response.data.data || [];

  // 1. Filter
  if (params.search) {
    const s = params.search.toLowerCase();
    allEmployees = allEmployees.filter(
      (e) =>
        (e.username && e.username.toLowerCase().includes(s)) ||
        (e.department && e.department.toLowerCase().includes(s)) ||
        (e.jobTitle && e.jobTitle.toLowerCase().includes(s))
    );
  }
  if (params.department) {
    allEmployees = allEmployees.filter((e) => e.department === params.department);
  }
  if (params.jobTitle) {
    allEmployees = allEmployees.filter((e) => e.jobTitle === params.jobTitle);
  }

  // 2. Sort
  const sortBy = params.sortBy || "createdAt";
  const sortDir = params.sortDir || "desc";
  allEmployees.sort((a: any, b: any) => {
    const valA = a[sortBy] ?? "";
    const valB = b[sortBy] ?? "";
    if (valA < valB) return sortDir === "asc" ? -1 : 1;
    if (valA > valB) return sortDir === "asc" ? 1 : -1;
    return 0;
  });

  // 3. Paginate
  const page = params.page ?? 0;
  const size = params.size ?? 10;
  const totalElements = allEmployees.length;
  const totalPages = Math.ceil(totalElements / size);
  const content = allEmployees.slice(page * size, page * size + size);

  return {
    content,
    totalElements,
    totalPages,
    size,
    number: page,
  };
};

export const getEmployeeByIdApi = async (id: number): Promise<EmployeeDto> => {
  const response = await api.get<ApiResponse<EmployeeDto>>(`${BASE}/${id}`);
  return response.data.data;
};

export const createEmployeeApi = async (
  data: CreateEmployeeFormValues,
  imageFile?: File | Blob | null
): Promise<EmployeeDto> => {
  const payload: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(data)) {
    if (k === "image") continue;
    payload[k] = (typeof v === "string" && v.trim() === "") ? null : v;
  }

  const fd = buildFormData(payload, imageFile);
  const response = await api.post<ApiResponse<EmployeeDto>>(BASE, fd);
  return response.data.data;
};

export const updateEmployeeApi = async (
  id: number,
  data: UpdateEmployeeFormValues,
  imageFile?: File | Blob | null,
  removeImage?: boolean
): Promise<EmployeeDto> => {
  const payload: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(data)) {
    if (k === "image") continue;
    payload[k] = (typeof v === "string" && v.trim() === "") ? null : v;
  }

  const fd = buildFormData(payload, imageFile);
  if (removeImage) fd.append("removeImage", String(removeImage));

  const response = await api.patch<ApiResponse<EmployeeDto>>(`${BASE}/${id}`, fd);
  return response.data.data;
};

export const deleteEmployeeApi = async (id: number): Promise<void> => {
  await api.delete(`${BASE}/${id}`);
};
