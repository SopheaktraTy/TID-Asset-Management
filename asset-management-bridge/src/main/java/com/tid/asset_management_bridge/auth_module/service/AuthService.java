package com.tid.asset_management_bridge.auth_module.service;

import com.tid.asset_management_bridge.auth_module.dto.*;

import org.springframework.lang.NonNull;

public interface AuthService {
    LoginResponse login(LoginRequest request);

    LoginResponse refreshToken(jakarta.servlet.http.HttpServletRequest request, jakarta.servlet.http.HttpServletResponse response);

    void logout(jakarta.servlet.http.HttpServletRequest request, jakarta.servlet.http.HttpServletResponse response);

    void signUp(SignUpRequest request);

    void changePassword(@NonNull Long userId, ChangePasswordRequest request);

    ProfileResponse updateProfile(@NonNull Long userId, String username, String department, String jobTitle, org.springframework.web.multipart.MultipartFile imageFile, boolean removeImage, String currentPassword, String newPassword);

    void forgotPassword(ForgotPasswordRequest request);

    void resetPassword(ResetPasswordRequest request);

    ProfileResponse viewProfile(@NonNull Long userId);
}
