package com.tid.asset_management_bridge.user_management_module.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import com.tid.asset_management_bridge.common.dto.ApiResponse;
import com.tid.asset_management_bridge.user_management_module.dto.UserResponse;
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
    public ResponseEntity<ApiResponse<UserResponse>> createUser(
            @Valid @RequestBody @NonNull CreateUserRequest request) {
        return ResponseEntity.status(201)
                .body(new ApiResponse<>(201, "User created successfully", userService.createUser(request)));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<List<UserResponse>>> getAllUsers() {
        return ResponseEntity.ok(new ApiResponse<>(200, "Users retrieved successfully", userService.getAllUsers()));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<UserResponse>> getUserById(@PathVariable @NonNull Long id) {
        return ResponseEntity.ok(new ApiResponse<>(200, "User retrieved successfully", userService.getUserById(id)));
    }





    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteUser(@PathVariable @NonNull Long id) {
        Long currentUserId = getAuthenticatedUserId();
        if (currentUserId.equals(id)) {
            throw new com.tid.asset_management_bridge.common.exception.ConflictException(
                    "You cannot delete your own account.");
        }

        userService.deleteUser(id);
        return ResponseEntity.ok(new ApiResponse<>(200, "User deleted successfully"));
    }



    @PatchMapping("/{id}")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<UserResponse>> updateUser(@PathVariable @NonNull Long id,
            @Valid @RequestBody @NonNull com.tid.asset_management_bridge.user_management_module.dto.UpdateUserRequest request) {
        Long currentUserId = getAuthenticatedUserId();
        if (currentUserId.equals(id)) {
            throw new com.tid.asset_management_bridge.common.exception.ConflictException(
                    "You cannot update your own profile through this endpoint.");
        }

        UserResponse updatedUser = userService.updateUser(id, request);
        return ResponseEntity.ok(new ApiResponse<>(200, "User profile updated successfully", updatedUser));
    }

    @PatchMapping("/{id}/force-reset-password")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<Void>> forceResetPassword(@PathVariable @NonNull Long id,
            @Valid @RequestBody com.tid.asset_management_bridge.user_management_module.dto.ForceResetPasswordRequest request) {
        Long currentUserId = getAuthenticatedUserId();
        if (currentUserId.equals(id)) {
            throw new com.tid.asset_management_bridge.common.exception.ConflictException(
                    "You cannot force reset your own password. Please use the standard change password flow.");
        }

        userService.forceResetPassword(id,
                java.util.Objects.requireNonNull(request.getNewPassword(), "Password must not be null"));
        return ResponseEntity.ok(new ApiResponse<>(200, "User password force-reset successfully"));
    }

    @NonNull
    private Long getAuthenticatedUserId() {
        var authentication = org.springframework.security.core.context.SecurityContextHolder.getContext()
                .getAuthentication();
        if (authentication != null && authentication
                .getPrincipal() instanceof com.tid.asset_management_bridge.auth_module.security.CustomUserDetails) {
            Long currentUserId = ((com.tid.asset_management_bridge.auth_module.security.CustomUserDetails) authentication
                    .getPrincipal()).getUser().getId();
            if (currentUserId != null) {
                return currentUserId;
            }
        }
        throw new com.tid.asset_management_bridge.common.exception.ResourceNotFoundException(
                "User not found or unauthenticated");
    }
}