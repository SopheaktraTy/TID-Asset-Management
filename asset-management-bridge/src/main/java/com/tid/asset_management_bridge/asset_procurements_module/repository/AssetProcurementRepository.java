package com.tid.asset_management_bridge.asset_procurements_module.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.tid.asset_management_bridge.asset_procurements_module.entity.AssetProcurement;

import java.util.Optional;

@Repository
public interface AssetProcurementRepository extends JpaRepository<AssetProcurement, Long> {
    Optional<AssetProcurement> findByAssetId(Long assetId);

    boolean existsByAssetId(Long assetId);

    void deleteByAssetId(Long assetId);
}
