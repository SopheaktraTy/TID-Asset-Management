package com.tid.asset_management_bridge.asset_issues_module.dto;

import com.tid.asset_management_bridge.asset_issues_module.entity.IssueTitleEnum;
import jakarta.validation.constraints.NotNull;

public class ReportIssueRequest {

    @NotNull(message = "Issue title is required")
    private IssueTitleEnum issueTitle;

    private String note;

    public IssueTitleEnum getIssueTitle() {
        return issueTitle;
    }

    public void setIssueTitle(IssueTitleEnum issueTitle) {
        this.issueTitle = issueTitle;
    }

    public String getNote() {
        return note;
    }

    public void setNote(String note) {
        this.note = note;
    }
}
