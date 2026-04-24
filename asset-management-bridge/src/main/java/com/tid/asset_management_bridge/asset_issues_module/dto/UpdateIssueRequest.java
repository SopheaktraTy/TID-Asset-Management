package com.tid.asset_management_bridge.asset_issues_module.dto;

import com.tid.asset_management_bridge.asset_issues_module.entity.IssueStatusEnum;
import com.tid.asset_management_bridge.asset_issues_module.entity.IssueTitleEnum;

public class UpdateIssueRequest {

    private IssueTitleEnum issueTitle;

    private IssueStatusEnum issueStatus;

    private String remark;

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

    public String getRemark() {
        return remark;
    }

    public void setRemark(String remark) {
        this.remark = remark;
    }
}
