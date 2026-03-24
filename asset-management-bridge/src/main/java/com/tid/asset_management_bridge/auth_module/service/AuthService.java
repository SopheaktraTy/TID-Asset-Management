package com.tid.asset_management_bridge.auth_module.service;

import com.tid.asset_management_bridge.auth_module.dto.*;

import org.springframework.lang.NonNull;

public interface AuthService {
    LoginResponse login(LoginRequest request);
    void logout(String token);
    LoginResponse refreshToken(String refreshToken); // Assuming a simple string or JSON request
    void forgotPassword(String identifier);
    void changePassword(@NonNull Long userId, ChangePasswordRequest request);
    ProfileResponse updateProfile(@NonNull Long userId, UpdateProfileRequest request);
    ProfileResponse viewProfile(@NonNull Long userId);
}
