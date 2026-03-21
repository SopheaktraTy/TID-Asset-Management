package com.tid.asset_management_bridge.user_management_module.service;

import com.tid.asset_management_bridge.auth_module.dto.ProfileResponse;
import com.tid.asset_management_bridge.auth_module.entity.CustomPermission;
import com.tid.asset_management_bridge.auth_module.entity.PermissionEnum;
import com.tid.asset_management_bridge.auth_module.entity.RoleEnum;
import com.tid.asset_management_bridge.auth_module.entity.User;
import com.tid.asset_management_bridge.auth_module.mapper.UserMapper;
import com.tid.asset_management_bridge.auth_module.repository.CustomPermissionRepository;
import com.tid.asset_management_bridge.auth_module.repository.UserRepository;
import com.tid.asset_management_bridge.common.exception.ResourceNotFoundException;
import com.tid.asset_management_bridge.user_management_module.dto.AssignPermissionRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.lang.NonNull;

import java.util.List;
import java.util.stream.Collectors;

@Service
@SuppressWarnings("null")
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final CustomPermissionRepository customPermissionRepository;
    private final UserMapper userMapper;

    public UserServiceImpl(UserRepository userRepository,
            CustomPermissionRepository customPermissionRepository,
            UserMapper userMapper) {
        this.userRepository = userRepository;
        this.customPermissionRepository = customPermissionRepository;
        this.userMapper = userMapper;
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProfileResponse> getAllUsers() {
        return userRepository.findAll().stream()
                .map(userMapper::toProfileResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public ProfileResponse getUserById(@NonNull Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        return userMapper.toProfileResponse(user);
    }

    @Override
    @Transactional
    public void updateUserRole(@NonNull Long id, @NonNull RoleEnum role) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        user.setRole(role);
        userRepository.save(user);
    }

    @Override
    @Transactional
    public void updateUserStatus(@NonNull Long id, @NonNull Boolean isActive) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        user.setIsActive(isActive);
        userRepository.save(user);
    }

    @Override
    @Transactional
    public void deleteUser(@NonNull Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        userRepository.delete(user);
    }

    @Override
    @Transactional
    public void assignPermissions(@NonNull Long userId, @NonNull AssignPermissionRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        // First, optionally clear existing permissions for the specific module to
        // prevent duplicates
        customPermissionRepository.deleteByUserIdAndModule(userId, request.getModule());

        // Then insert the provided permissions
        for (PermissionEnum perm : request.getPermissions()) {
            CustomPermission customPermission = new CustomPermission();
            customPermission.setUser(user);
            customPermission.setModule(request.getModule());
            customPermission.setPermission(perm);
            customPermissionRepository.save(customPermission);
        }
    }
}
