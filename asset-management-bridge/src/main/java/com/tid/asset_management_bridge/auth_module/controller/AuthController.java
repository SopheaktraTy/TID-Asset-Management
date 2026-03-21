package com.tid.asset_management_bridge.auth_module.controller;

import com.tid.asset_management_bridge.auth_module.dto.*;
import com.tid.asset_management_bridge.auth_module.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import org.springframework.lang.NonNull;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public LoginResponse login(@Valid @RequestBody LoginRequest request) {
        return authService.login(request);
    }

    @PostMapping("/register")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ProfileResponse register(@Valid @RequestBody @NonNull RegisterRequest request) {
        return authService.register(request);
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(@RequestHeader("Authorization") String token) {
        // Strip out "Bearer "
        String actualToken = token.startsWith("Bearer ") ? token.substring(7) : token;
        authService.logout(actualToken);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/refresh-token")
    public LoginResponse refreshToken(@RequestBody String refreshToken) {
        return authService.refreshToken(refreshToken);
    }

    @PostMapping("/forgot-password")
    @ResponseStatus(HttpStatus.ACCEPTED)
    public void forgotPassword(@RequestBody LoginRequest request) {
        // Normally takes an email/username in a smaller request object. Re-using LoginRequest struct for identifier.
        authService.forgotPassword(request.getIdentifier());
    }

    // Normally you'd extract userId from the SecurityContext
    // For now, accepting it as a query param until Security is fully built.
    @PutMapping("/change-password")
    public ResponseEntity<Void> changePassword(@RequestParam @NonNull Long userId,
                                               @Valid @RequestBody ChangePasswordRequest request) {
        authService.changePassword(userId, request);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/update-profile")
    public ProfileResponse updateProfile(@RequestParam @NonNull Long userId,
                                         @RequestBody UpdateProfileRequest request) {
        return authService.updateProfile(userId, request);
    }

    @GetMapping("/view-profile")
    public ProfileResponse viewProfile(@RequestParam @NonNull Long userId) {
        return authService.viewProfile(userId);
    }
}
