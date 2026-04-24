package com.tid.asset_management_bridge.asset_assignments_module.repository;

import com.tid.asset_management_bridge.asset_assignments_module.entity.AssetAssignment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AssetAssignmentRepository extends JpaRepository<AssetAssignment, Long> {
    List<AssetAssignment> findByAssetIdOrderByAssignedDateDesc(Long assetId);
    void deleteByAssetId(Long assetId);

    // Check if an asset already has an active (un-returned) assignment
    boolean existsByAssetIdAndReturnedDateIsNull(Long assetId);
    java.util.Optional<AssetAssignment> findFirstByAssetIdAndReturnedDateIsNull(Long assetId);

    // Same check, but excluding a specific assignment record (used during updates)
    boolean existsByAssetIdAndReturnedDateIsNullAndIdNot(Long assetId, Long excludeId);

    // Find the most recent returned assignment for an asset, excluding a given assignment (used during delete to restore previousUsed chain)
    Optional<AssetAssignment> findFirstByAssetIdAndReturnedDateIsNotNullAndIdNotOrderByReturnedDateDesc(Long assetId, Long excludeId);
}
