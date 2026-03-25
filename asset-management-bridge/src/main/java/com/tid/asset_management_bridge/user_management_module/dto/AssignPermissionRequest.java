package com.tid.asset_management_bridge.user_management_module.dto;

import com.tid.asset_management_bridge.auth_module.entity.ModuleEnum;
import com.tid.asset_management_bridge.auth_module.entity.PermissionEnum;
import jakarta.validation.constraints.NotNull;
import java.util.List;
import java.util.Map;

public class AssignPermissionRequest {

    @NotNull(message = "Permissions map is required")
    private Map<ModuleEnum, List<PermissionEnum>> permissions;

    public Map<ModuleEnum, List<PermissionEnum>> getPermissions() {
        return permissions;
    }

    public void setPermissions(Map<ModuleEnum, List<PermissionEnum>> permissions) {
        this.permissions = permissions;
    }
}
