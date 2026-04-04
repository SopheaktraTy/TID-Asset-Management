package com.tid.asset_management_bridge.auth_module.repository;

import com.tid.asset_management_bridge.auth_module.entity.RefreshToken;
import com.tid.asset_management_bridge.auth_module.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {
    Optional<RefreshToken> findByToken(String token);
    void deleteByUser(User user);
    void deleteByToken(String token);
    
    @org.springframework.data.jpa.repository.Modifying
    @org.springframework.transaction.annotation.Transactional
    void deleteByExpiryDateBefore(java.time.LocalDateTime now);
}
