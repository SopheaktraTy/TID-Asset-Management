package com.tid.asset_management_bridge.user_management_module.dto;

import com.tid.asset_management_bridge.auth_module.entity.ModuleEnum;
import com.tid.asset_management_bridge.auth_module.entity.PermissionEnum;
import jakarta.validation.constraints.NotNull;
import java.util.List;

public class AssignPermissionRequest {

    @NotNull(message = "Module is required")
    private ModuleEnum module;

    @NotNull(message = "Permissions list is required")
    private List<PermissionEnum> permissions;

    public ModuleEnum getModule() {
        return module;
    }

    public void setModule(ModuleEnum module) {
        this.module = module;
    }

    public List<PermissionEnum> getPermissions() {
        return permissions;
    }

    public void setPermissions(List<PermissionEnum> permissions) {
        this.permissions = permissions;
    }
}
