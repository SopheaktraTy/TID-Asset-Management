package com.tid.asset_management_bridge.user_management_module.dto;

import com.tid.asset_management_bridge.auth_module.entity.RoleEnum;
import com.tid.asset_management_bridge.auth_module.entity.JobTitleEnum;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class CreateUserRequest {

    @NotBlank(message = "Username is required")
    private String username;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    @NotBlank(message = "Password is required")
    @Size(min = 6, message = "Password must be at least 6 characters")
    private String password;

    @NotNull(message = "Role is required")
    private RoleEnum role;

    @NotNull(message = "Job Title is required")
    private JobTitleEnum jobTitle;

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public RoleEnum getRole() {
        return role;
    }

    public void setRole(RoleEnum role) {
        this.role = role;
    }

    public JobTitleEnum getJobTitle() {
        return jobTitle;
    }

    public void setJobTitle(JobTitleEnum jobTitle) {
        this.jobTitle = jobTitle;
    }

    private java.util.Map<com.tid.asset_management_bridge.auth_module.entity.ModuleEnum, java.util.List<com.tid.asset_management_bridge.auth_module.entity.PermissionEnum>> permissions;

    public java.util.Map<com.tid.asset_management_bridge.auth_module.entity.ModuleEnum, java.util.List<com.tid.asset_management_bridge.auth_module.entity.PermissionEnum>> getPermissions() {
        return permissions;
    }

    public void setPermissions(java.util.Map<com.tid.asset_management_bridge.auth_module.entity.ModuleEnum, java.util.List<com.tid.asset_management_bridge.auth_module.entity.PermissionEnum>> permissions) {
        this.permissions = permissions;
    }
}
