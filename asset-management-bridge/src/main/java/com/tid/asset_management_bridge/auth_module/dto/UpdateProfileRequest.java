package com.tid.asset_management_bridge.auth_module.dto;

import com.tid.asset_management_bridge.auth_module.entity.DepartmentEnum;

public class UpdateProfileRequest {
    private String username;
    private DepartmentEnum department;
    private String image;

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public DepartmentEnum getDepartment() { return department; }
    public void setDepartment(DepartmentEnum department) { this.department = department; }
    public String getImage() { return image; }
    public void setImage(String image) { this.image = image; }
}
