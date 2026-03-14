package com.tid.asset_management_bridge.asset_assignments_module.repository;

import com.tid.asset_management_bridge.asset_assignments_module.entity.AssetAssignment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AssetAssignmentRepository extends JpaRepository<AssetAssignment, Long> {
    List<AssetAssignment> findByAssetIdOrderByAssignedDateDesc(Long assetId);
    void deleteByAssetId(Long assetId);
}
