package com.tid.asset_management_bridge.auth_module.service;

import com.tid.asset_management_bridge.auth_module.dto.*;

import org.springframework.lang.NonNull;

public interface AuthService {
    LoginResponse login(LoginRequest request);

    void changePassword(@NonNull Long userId, ChangePasswordRequest request);

    LoginResponse updateProfile(@NonNull Long userId, UpdateProfileRequest request);

    void forgotPassword(ForgotPasswordRequest request);

    void resetPassword(ResetPasswordRequest request);

    ProfileResponse viewProfile(@NonNull Long userId);
}
