import { api } from "../lib/axios";
import type { ApiResponse } from "../types/auth.types";
import type {
    AssignmentResponse,
    AssignAssetFormValues,
    ReturnAssetFormValues,
    UpdateAssignmentFormValues,
} from "../types/assignment.types";

const BASE = "/api";

export const assignAssetApi = async (
    assetId: number,
    data: AssignAssetFormValues
): Promise<AssignmentResponse> => {
    const response = await api.post<ApiResponse<AssignmentResponse>>(
        `${BASE}/assets/${assetId}/assignments`,
        data
    );
    return response.data.data;
};

export const returnAssetApi = async (
    assignmentId: number,
    data: ReturnAssetFormValues
): Promise<AssignmentResponse> => {
    const response = await api.post<ApiResponse<AssignmentResponse>>(
        `${BASE}/assignments/${assignmentId}/return`,
        data
    );
    return response.data.data;
};

export const getAssetAssignmentsApi = async (
    assetId: number
): Promise<AssignmentResponse[]> => {
    const response = await api.get<ApiResponse<AssignmentResponse[]>>(
        `${BASE}/assets/${assetId}/assignments`
    );
    return response.data.data;
};

export const updateAssignmentApi = async (
    assignmentId: number,
    data: UpdateAssignmentFormValues
): Promise<AssignmentResponse> => {
    const response = await api.put<ApiResponse<AssignmentResponse>>(
        `${BASE}/assignments/${assignmentId}`,
        data
    );
    return response.data.data;
};

export const deleteAssignmentApi = async (
    assignmentId: number
): Promise<void> => {
    await api.delete(`${BASE}/assignments/${assignmentId}`);
};
