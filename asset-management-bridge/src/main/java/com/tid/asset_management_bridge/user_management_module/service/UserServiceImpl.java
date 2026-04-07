package com.tid.asset_management_bridge.user_management_module.service;

import com.tid.asset_management_bridge.user_management_module.dto.UserResponse;
import com.tid.asset_management_bridge.auth_module.entity.CustomPermission;
import com.tid.asset_management_bridge.auth_module.entity.RoleEnum;
import com.tid.asset_management_bridge.auth_module.entity.User;
import com.tid.asset_management_bridge.auth_module.entity.UserStatusEnum;
import com.tid.asset_management_bridge.auth_module.mapper.UserMapper;
import com.tid.asset_management_bridge.auth_module.repository.CustomPermissionRepository;
import com.tid.asset_management_bridge.auth_module.repository.UserRepository;
import com.tid.asset_management_bridge.common.exception.ResourceNotFoundException;
import com.tid.asset_management_bridge.common.exception.ConflictException;
import com.tid.asset_management_bridge.user_management_module.dto.AssignPermissionRequest;
import com.tid.asset_management_bridge.user_management_module.dto.CreateUserRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.lang.NonNull;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final CustomPermissionRepository customPermissionRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;

    public UserServiceImpl(UserRepository userRepository,
            CustomPermissionRepository customPermissionRepository,
            UserMapper userMapper,
            PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.customPermissionRepository = customPermissionRepository;
        this.userMapper = userMapper;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public UserResponse createUser(@NonNull CreateUserRequest request) {
        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            throw new ConflictException("Username is already taken");
        }
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new ConflictException("Email is already registered");
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setRole(request.getRole());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setStatus(UserStatusEnum.ACTIVE);

        User savedUser = userRepository.save(user);

        if (request.getPermissions() != null && !request.getPermissions().isEmpty()) {
            if (RoleEnum.SUPER_ADMIN.equals(request.getRole())) {
                throw new ConflictException(
                        "Users with the SUPER_ADMIN role already have all permissions. To set specific permissions, please create the user with a different role.");
            }

            for (java.util.Map.Entry<com.tid.asset_management_bridge.auth_module.entity.ModuleEnum, java.util.List<com.tid.asset_management_bridge.auth_module.entity.PermissionEnum>> entry : request
                    .getPermissions().entrySet()) {
                
                // Deduplicate at Java level before adding
                java.util.Set<com.tid.asset_management_bridge.auth_module.entity.PermissionEnum> uniquePerms = new java.util.LinkedHashSet<>(
                        entry.getValue());

                for (com.tid.asset_management_bridge.auth_module.entity.PermissionEnum perm : uniquePerms) {
                    CustomPermission customPermission = new CustomPermission();
                    customPermission.setUser(savedUser);
                    customPermission.setModule(entry.getKey());
                    customPermission.setPermission(perm);
                    customPermission = customPermissionRepository.save(customPermission);
                    if (savedUser.getPermissions() != null) {
                        savedUser.getPermissions().add(customPermission);
                    }
                }
            }
        }

        return userMapper.toUserResponse(savedUser);
    }

    @Override
    @Transactional(readOnly = true)
    public List<UserResponse> getAllUsers() {
        return userRepository.findAll().stream()
                .map(userMapper::toUserResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public UserResponse getUserById(@NonNull Long id) {
        User user = java.util.Objects.requireNonNull(userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id)));
        return userMapper.toUserResponse(user);
    }

    @Override
    @Transactional
    public void deleteUser(@NonNull Long id) {
        User user = java.util.Objects.requireNonNull(userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id)));
        userRepository.delete(user);
    }

    @Transactional
    private void assignPermissions(@NonNull Long userId, @NonNull AssignPermissionRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        if (RoleEnum.SUPER_ADMIN.equals(user.getRole())) {
            throw new ConflictException(
                    "Users with the SUPER_ADMIN role already have all permissions. To change permissions, please change the user's role first.");
        }

        if (request.getPermissions() != null) {
            for (java.util.Map.Entry<com.tid.asset_management_bridge.auth_module.entity.ModuleEnum, java.util.List<com.tid.asset_management_bridge.auth_module.entity.PermissionEnum>> entry : request
                    .getPermissions().entrySet()) {
                customPermissionRepository.deleteByUserIdAndModule(userId, entry.getKey());

                for (com.tid.asset_management_bridge.auth_module.entity.PermissionEnum perm : entry.getValue()) {
                    CustomPermission customPermission = new CustomPermission();
                    customPermission.setUser(user);
                    customPermission.setModule(entry.getKey());
                    customPermission.setPermission(perm);
                    customPermissionRepository.save(customPermission);
                }
            }
        }
    }

    @Override
    @Transactional
    public UserResponse updateUser(@NonNull Long id,
            @NonNull com.tid.asset_management_bridge.user_management_module.dto.UpdateUserRequest request) {
        User user = java.util.Objects.requireNonNull(userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id)));

        if (request.getUsername() != null && !request.getUsername().equals(user.getUsername())) {
            if (userRepository.findByUsername(request.getUsername()).isPresent()) {
                throw new ConflictException("Username is already taken");
            }
            user.setUsername(request.getUsername());
        }

        if (request.getEmail() != null && !request.getEmail().equals(user.getEmail())) {
            if (userRepository.findByEmail(request.getEmail()).isPresent()) {
                throw new ConflictException("Email is already registered");
            }
            user.setEmail(request.getEmail());
        }

        if (request.getRole() != null) {
            user.setRole(request.getRole());
        }

        if (request.getDepartment() != null) {
            user.setDepartment(request.getDepartment());
        }

        if (request.getStatus() != null) {
            user.setStatus(request.getStatus());
        }
        // Permissions: the frontend always sends this field.
        // Empty {} = "clear all permissions". Non-empty = replace with exact set.
        // SUPER_ADMIN users have inherent all-access, so skip silently.
        if (request.getPermissions() != null && !RoleEnum.SUPER_ADMIN.equals(user.getRole())) {

            // 1. Clear the entire collection — orphanRemoval will DELETE all existing rows.
            user.getPermissions().clear();

            // 2. Build the new unique permission set and add to the collection.
            for (java.util.Map.Entry<com.tid.asset_management_bridge.auth_module.entity.ModuleEnum, java.util.List<com.tid.asset_management_bridge.auth_module.entity.PermissionEnum>> entry : request
                    .getPermissions().entrySet()) {

                // Deduplicate at Java level before adding
                java.util.Set<com.tid.asset_management_bridge.auth_module.entity.PermissionEnum> uniquePerms = new java.util.LinkedHashSet<>(
                        entry.getValue());

                for (com.tid.asset_management_bridge.auth_module.entity.PermissionEnum perm : uniquePerms) {
                    CustomPermission cp = new CustomPermission();
                    cp.setUser(user);
                    cp.setModule(entry.getKey());
                    cp.setPermission(perm);
                    user.getPermissions().add(cp);
                }
            }
        }

        // Single save — Hibernate flushes the collection changes (DELETE orphans +
        // INSERT new)
        User saved = java.util.Objects.requireNonNull(userRepository.save(user));
        return userMapper.toUserResponse(saved);
    }

    @Override
    @Transactional
    public void forceResetPassword(@NonNull Long id, @NonNull String newPassword) {
        User user = java.util.Objects.requireNonNull(userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id)));
        user.setPasswordHash(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }
}
