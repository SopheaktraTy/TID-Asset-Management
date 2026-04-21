package com.tid.asset_management_bridge.user_management_module.dto;

import com.tid.asset_management_bridge.auth_module.entity.ModuleEnum;
import com.tid.asset_management_bridge.auth_module.entity.PermissionEnum;
import com.tid.asset_management_bridge.auth_module.entity.RoleEnum;
import com.tid.asset_management_bridge.auth_module.entity.DepartmentEnum;
import com.tid.asset_management_bridge.auth_module.entity.JobTitleEnum;
import jakarta.validation.constraints.Email;
import java.util.List;
import java.util.Map;

public class UpdateUserRequest {
    private String username;
    
    @Email(message = "Must be a valid email format")
    private String email;
    
    private RoleEnum role;
    
    private DepartmentEnum department;
    
    private JobTitleEnum jobTitle;
    
    private com.tid.asset_management_bridge.auth_module.entity.UserStatusEnum status;
    
    private Map<ModuleEnum, List<PermissionEnum>> permissions;

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public RoleEnum getRole() { return role; }
    public void setRole(RoleEnum role) { this.role = role; }

    public DepartmentEnum getDepartment() { return department; }
    public void setDepartment(DepartmentEnum department) { this.department = department; }

    public JobTitleEnum getJobTitle() { return jobTitle; }
    public void setJobTitle(JobTitleEnum jobTitle) { this.jobTitle = jobTitle; }

    public com.tid.asset_management_bridge.auth_module.entity.UserStatusEnum getStatus() { return status; }
    public void setStatus(com.tid.asset_management_bridge.auth_module.entity.UserStatusEnum status) { this.status = status; }

    public Map<ModuleEnum, List<PermissionEnum>> getPermissions() { return permissions; }
    public void setPermissions(Map<ModuleEnum, List<PermissionEnum>> permissions) { this.permissions = permissions; }
}
