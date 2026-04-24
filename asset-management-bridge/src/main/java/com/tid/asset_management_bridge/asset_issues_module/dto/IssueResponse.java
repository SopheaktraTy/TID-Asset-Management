package com.tid.asset_management_bridge.asset_issues_module.dto;

import com.tid.asset_management_bridge.asset_issues_module.entity.IssueStatusEnum;
import com.tid.asset_management_bridge.asset_issues_module.entity.IssueTitleEnum;

import java.time.LocalDateTime;

public class IssueResponse {

    private Long id;
    private Long assetId;
    private String assetTag;
    private String deviceName;
    private IssueTitleEnum issueTitle;
    private IssueStatusEnum issueStatus;
    private LocalDateTime reportedAt;
    private LocalDateTime resolvedAt;
    private String remark;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getAssetId() {
        return assetId;
    }

    public void setAssetId(Long assetId) {
        this.assetId = assetId;
    }

    public String getAssetTag() {
        return assetTag;
    }

    public void setAssetTag(String assetTag) {
        this.assetTag = assetTag;
    }

    public String getDeviceName() {
        return deviceName;
    }

    public void setDeviceName(String deviceName) {
        this.deviceName = deviceName;
    }

    public IssueTitleEnum getIssueTitle() {
        return issueTitle;
    }

    public void setIssueTitle(IssueTitleEnum issueTitle) {
        this.issueTitle = issueTitle;
    }

    public IssueStatusEnum getIssueStatus() {
        return issueStatus;
    }

    public void setIssueStatus(IssueStatusEnum issueStatus) {
        this.issueStatus = issueStatus;
    }

    public LocalDateTime getReportedAt() {
        return reportedAt;
    }

    public void setReportedAt(LocalDateTime reportedAt) {
        this.reportedAt = reportedAt;
    }

    public LocalDateTime getResolvedAt() {
        return resolvedAt;
    }

    public void setResolvedAt(LocalDateTime resolvedAt) {
        this.resolvedAt = resolvedAt;
    }

    public String getRemark() {
        return remark;
    }

    public void setRemark(String remark) {
        this.remark = remark;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
