package com.tid.asset_management_bridge.auth_module.dto;

import com.tid.asset_management_bridge.auth_module.entity.RoleEnum;

public class ProfileResponse {
    private Long id;
    private String username;
    private String email;
    private String image;
    private RoleEnum role;

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

    private java.util.Map<com.tid.asset_management_bridge.auth_module.entity.ModuleEnum, java.util.List<com.tid.asset_management_bridge.auth_module.entity.PermissionEnum>> permissions;

    public java.util.Map<com.tid.asset_management_bridge.auth_module.entity.ModuleEnum, java.util.List<com.tid.asset_management_bridge.auth_module.entity.PermissionEnum>> getPermissions() {
        return permissions;
    }

    public void setPermissions(java.util.Map<com.tid.asset_management_bridge.auth_module.entity.ModuleEnum, java.util.List<com.tid.asset_management_bridge.auth_module.entity.PermissionEnum>> permissions) {
        this.permissions = permissions;
    }
}
