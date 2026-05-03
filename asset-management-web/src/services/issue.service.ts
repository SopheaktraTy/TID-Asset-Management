import { api } from "../lib/axios";
import type { ApiResponse } from "../types/auth.types";
import type {
    IssueResponse,
    ReportIssueFormValues,
    UpdateIssueFormValues,
} from "../types/issue.types";

const BASE = "/api";

export const reportIssueApi = async (
    assetId: number,
    data: ReportIssueFormValues
): Promise<IssueResponse> => {
    const response = await api.post<ApiResponse<IssueResponse>>(
        `${BASE}/assets/${assetId}/issues`,
        data
    );
    return response.data.data;
};

export const getAssetIssuesApi = async (
    assetId: number
): Promise<IssueResponse[]> => {
    const response = await api.get<ApiResponse<IssueResponse[]>>(
        `${BASE}/assets/${assetId}/issues`
    );
    return response.data.data;
};

export const updateIssueApi = async (
    issueId: number,
    data: UpdateIssueFormValues
): Promise<IssueResponse> => {
    const response = await api.put<ApiResponse<IssueResponse>>(
        `${BASE}/issues/${issueId}`,
        data
    );
    return response.data.data;
};

export const deleteIssueApi = async (
    issueId: number
): Promise<void> => {
    await api.delete(`${BASE}/issues/${issueId}`);
};
