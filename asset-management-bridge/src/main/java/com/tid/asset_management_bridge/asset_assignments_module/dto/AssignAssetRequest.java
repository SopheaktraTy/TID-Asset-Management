package com.tid.asset_management_bridge.asset_assignments_module.dto;


import com.tid.asset_management_bridge.asset_assignments_module.entity.DepartmentEnum;
import com.tid.asset_management_bridge.asset_assignments_module.entity.JobTitleEnum;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class AssignAssetRequest {

    @NotNull(message = "Asset ID is required")
    private Long assetId;

    @NotBlank(message = "Assigned To is required")
    private String assignedTo;

    private DepartmentEnum department;

    private JobTitleEnum jobTitle;

    private String assignedBy;

    private String notes;

    public Long getAssetId() {
        return assetId;
    }

    public void setAssetId(Long assetId) {
        this.assetId = assetId;
    }

    public String getAssignedTo() {
        return assignedTo;
    }

    public void setAssignedTo(String assignedTo) {
        this.assignedTo = assignedTo;
    }

    public DepartmentEnum getDepartment() {
        return department;
    }

    public void setDepartment(DepartmentEnum department) {
        this.department = department;
    }

    public JobTitleEnum getJobTitle() {
        return jobTitle;
    }

    public void setJobTitle(JobTitleEnum jobTitle) {
        this.jobTitle = jobTitle;
    }

    public String getAssignedBy() {
        return assignedBy;
    }

    public void setAssignedBy(String assignedBy) {
        this.assignedBy = assignedBy;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }
}
