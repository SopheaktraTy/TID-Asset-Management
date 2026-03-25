package com.tid.asset_management_bridge.auth_module.controller;

import com.tid.asset_management_bridge.auth_module.dto.*;
import com.tid.asset_management_bridge.auth_module.service.AuthService;
import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.tid.asset_management_bridge.common.dto.ApiResponse;
import org.springframework.lang.NonNull;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.security.SecurityRequirements;

@RestController
@RequestMapping("/api/auth")
@SecurityRequirement(name = "bearerAuth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    @SecurityRequirements() // Overrides the class-level Bearer token requirement
    public ResponseEntity<ApiResponse<LoginResponse>> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(new ApiResponse<>(200, "Login successful", authService.login(request)));
    }

    @PostMapping("/forgot-password")
    @SecurityRequirements() // Overrides the class-level Bearer token requirement
    public ResponseEntity<ApiResponse<Void>> forgotPassword(@RequestBody LoginRequest request) {
        // Normally takes an email/username in a smaller request object. Re-using
        // LoginRequest struct for identifier.
        authService.forgotPassword(request.getIdentifier());
        return ResponseEntity.accepted().body(new ApiResponse<>(202, "Password reset request accepted"));
    }

    @PutMapping("/change-password")
    public ResponseEntity<ApiResponse<Void>> changePassword(
            @Valid @RequestBody ChangePasswordRequest request) {
        Long userId = getAuthenticatedUserId();
        authService.changePassword(userId, request);
        return ResponseEntity.ok(new ApiResponse<>(200, "Password changed successfully"));
    }

    @PutMapping("/update-profile")
    public ResponseEntity<ApiResponse<LoginResponse>> updateProfile(
            @RequestBody UpdateProfileRequest request) {
        Long userId = getAuthenticatedUserId();
        return ResponseEntity
                .ok(new ApiResponse<>(200, "Profile updated successfully", authService.updateProfile(userId, request)));
    }

    @GetMapping("/view-profile")
    public ResponseEntity<ApiResponse<ProfileResponse>> viewProfile() {
        Long userId = getAuthenticatedUserId();
        return ResponseEntity
                .ok(new ApiResponse<>(200, "Profile retrieved successfully", authService.viewProfile(userId)));
    }

    @NonNull
    private Long getAuthenticatedUserId() {
        var authentication = org.springframework.security.core.context.SecurityContextHolder.getContext()
                .getAuthentication();
        if (authentication != null && authentication
                .getPrincipal() instanceof com.tid.asset_management_bridge.auth_module.security.CustomUserDetails) {
            Long id = ((com.tid.asset_management_bridge.auth_module.security.CustomUserDetails) authentication
                    .getPrincipal()).getUser().getId();
            if (id != null) {
                return id;
            }
        }
        throw new com.tid.asset_management_bridge.common.exception.ResourceNotFoundException(
                "User not found or unauthenticated");
    }
}
