package com.tid.asset_management_bridge.auth_module.service;

import com.tid.asset_management_bridge.auth_module.entity.RefreshToken;
import com.tid.asset_management_bridge.auth_module.entity.User;
import com.tid.asset_management_bridge.auth_module.repository.PasswordResetTokenRepository;
import com.tid.asset_management_bridge.auth_module.repository.RefreshTokenRepository;
import com.tid.asset_management_bridge.auth_module.repository.UserRepository;
import com.tid.asset_management_bridge.common.exception.ResourceNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class RefreshTokenService {

    private final RefreshTokenRepository refreshTokenRepository;
    private final UserRepository userRepository;
    private final PasswordResetTokenRepository passwordResetTokenRepository;

    public RefreshTokenService(RefreshTokenRepository refreshTokenRepository, 
                               UserRepository userRepository,
                               PasswordResetTokenRepository passwordResetTokenRepository) {
        this.refreshTokenRepository = refreshTokenRepository;
        this.userRepository = userRepository;
        this.passwordResetTokenRepository = passwordResetTokenRepository;
    }

    @Transactional
    public RefreshToken createRefreshToken(Long userId, boolean rememberMe) {
        // Clean up expired tokens
        LocalDateTime now = LocalDateTime.now();
        refreshTokenRepository.deleteByExpiryDateBefore(now);
        passwordResetTokenRepository.deleteByExpiryDateBefore(now);

        User user = userRepository.findById(java.util.Objects.requireNonNull(userId))
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // Multi-device / multi-browser support:
        // Each login gets its own independent refresh token.
        // Logging in on Browser B will NOT invalidate Browser A's session.
        RefreshToken refreshToken = new RefreshToken();
        refreshToken.setUser(user);
        refreshToken.setToken(UUID.randomUUID().toString());

        // Standard: 24 hours. Remember Me: 30 days.
        if (rememberMe) {
            refreshToken.setExpiryDate(LocalDateTime.now().plusDays(14));
        } else {
            refreshToken.setExpiryDate(LocalDateTime.now().plusHours(8));
        }

        return refreshTokenRepository.save(refreshToken);
    }

    public RefreshToken verifyExpiration(RefreshToken token) {
        if (token.getExpiryDate().isBefore(LocalDateTime.now())) {
            refreshTokenRepository.delete(java.util.Objects.requireNonNull(token));
            throw new com.tid.asset_management_bridge.common.exception.ResourceNotFoundException(
                    "Refresh token was expired. Please make a new signin request");
        }
        return token;
    }

    @org.springframework.transaction.annotation.Transactional(readOnly = true)
    public RefreshToken findByToken(String token) {
        return refreshTokenRepository.findByToken(token)
                .orElseThrow(() -> new com.tid.asset_management_bridge.common.exception.ResourceNotFoundException(
                        "Refresh token is not in database!"));
    }

    @Transactional
    public void deleteByToken(String token) {
        refreshTokenRepository.deleteByToken(token);
    }

    @Transactional
    public void delete(RefreshToken token) {
        refreshTokenRepository.delete(java.util.Objects.requireNonNull(token));
    }

    /**
     * Logout all sessions for a user (e.g. admin revocation or "logout
     * everywhere").
     */
    @Transactional
    public void deleteAllByUserId(Long userId) {
        User user = userRepository.findById(java.util.Objects.requireNonNull(userId))
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        refreshTokenRepository.deleteByUser(user);
    }
}
