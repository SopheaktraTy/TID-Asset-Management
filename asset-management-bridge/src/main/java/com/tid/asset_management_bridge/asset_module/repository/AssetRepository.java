package com.tid.asset_management_bridge.asset_module.repository;

import com.tid.asset_management_bridge.asset_module.entity.Asset;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AssetRepository extends JpaRepository<Asset, Long> {

    boolean existsByAssetTagIgnoreCase(String assetTag);

    boolean existsBySerialNumberIgnoreCase(String serialNumber);

    boolean existsByDeviceNameIgnoreCase(String deviceName);
}