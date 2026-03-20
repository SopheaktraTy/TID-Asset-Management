package com.tid.asset_management_bridge.asset_issues_module.service;

import com.tid.asset_management_bridge.asset_issues_module.dto.IssueResponse;
import com.tid.asset_management_bridge.asset_issues_module.dto.ReportIssueRequest;
import com.tid.asset_management_bridge.asset_issues_module.dto.UpdateIssueRequest;
import org.springframework.lang.NonNull;

import java.util.List;

public interface AssetIssueService {
    IssueResponse reportIssue(@NonNull Long assetId, ReportIssueRequest request);
    IssueResponse updateIssue(@NonNull Long issueId, UpdateIssueRequest request);
    List<IssueResponse> getIssuesByAsset(@NonNull Long assetId);
    void deleteIssue(@NonNull Long issueId);
}
