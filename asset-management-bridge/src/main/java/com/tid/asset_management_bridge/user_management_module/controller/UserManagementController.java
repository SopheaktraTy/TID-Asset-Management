package com.tid.asset_management_bridge.user_management_module.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import com.tid.asset_management_bridge.user_management_module.dto.AssignPermissionRequest;

import com.tid.asset_management_bridge.auth_module.dto.ProfileResponse;
import com.tid.asset_management_bridge.auth_module.entity.RoleEnum;
import com.tid.asset_management_bridge.user_management_module.service.UserService;
import java.util.List;

import org.springframework.lang.NonNull;

@RestController
@RequestMapping("/api/users")
public class UserManagementController {

    private final UserService userService;

    public UserManagementController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN')")
    public List<ProfileResponse> getAllUsers() {
        return userService.getAllUsers();
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN')")
    public ProfileResponse getUserById(@PathVariable @NonNull Long id) {
        return userService.getUserById(id);
    }

    @PatchMapping("/{id}/role")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<Void> updateUserRole(@PathVariable @NonNull Long id, @RequestParam @NonNull RoleEnum role) {
        userService.updateUserRole(id, role);
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<Void> updateUserStatus(@PathVariable @NonNull Long id,
            @RequestParam @NonNull Boolean isActive) {
        userService.updateUserStatus(id, isActive);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<Void> deleteUser(@PathVariable @NonNull Long id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/permissions")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<Void> assignPermissions(@PathVariable @NonNull Long id,
            @RequestBody @NonNull AssignPermissionRequest request) {
        userService.assignPermissions(id, request);
        return ResponseEntity.ok().build();
    }
}