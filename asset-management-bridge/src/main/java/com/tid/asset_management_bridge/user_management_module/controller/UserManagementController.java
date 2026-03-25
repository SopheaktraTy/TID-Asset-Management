package com.tid.asset_management_bridge.user_management_module.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import com.tid.asset_management_bridge.common.dto.ApiResponse;
import com.tid.asset_management_bridge.user_management_module.dto.AssignPermissionRequest;

import com.tid.asset_management_bridge.auth_module.dto.ProfileResponse;
import com.tid.asset_management_bridge.auth_module.entity.RoleEnum;
import com.tid.asset_management_bridge.user_management_module.service.UserService;
import java.util.List;

import com.tid.asset_management_bridge.user_management_module.dto.CreateUserRequest;
import jakarta.validation.Valid;

import org.springframework.lang.NonNull;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;

@RestController
@RequestMapping("/api/users")
@SecurityRequirement(name = "bearerAuth")
public class UserManagementController {

    private final UserService userService;

    public UserManagementController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<ProfileResponse>> createUser(@Valid @RequestBody @NonNull CreateUserRequest request) {
        return ResponseEntity.status(201).body(new ApiResponse<>(201, "User created successfully", userService.createUser(request)));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN')")
    public ResponseEntity<ApiResponse<List<ProfileResponse>>> getAllUsers() {
        return ResponseEntity.ok(new ApiResponse<>(200, "Users retrieved successfully", userService.getAllUsers()));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN')")
    public ResponseEntity<ApiResponse<ProfileResponse>> getUserById(@PathVariable @NonNull Long id) {
        return ResponseEntity.ok(new ApiResponse<>(200, "User retrieved successfully", userService.getUserById(id)));
    }

    @PatchMapping("/{id}/role")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<Void>> updateUserRole(@PathVariable @NonNull Long id, @RequestParam @NonNull RoleEnum role) {
        Long currentUserId = getAuthenticatedUserId();
        if (currentUserId.equals(id)) {
            throw new com.tid.asset_management_bridge.common.exception.ConflictException("You cannot change your own role.");
        }
        
        userService.updateUserRole(id, role);
        return ResponseEntity.ok(new ApiResponse<>(200, "User role updated successfully"));
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<Void>> updateUserStatus(@PathVariable @NonNull Long id,
            @RequestParam @NonNull Boolean isActive) {
        Long currentUserId = getAuthenticatedUserId();
        if (currentUserId.equals(id)) {
            throw new com.tid.asset_management_bridge.common.exception.ConflictException("You cannot manually change your own active status.");
        }
        
        userService.updateUserStatus(id, isActive);
        return ResponseEntity.ok(new ApiResponse<>(200, "User status updated successfully"));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteUser(@PathVariable @NonNull Long id) {
        Long currentUserId = getAuthenticatedUserId();
        if (currentUserId.equals(id)) {
            throw new com.tid.asset_management_bridge.common.exception.ConflictException("You cannot delete your own account.");
        }
        
        userService.deleteUser(id);
        return ResponseEntity.ok(new ApiResponse<>(200, "User deleted successfully"));
    }

    @PatchMapping("/{id}/permissions")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<Void>> assignPermissions(@PathVariable @NonNull Long id,
            @RequestBody @NonNull AssignPermissionRequest request) {
        Long currentUserId = getAuthenticatedUserId();
        if (currentUserId.equals(id)) {
            throw new com.tid.asset_management_bridge.common.exception.ConflictException("You cannot assign or modify your own permissions.");
        }
        
        userService.assignPermissions(id, request);
        return ResponseEntity.ok(new ApiResponse<>(200, "Permissions assigned successfully"));
    }

    @NonNull
    private Long getAuthenticatedUserId() {
        var authentication = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof com.tid.asset_management_bridge.auth_module.security.CustomUserDetails) {
            Long currentUserId = ((com.tid.asset_management_bridge.auth_module.security.CustomUserDetails) authentication.getPrincipal()).getUser().getId();
            if (currentUserId != null) {
                return currentUserId;
            }
        }
        throw new com.tid.asset_management_bridge.common.exception.ResourceNotFoundException("User not found or unauthenticated");
    }
}