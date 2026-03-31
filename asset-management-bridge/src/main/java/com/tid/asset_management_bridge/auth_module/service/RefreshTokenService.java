package com.tid.asset_management_bridge.auth_module.service;

import com.tid.asset_management_bridge.auth_module.entity.RefreshToken;
import com.tid.asset_management_bridge.auth_module.entity.User;
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

    public RefreshTokenService(RefreshTokenRepository refreshTokenRepository, UserRepository userRepository) {
        this.refreshTokenRepository = refreshTokenRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public RefreshToken createRefreshToken(Long userId, boolean rememberMe) {
        User user = userRepository.findById(java.util.Objects.requireNonNull(userId))
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // Delete any existing tokens for this user -> single device login logic, or let them stack?
        // Let's delete existing tokens for simplicity (user only logged in on one browser).
        refreshTokenRepository.deleteByUser(user);

        RefreshToken refreshToken = new RefreshToken();
        refreshToken.setUser(user);
        refreshToken.setToken(UUID.randomUUID().toString());

        // Standard: 24 hours. Remember Me: 30 days.
        if (rememberMe) {
            refreshToken.setExpiryDate(LocalDateTime.now().plusDays(30));
        } else {
            refreshToken.setExpiryDate(LocalDateTime.now().plusHours(24));
        }

        return refreshTokenRepository.save(refreshToken);
    }

    public RefreshToken verifyExpiration(RefreshToken token) {
        if (token.getExpiryDate().isBefore(LocalDateTime.now())) {
            refreshTokenRepository.delete(token);
            throw new com.tid.asset_management_bridge.common.exception.ResourceNotFoundException("Refresh token was expired. Please make a new signin request");
        }
        return token;
    }

    public RefreshToken findByToken(String token) {
        return refreshTokenRepository.findByToken(token)
                .orElseThrow(() -> new com.tid.asset_management_bridge.common.exception.ResourceNotFoundException("Refresh token is not in database!"));
    }

    @Transactional
    public void deleteByToken(String token) {
        refreshTokenRepository.deleteByToken(token);
    }
}
