import axios from "axios";
import type { 
  EmployeeDto, 
  CreateEmployeeFormValues, 
  UpdateEmployeeFormValues 
} from "../types/employee.types";

const API_BASE_URL = "http://localhost:8080/api/employees";

const buildFormData = (employee: any, imageFile?: File | Blob | null) => {
  const formData = new FormData();
  formData.append(
    "employee",
    new Blob([JSON.stringify(employee)], { type: "application/json" })
  );
  if (imageFile) {
    formData.append("imageFile", imageFile);
  }
  return formData;
};

export const getAllEmployeesApi = async (): Promise<EmployeeDto[]> => {
  const response = await axios.get(`${API_BASE_URL}`);
  return response.data.data;
};

export const getEmployeeByIdApi = async (id: number): Promise<EmployeeDto> => {
  const response = await axios.get(`${API_BASE_URL}/${id}`);
  return response.data.data;
};

export const createEmployeeApi = async (
  employee: CreateEmployeeFormValues,
  imageFile?: File | Blob | null
): Promise<EmployeeDto> => {
  const formData = buildFormData(employee, imageFile);
  const response = await axios.post(API_BASE_URL, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data.data;
};

export const updateEmployeeApi = async (
  id: number,
  employee: UpdateEmployeeFormValues,
  imageFile?: File | Blob | null,
  removeImage: boolean = false
): Promise<EmployeeDto> => {
  const formData = buildFormData(employee, imageFile);
  const response = await axios.put(`${API_BASE_URL}/${id}`, formData, {
    params: { removeImage },
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data.data;
};

export const deleteEmployeeApi = async (id: number): Promise<void> => {
  await axios.delete(`${API_BASE_URL}/${id}`);
};
