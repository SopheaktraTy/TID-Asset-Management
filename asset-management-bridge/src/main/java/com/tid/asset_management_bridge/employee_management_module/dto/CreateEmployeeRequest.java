package com.tid.asset_management_bridge.employee_management_module.dto;

import com.tid.asset_management_bridge.auth_module.entity.DepartmentEnum;
import com.tid.asset_management_bridge.auth_module.entity.JobTitleEnum;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class CreateEmployeeRequest {

    @NotBlank(message = "Username is required")
    private String username;

    @NotNull(message = "Department is required")
    private DepartmentEnum department;

    @NotNull(message = "Job title is required")
    private JobTitleEnum jobTitle;

    private String image;

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public DepartmentEnum getDepartment() { return department; }
    public void setDepartment(DepartmentEnum department) { this.department = department; }

    public JobTitleEnum getJobTitle() { return jobTitle; }
    public void setJobTitle(JobTitleEnum jobTitle) { this.jobTitle = jobTitle; }

    public String getImage() { return image; }
    public void setImage(String image) { this.image = image; }
}
