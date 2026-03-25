package com.tid.asset_management_bridge.asset_assignments_module.dto;

import com.tid.asset_management_bridge.asset_assignments_module.entity.DepartmentEnum;
import com.tid.asset_management_bridge.asset_assignments_module.entity.JobTitleEnum;
import jakarta.validation.constraints.NotBlank;

public class AssignAssetRequest {

    @NotBlank(message = "Assigned To is required")
    private String assignedTo;

    private DepartmentEnum department;

    private JobTitleEnum jobTitle;

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
}
