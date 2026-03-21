package com.tid.asset_management_bridge.user_management_module.service;

import com.tid.asset_management_bridge.auth_module.dto.ProfileResponse;
import com.tid.asset_management_bridge.auth_module.entity.RoleEnum;
import com.tid.asset_management_bridge.user_management_module.dto.AssignPermissionRequest;
import org.springframework.lang.NonNull;
import java.util.List;

public interface UserService {
    List<ProfileResponse> getAllUsers();

    ProfileResponse getUserById(@NonNull Long id);

    void updateUserRole(@NonNull Long id, @NonNull RoleEnum role);

    void updateUserStatus(@NonNull Long id, @NonNull Boolean isActive);

    void deleteUser(@NonNull Long id);

    void assignPermissions(@NonNull Long userId, @NonNull AssignPermissionRequest request);
}
