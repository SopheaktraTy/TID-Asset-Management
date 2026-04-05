package com.tid.asset_management_bridge.auth_module.service;

import com.tid.asset_management_bridge.auth_module.dto.*;
import com.tid.asset_management_bridge.auth_module.entity.PasswordResetToken;
import com.tid.asset_management_bridge.auth_module.entity.User;
import com.tid.asset_management_bridge.auth_module.mapper.UserMapper;
import com.tid.asset_management_bridge.auth_module.repository.PasswordResetTokenRepository;
import com.tid.asset_management_bridge.auth_module.repository.UserRepository;
import com.tid.asset_management_bridge.auth_module.security.CustomUserDetails;
import com.tid.asset_management_bridge.auth_module.security.JwtUtil;
import com.tid.asset_management_bridge.common.exception.ConflictException;
import com.tid.asset_management_bridge.common.exception.ResourceNotFoundException;
import com.tid.asset_management_bridge.common.service.EmailService;

import org.springframework.lang.NonNull;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final UserMapper userMapper;
    private final PasswordResetTokenRepository passwordResetTokenRepository;
    private final EmailService emailService;
    private final RefreshTokenService refreshTokenService;

    public AuthServiceImpl(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtUtil jwtUtil,
            UserMapper userMapper,
            PasswordResetTokenRepository passwordResetTokenRepository,
            EmailService emailService,
            RefreshTokenService refreshTokenService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
        this.userMapper = userMapper;
        this.passwordResetTokenRepository = passwordResetTokenRepository;
        this.emailService = emailService;
        this.refreshTokenService = refreshTokenService;
    }

    @Override
    public LoginResponse login(LoginRequest request) {
        User user = userRepository
                .findByUsernameOrEmail(request.getIdentifier(), request.getIdentifier())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new BadCredentialsException("Incorrect password");
        }

        if (Boolean.FALSE.equals(user.getIsActive())) {
            throw new BadCredentialsException("Account is pending approval from super admin");
        }

        CustomUserDetails userDetails = new CustomUserDetails(user);
        boolean rememberMe = request.getRememberMe() != null && request.getRememberMe();
        String token = jwtUtil.generateToken(userDetails, rememberMe);
        
        com.tid.asset_management_bridge.auth_module.entity.RefreshToken refreshToken = refreshTokenService.createRefreshToken(java.util.Objects.requireNonNull(user.getId()), rememberMe);
        
        return new LoginResponse(token, user.getId(), refreshToken.getToken(), rememberMe);
    }

    @Override
    @Transactional
    public void logout(jakarta.servlet.http.HttpServletRequest request, jakarta.servlet.http.HttpServletResponse response) {
        // Delete only this session's refresh token (multi-device: other browsers stay logged in)
        if (request.getCookies() != null) {
            for (jakarta.servlet.http.Cookie cookie : request.getCookies()) {
                if ("refresh_token".equals(cookie.getName()) && cookie.getValue() != null) {
                    try {
                        refreshTokenService.deleteByToken(cookie.getValue());
                    } catch (com.tid.asset_management_bridge.common.exception.ResourceNotFoundException ignored) {
                        // Token already removed or never existed — that's fine
                    }
                    break;
                }
            }
        }

        // Expire both cookies immediately on the client
        org.springframework.http.ResponseCookie clearAccess = org.springframework.http.ResponseCookie
                .from("access_token", "")
                .httpOnly(true)
                .secure(false)
                .path("/")
                .maxAge(0)
                .build();
        org.springframework.http.ResponseCookie clearRefresh = org.springframework.http.ResponseCookie
                .from("refresh_token", "")
                .httpOnly(true)
                .secure(false)
                .path("/")
                .maxAge(0)
                .build();
        response.addHeader(org.springframework.http.HttpHeaders.SET_COOKIE, clearAccess.toString());
        response.addHeader(org.springframework.http.HttpHeaders.SET_COOKIE, clearRefresh.toString());
    }

    @Override
    @Transactional
    public LoginResponse refreshToken(jakarta.servlet.http.HttpServletRequest request, jakarta.servlet.http.HttpServletResponse response) {
        String token = null;
        if (request.getCookies() != null) {
            for (jakarta.servlet.http.Cookie cookie : request.getCookies()) {
                if ("refresh_token".equals(cookie.getName())) {
                    token = cookie.getValue();
                }
            }
        }
        
        if (token == null) {
            throw new com.tid.asset_management_bridge.common.exception.ResourceNotFoundException("Refresh token is missing from cookies");
        }

        com.tid.asset_management_bridge.auth_module.entity.RefreshToken rToken = refreshTokenService.findByToken(token);
        rToken = refreshTokenService.verifyExpiration(rToken);
        
        User user = rToken.getUser();
        // Detect whether this was a Remember Me session:
        // refresh tokens without Remember Me expire in 1 day, with Remember Me in 30 days.
        // Anything with more than 2 days left is a Remember Me token.
        boolean rememberMe = java.time.Duration.between(java.time.LocalDateTime.now(), rToken.getExpiryDate()).toDays() > 2;

        refreshTokenService.delete(rToken);
        
        CustomUserDetails userDetails = new CustomUserDetails(user);
        String newAccessToken = jwtUtil.generateToken(userDetails, rememberMe);
        
        com.tid.asset_management_bridge.auth_module.entity.RefreshToken newRefreshToken = refreshTokenService.createRefreshToken(java.util.Objects.requireNonNull(user.getId()), rememberMe);
        
        // Access token: always short-lived (15 min), regardless of Remember Me
        int accessTokenMaxAge = 900;
        // Refresh token: 1 day without Remember Me, 30 days with Remember Me
        int refreshTokenMaxAge = rememberMe ? 30 * 24 * 60 * 60 : 24 * 60 * 60;
        
        org.springframework.http.ResponseCookie cookie = org.springframework.http.ResponseCookie.from("refresh_token", java.util.Objects.requireNonNull(newRefreshToken.getToken()))
                .httpOnly(true)
                .secure(false) 
                .path("/")
                .maxAge(refreshTokenMaxAge)
                .build();
        response.addHeader(org.springframework.http.HttpHeaders.SET_COOKIE, cookie.toString());

        org.springframework.http.ResponseCookie accessCookie = org.springframework.http.ResponseCookie.from("access_token", java.util.Objects.requireNonNull(newAccessToken))
                .httpOnly(true)
                .secure(false)
                .path("/")
                .maxAge(accessTokenMaxAge)
                .build();
        response.addHeader(org.springframework.http.HttpHeaders.SET_COOKIE, accessCookie.toString());
        
        return new LoginResponse(newAccessToken, user.getId(), newRefreshToken.getToken(), rememberMe);
    }

    @Override
    @Transactional
    public void signUp(SignUpRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new ConflictException("Email is already registered");
        }
        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            throw new ConflictException("Username is already taken");
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setDepartment(request.getDepartment());
        user.setRole(com.tid.asset_management_bridge.auth_module.entity.RoleEnum.ADMIN);
        // User needs to be approved by SUPER_ADMIN, so set isActive to false
        user.setIsActive(false);

        userRepository.save(user);
    }

    @Override
    @Transactional
    public void changePassword(@NonNull Long userId, ChangePasswordRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPasswordHash())) {
            throw new BadCredentialsException("Current password is incorrect");
        }

        if (passwordEncoder.matches(request.getNewPassword(), user.getPasswordHash())) {
            throw new ConflictException("New password must be different from the current password");
        }

        user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }

    @Override
    @Transactional
    public LoginResponse updateProfile(@NonNull Long userId, UpdateProfileRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        userMapper.updateProfile(request, user);
        @SuppressWarnings("null")
        User savedUser = userRepository.save(user);

        CustomUserDetails userDetails = new CustomUserDetails(savedUser);
        String token = jwtUtil.generateToken(userDetails);
        return new LoginResponse(token, savedUser.getId());
    }

    @Override
    public ProfileResponse viewProfile(@NonNull Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return userMapper.toProfileResponse(user);
    }

    @Override
    @Transactional
    public void forgotPassword(ForgotPasswordRequest request) {
        Optional<User> userOpt = userRepository.findByEmail(request.getEmail());

        // Security: always return silently even if email doesn't exist (enumeration protection)
        if (userOpt.isEmpty()) {
            return;
        }

        User user = userOpt.get();

        // Delete any existing token for this user before creating a new one
        passwordResetTokenRepository.deleteByUser(user);

        String token = UUID.randomUUID().toString();
        LocalDateTime expiryDate = LocalDateTime.now().plusMinutes(15);

        PasswordResetToken resetToken = new PasswordResetToken(token, user, expiryDate);
        passwordResetTokenRepository.save(resetToken);

        emailService.sendPasswordResetEmail(user.getEmail(), token);
    }

    @Override
    @Transactional
    public void resetPassword(ResetPasswordRequest request) {
        PasswordResetToken resetToken = passwordResetTokenRepository.findByToken(request.getToken())
                .orElseThrow(() -> new ResourceNotFoundException("Invalid or expired password reset token. Please request a new password reset email."));

        if (resetToken.getExpiryDate().isBefore(LocalDateTime.now())) {
            passwordResetTokenRepository.delete(resetToken);
            throw new ResourceNotFoundException("Your password reset link has expired. Please request a new password reset email.");
        }

        User user = resetToken.getUser();
        user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        // Clean up the used token
        passwordResetTokenRepository.delete(resetToken);
    }
}
