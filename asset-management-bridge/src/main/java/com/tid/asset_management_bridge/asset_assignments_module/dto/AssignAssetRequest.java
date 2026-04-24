package com.tid.asset_management_bridge.asset_assignments_module.dto;

import jakarta.validation.constraints.NotBlank;

public class AssignAssetRequest {

    @NotBlank(message = "Employee Name is required")
    private String employeeName;

    private String remark;

    public String getEmployeeName() {
        return employeeName;
    }

    public void setEmployeeName(String employeeName) {
        this.employeeName = employeeName;
    }

    public String getRemark() {
        return remark;
    }

    public void setRemark(String remark) {
        this.remark = remark;
    }
}
