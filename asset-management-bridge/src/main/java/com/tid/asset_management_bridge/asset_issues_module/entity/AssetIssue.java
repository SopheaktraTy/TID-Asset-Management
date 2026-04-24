package com.tid.asset_management_bridge.asset_issues_module.entity;

import com.tid.asset_management_bridge.asset_module.entity.Asset;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "asset_issues")
public class AssetIssue {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "asset_id", nullable = false)
    private Asset asset;

    @Enumerated(EnumType.STRING)
    @Column(name = "issue_title", nullable = false, length = 50)
    private IssueTitleEnum issueTitle;

    @Enumerated(EnumType.STRING)
    @Column(name = "issue_status", nullable = false, length = 50)
    private IssueStatusEnum issueStatus = IssueStatusEnum.OPEN;

    @Column(name = "reported_at", nullable = false, updatable = false)
    private LocalDateTime reportedAt;

    @Column(name = "resolved_at")
    private LocalDateTime resolvedAt;

    @Column(name = "remark", columnDefinition = "TEXT")
    private String remark;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    public void prePersist() {
        LocalDateTime now = LocalDateTime.now();
        this.createdAt = now;
        this.updatedAt = now;
        this.reportedAt = now;
        if (this.issueStatus == null) {
            this.issueStatus = IssueStatusEnum.OPEN;
        }
    }

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    // Getters and Setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Asset getAsset() {
        return asset;
    }

    public void setAsset(Asset asset) {
        this.asset = asset;
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

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
}
