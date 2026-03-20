package com.tid.asset_management_bridge.asset_issues_module.repository;

import com.tid.asset_management_bridge.asset_issues_module.entity.AssetIssue;
import com.tid.asset_management_bridge.asset_issues_module.entity.IssueStatusEnum;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AssetIssueRepository extends JpaRepository<AssetIssue, Long> {
    List<AssetIssue> findByAssetIdOrderByReportedAtDesc(Long assetId);
    void deleteByAssetId(Long assetId);
    boolean existsByAssetIdAndIssueStatusIn(Long assetId, List<IssueStatusEnum> statuses);
}
