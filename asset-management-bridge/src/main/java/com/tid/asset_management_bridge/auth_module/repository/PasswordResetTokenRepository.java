package com.tid.asset_management_bridge.auth_module.repository;

import com.tid.asset_management_bridge.auth_module.entity.PasswordResetToken;
import com.tid.asset_management_bridge.auth_module.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Repository
public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, Long> {
    Optional<PasswordResetToken> findByToken(String token);
    Optional<PasswordResetToken> findByUser(User user);

    @Modifying
    @Transactional
    void deleteByUser(User user);
}
