package com.tid.asset_management_bridge.asset_module.repository;

import com.tid.asset_management_bridge.asset_module.entity.Asset;
import com.tid.asset_management_bridge.asset_module.entity.AssetStatusEnum;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface AssetRepository extends JpaRepository<Asset, Long> {

    boolean existsByAssetTagIgnoreCase(String assetTag);

    boolean existsBySerialNumberIgnoreCase(String serialNumber);

    boolean existsByDeviceNameIgnoreCase(String deviceName);

    long countByStatus(AssetStatusEnum status);

    List<Asset> findByStatus(AssetStatusEnum status);

    @Query("SELECT a FROM Asset a WHERE " +
           "LOWER(a.deviceName) LIKE LOWER(CONCAT('%', :term, '%')) OR " +
           "LOWER(a.assetTag)   LIKE LOWER(CONCAT('%', :term, '%')) OR " +
           "LOWER(a.serialNumber) LIKE LOWER(CONCAT('%', :term, '%'))")
    List<Asset> searchByTerm(@Param("term") String term);
}