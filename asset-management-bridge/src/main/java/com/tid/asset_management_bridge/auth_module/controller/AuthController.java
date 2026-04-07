package com.tid.asset_management_bridge.auth_module.controller;

import com.tid.asset_management_bridge.auth_module.dto.*;
import com.tid.asset_management_bridge.auth_module.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
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
    @SecurityRequirements()
    public ResponseEntity<ApiResponse<LoginResponse>> login(@Valid @RequestBody LoginRequest request,
            jakarta.servlet.http.HttpServletResponse response) {
        LoginResponse res = authService.login(request);

        // Access token: always short-lived (15 min), regardless of Remember Me
        int accessTokenMaxAge = 900;
        // Refresh token: 1 day without Remember Me, 30 days with Remember Me
        int refreshTokenMaxAge = res.isRememberMe() ? 30 * 24 * 60 * 60 : 24 * 60 * 60;

        org.springframework.http.ResponseCookie cookie = org.springframework.http.ResponseCookie
                .from("refresh_token", java.util.Objects.requireNonNull(res.getRefreshToken()))
                .httpOnly(true)
                .secure(false) // set to true if using HTTPS
                .path("/")
                .maxAge(refreshTokenMaxAge)
                .build();
        response.addHeader(org.springframework.http.HttpHeaders.SET_COOKIE, cookie.toString());

        org.springframework.http.ResponseCookie accessCookie = org.springframework.http.ResponseCookie
                .from("access_token", java.util.Objects.requireNonNull(res.getToken()))
                .httpOnly(true)
                .secure(false)
                .path("/")
                .maxAge(accessTokenMaxAge)
                .build();
        response.addHeader(org.springframework.http.HttpHeaders.SET_COOKIE, accessCookie.toString());

        return ResponseEntity.ok(new ApiResponse<>(200, "Login successful", res));
    }

    @PostMapping("/refresh")
    @SecurityRequirements()
    public ResponseEntity<ApiResponse<LoginResponse>> refresh(jakarta.servlet.http.HttpServletRequest request,
            jakarta.servlet.http.HttpServletResponse response) {
        return ResponseEntity
                .ok(new ApiResponse<>(200, "Token refreshed", authService.refreshToken(request, response)));
    }

    @PostMapping("/logout")
    @SecurityRequirements()
    public ResponseEntity<ApiResponse<Void>> logout(jakarta.servlet.http.HttpServletRequest request,
            jakarta.servlet.http.HttpServletResponse response) {
        authService.logout(request, response);
        return ResponseEntity.ok(new ApiResponse<>(200, "Logged out successfully"));
    }

    @PostMapping("/signup")
    @SecurityRequirements()
    public ResponseEntity<ApiResponse<Void>> signUp(@Valid @RequestBody SignUpRequest request) {
        authService.signUp(request);
        return ResponseEntity.ok(new ApiResponse<>(201, "Sign up successful. Pending admin approval."));
    }

    @PostMapping("/forgot-password")
    @SecurityRequirements()
    public ResponseEntity<ApiResponse<Void>> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        authService.forgotPassword(request);
        // Always return the same response for security (never reveal if email exists)
        return ResponseEntity.ok(new ApiResponse<>(200, "If that email is in our system, a reset link has been sent."));
    }

    @PostMapping("/reset-password")
    @SecurityRequirements()
    public ResponseEntity<ApiResponse<Void>> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        authService.resetPassword(request);
        return ResponseEntity.ok(new ApiResponse<>(200, "Password has been reset successfully."));
    }

    @PutMapping("/change-password")
    public ResponseEntity<ApiResponse<Void>> changePassword(
            @Valid @RequestBody ChangePasswordRequest request) {
        Long userId = getAuthenticatedUserId();
        authService.changePassword(userId, request);
        return ResponseEntity.ok(new ApiResponse<>(200, "Password changed successfully"));
    }

    @PutMapping(value = "/update-profile", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<ProfileResponse>> updateProfile(
            @RequestPart("username") String username,
            @RequestPart("department") String department,
            @RequestParam(value = "removeImage", defaultValue = "false") boolean removeImage,
            @RequestPart(value = "image", required = false) MultipartFile image) {
        Long userId = getAuthenticatedUserId();
        return ResponseEntity
                .ok(new ApiResponse<>(200, "Profile updated successfully", authService.updateProfile(userId, username, department, image, removeImage)));
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
