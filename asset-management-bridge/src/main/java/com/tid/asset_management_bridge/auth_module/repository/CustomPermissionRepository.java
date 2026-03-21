package com.tid.asset_management_bridge.auth_module.repository;

import com.tid.asset_management_bridge.auth_module.entity.CustomPermission;
import com.tid.asset_management_bridge.auth_module.entity.ModuleEnum;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CustomPermissionRepository extends JpaRepository<CustomPermission, Long> {
    List<CustomPermission> findByUserId(Long userId);

    void deleteByUserIdAndModule(Long userId, ModuleEnum module);
}
