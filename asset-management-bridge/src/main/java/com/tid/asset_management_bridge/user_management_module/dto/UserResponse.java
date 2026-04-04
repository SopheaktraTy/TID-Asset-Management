package com.tid.asset_management_bridge.user_management_module.dto;

import com.tid.asset_management_bridge.auth_module.entity.RoleEnum;
import com.tid.asset_management_bridge.auth_module.entity.DepartmentEnum;
import com.tid.asset_management_bridge.auth_module.entity.ModuleEnum;
import com.tid.asset_management_bridge.auth_module.entity.PermissionEnum;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

public class UserResponse {
    private Long id;
    private String username;
    private String email;
    private String image;
    private RoleEnum role;
    private DepartmentEnum department;
    private Boolean isActive;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Map<ModuleEnum, List<PermissionEnum>> permissions;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

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

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public RoleEnum getRole() {
        return role;
    }

    public void setRole(RoleEnum role) {
        this.role = role;
    }

    public DepartmentEnum getDepartment() {
        return department;
    }

    public void setDepartment(DepartmentEnum department) {
        this.department = department;
    }

    public Boolean getIsActive() {
        return isActive;
    }

    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public Map<ModuleEnum, List<PermissionEnum>> getPermissions() {
        return permissions;
    }

    public void setPermissions(Map<ModuleEnum, List<PermissionEnum>> permissions) {
        this.permissions = permissions;
    }
}
