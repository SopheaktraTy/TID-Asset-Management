package com.tid.asset_management_bridge.user_management_module.service;

import com.tid.asset_management_bridge.user_management_module.dto.UserResponse;
import org.springframework.lang.NonNull;
import java.util.List;

import com.tid.asset_management_bridge.user_management_module.dto.CreateUserRequest;

import com.tid.asset_management_bridge.user_management_module.dto.UpdateUserRequest;

public interface UserService {
    UserResponse createUser(@NonNull CreateUserRequest request);

    List<UserResponse> getAllUsers();

    UserResponse getUserById(@NonNull Long id);

    void deleteUser(@NonNull Long id);

    UserResponse updateUser(@NonNull Long id, @NonNull UpdateUserRequest request);

    void forceResetPassword(@NonNull Long id, @NonNull String newPassword);
}
