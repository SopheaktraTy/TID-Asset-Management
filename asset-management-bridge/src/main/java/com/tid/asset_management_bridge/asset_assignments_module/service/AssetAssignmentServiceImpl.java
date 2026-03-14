package com.tid.asset_management_bridge.asset_assignments_module.service;

import com.tid.asset_management_bridge.asset_assignments_module.dto.AssignAssetRequest;
import com.tid.asset_management_bridge.asset_assignments_module.dto.AssignmentResponse;
import com.tid.asset_management_bridge.asset_assignments_module.dto.ReturnAssetRequest;
import com.tid.asset_management_bridge.asset_assignments_module.entity.AssetAssignment;
import com.tid.asset_management_bridge.asset_assignments_module.mapper.AssetAssignmentMapper;
import com.tid.asset_management_bridge.asset_assignments_module.repository.AssetAssignmentRepository;
import com.tid.asset_management_bridge.asset_module.entity.Asset;
import com.tid.asset_management_bridge.asset_module.entity.AssetStatusEnum;
import com.tid.asset_management_bridge.asset_module.repository.AssetRepository;
import com.tid.asset_management_bridge.common.exception.ConflictException;
import com.tid.asset_management_bridge.common.exception.ResourceNotFoundException;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AssetAssignmentServiceImpl implements AssetAssignmentService {

    private final AssetAssignmentRepository assignmentRepository;
    private final AssetRepository assetRepository;
    private final AssetAssignmentMapper assignmentMapper;

    public AssetAssignmentServiceImpl(AssetAssignmentRepository assignmentRepository,
            AssetRepository assetRepository,
            AssetAssignmentMapper assignmentMapper) {
        this.assignmentRepository = assignmentRepository;
        this.assetRepository = assetRepository;
        this.assignmentMapper = assignmentMapper;
    }

    @Override
    @Transactional
    public AssignmentResponse assignAsset(AssignAssetRequest request) {
        @SuppressWarnings("null")
        Asset asset = assetRepository.findById(request.getAssetId())
                .orElseThrow(() -> new ResourceNotFoundException("Asset not found with id: " + request.getAssetId()));

        // Always remove old assignments that link to this asset id to prevent duplication
        assignmentRepository.deleteByAssetId(asset.getId());

        asset.setLatestUsed(request.getAssignedTo());
        asset.setStatus(AssetStatusEnum.IN_USE);
        assetRepository.save(asset);

        AssetAssignment assignment = assignmentMapper.toEntity(request);
        assignment.setAsset(asset);

        AssetAssignment saved = assignmentRepository.save(assignment);
        return assignmentMapper.toResponse(saved);
    }

    @Override
    @Transactional
    public AssignmentResponse returnAsset(@NonNull Long assignmentId, ReturnAssetRequest request) {
        AssetAssignment assignment = assignmentRepository.findById(assignmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Assignment not found with id: " + assignmentId));

        if (assignment.getReturnedDate() != null) {
            throw new ConflictException("Asset has already been returned for this assignment.");
        }

        assignment.setReturnedDate(LocalDate.now());
        assignment.setReturnCondition(request.getReturnCondition());
        if (request.getNotes() != null && !request.getNotes().isEmpty()) {
            assignment.setNotes(request.getNotes());
        }

        Asset asset = assignment.getAsset();
        asset.setStatus(AssetStatusEnum.AVAILABLE);

        if (request.getReturnCondition() != null && !request.getReturnCondition().isBlank()) {
            asset.setCondition(request.getReturnCondition());
        }

        assetRepository.save(asset);
        AssetAssignment updated = assignmentRepository.save(assignment);

        return assignmentMapper.toResponse(updated);
    }

    @Override
    @Transactional(readOnly = true)
    public List<AssignmentResponse> getAssetAssignments(@NonNull Long assetId) {
        if (!assetRepository.existsById(assetId)) {
            throw new ResourceNotFoundException("Asset not found with id: " + assetId);
        }

        return assignmentRepository.findByAssetIdOrderByAssignedDateDesc(assetId).stream()
                .map(assignmentMapper::toResponse)
                .collect(Collectors.toList());
    }
}
