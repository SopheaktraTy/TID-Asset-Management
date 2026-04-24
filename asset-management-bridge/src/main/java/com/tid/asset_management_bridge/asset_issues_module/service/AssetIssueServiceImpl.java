package com.tid.asset_management_bridge.asset_issues_module.service;

import com.tid.asset_management_bridge.asset_issues_module.dto.IssueResponse;
import com.tid.asset_management_bridge.asset_issues_module.dto.ReportIssueRequest;
import com.tid.asset_management_bridge.asset_issues_module.dto.UpdateIssueRequest;
import com.tid.asset_management_bridge.asset_issues_module.entity.AssetIssue;
import com.tid.asset_management_bridge.asset_issues_module.entity.IssueStatusEnum;
import com.tid.asset_management_bridge.asset_issues_module.entity.IssueTitleEnum;
import com.tid.asset_management_bridge.asset_issues_module.mapper.AssetIssueMapper;
import com.tid.asset_management_bridge.asset_issues_module.repository.AssetIssueRepository;
import com.tid.asset_management_bridge.asset_module.entity.Asset;
import com.tid.asset_management_bridge.asset_module.entity.AssetStatusEnum;
import com.tid.asset_management_bridge.asset_module.repository.AssetRepository;
import com.tid.asset_management_bridge.common.exception.ResourceNotFoundException;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AssetIssueServiceImpl implements AssetIssueService {

    private final AssetIssueRepository issueRepository;
    private final AssetRepository assetRepository;
    private final AssetIssueMapper issueMapper;
    private final com.tid.asset_management_bridge.asset_assignments_module.repository.AssetAssignmentRepository assignmentRepository;

    public AssetIssueServiceImpl(AssetIssueRepository issueRepository,
            AssetRepository assetRepository,
            AssetIssueMapper issueMapper,
            com.tid.asset_management_bridge.asset_assignments_module.repository.AssetAssignmentRepository assignmentRepository) {
        this.issueRepository = issueRepository;
        this.assetRepository = assetRepository;
        this.issueMapper = issueMapper;
        this.assignmentRepository = assignmentRepository;
    }

    @Override
    @Transactional
    public IssueResponse reportIssue(@NonNull Long assetId, ReportIssueRequest request) {
        if (issueRepository.existsByAssetIdAndIssueStatusIn(assetId,
                List.of(IssueStatusEnum.OPEN, IssueStatusEnum.IN_PROGRESS))) {
            throw new com.tid.asset_management_bridge.common.exception.ConflictException(
                    "Cannot report a new issue: the asset already has an active issue. Please resolve it first");
        }

        Asset asset = assetRepository.findById(assetId)
                .orElseThrow(() -> new ResourceNotFoundException("Asset not found with id: " + assetId));

        // Update asset status to match the reported issue title
        asset.setStatus(toAssetStatus(request.getIssueTitle()));
        assetRepository.save(asset);

        AssetIssue issue = issueMapper.toEntity(request);
        issue.setAsset(asset);
        
        // Sync remark to Asset and Active Assignment
        if (request.getRemark() != null && !request.getRemark().isBlank()) {
            asset.setRemark(request.getRemark());
            assetRepository.save(asset);
            
            // Link: also update active assignment remark
            assignmentRepository.findFirstByAssetIdAndReturnedDateIsNull(asset.getId())
                .ifPresent(assignment -> {
                    assignment.setRemark(request.getRemark());
                    assignmentRepository.save(assignment);
                });
        }

        AssetIssue saved = issueRepository.save(issue);
        return issueMapper.toResponse(saved);
    }

    @Override
    @Transactional
    @SuppressWarnings("null")
    public IssueResponse updateIssue(@NonNull Long issueId, UpdateIssueRequest request) {
        AssetIssue issue = issueRepository.findById(issueId)
                .orElseThrow(() -> new ResourceNotFoundException("Issue not found with id: " + issueId));

        if (request.getIssueTitle() != null) {
            issue.setIssueTitle(request.getIssueTitle());
        }
        if (request.getIssueStatus() != null) {
            IssueStatusEnum newStatus = request.getIssueStatus();
            issue.setIssueStatus(newStatus);

            Asset asset = issue.getAsset();
            if (newStatus == IssueStatusEnum.RESOLVED) {
                // Mark resolved timestamp and restore asset to AVAILABLE
                if (issue.getResolvedAt() == null) {
                    issue.setResolvedAt(LocalDateTime.now());
                }
                asset.setStatus(AssetStatusEnum.AVAILABLE);
                assetRepository.save(asset);
            } else if (newStatus == IssueStatusEnum.IN_PROGRESS) {
                // In progress means the asset is actively being repaired
                issue.setResolvedAt(null);
                asset.setStatus(AssetStatusEnum.UNDER_REPAIR);
                assetRepository.save(asset);
            } else if (newStatus == IssueStatusEnum.OPEN) {
                // Re-opened: clear resolved timestamp, restore status from issue title
                issue.setResolvedAt(null);
                asset.setStatus(toAssetStatus(issue.getIssueTitle()));
                assetRepository.save(asset);
            } else {
                // CANT_RESOLVED: keep asset status as-is (still in issue)
                asset.setStatus(toAssetStatus(issue.getIssueTitle()));
                assetRepository.save(asset);
            }
        }
        if (request.getRemark() != null && !request.getRemark().isBlank()) {
            issue.setRemark(request.getRemark());
            // Sync remark to Asset
            Asset asset = issue.getAsset();
            asset.setRemark(request.getRemark());
            assetRepository.save(asset);

            // Link: also update active assignment remark
            assignmentRepository.findFirstByAssetIdAndReturnedDateIsNull(asset.getId())
                .ifPresent(assignment -> {
                    assignment.setRemark(request.getRemark());
                    assignmentRepository.save(assignment);
                });
        }

        AssetIssue updated = issueRepository.save(issue);
        return issueMapper.toResponse(updated);
    }

    @Override
    @Transactional(readOnly = true)
    public List<IssueResponse> getIssuesByAsset(@NonNull Long assetId) {
        if (!assetRepository.existsById(assetId)) {
            throw new ResourceNotFoundException("Asset not found with id: " + assetId);
        }
        return issueRepository.findByAssetIdOrderByReportedAtDesc(assetId).stream()
                .map(issueMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void deleteIssue(@NonNull Long issueId) {
        AssetIssue issue = issueRepository.findById(issueId)
                .orElseThrow(() -> new ResourceNotFoundException("Issue not found with id: " + issueId));

        // Restore asset to AVAILABLE when an unresolved issue is deleted
        if (issue.getIssueStatus() != IssueStatusEnum.RESOLVED) {
            Asset asset = issue.getAsset();
            asset.setStatus(AssetStatusEnum.AVAILABLE);
            assetRepository.save(asset);
        }

        issueRepository.deleteById(issueId);
    }

    // -----------------------------------------------------------------------
    // Helper: map IssueTitleEnum → AssetStatusEnum (same names, safe cast)
    // -----------------------------------------------------------------------
    private AssetStatusEnum toAssetStatus(IssueTitleEnum title) {
        return AssetStatusEnum.valueOf(title.name());
    }
}
