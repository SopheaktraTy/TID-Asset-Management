package com.tid.asset_management_bridge.asset_assignments_module.service;

import com.tid.asset_management_bridge.asset_assignments_module.dto.AssignAssetRequest;
import com.tid.asset_management_bridge.asset_assignments_module.dto.AssignmentResponse;
import com.tid.asset_management_bridge.asset_assignments_module.dto.ReturnAssetRequest;
import com.tid.asset_management_bridge.asset_assignments_module.dto.UpdateAssetAssignmentRequest;
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
        Long assetId = request.getAssetId();
        if (assetId == null) {
            throw new ResourceNotFoundException("Asset ID must not be null");
        }
        Asset asset = assetRepository.findById(assetId)
                .orElseThrow(() -> new ResourceNotFoundException("Asset not found with id: " + assetId));

        // Prevent duplicate active assignments for the same asset
        if (assignmentRepository.existsByAssetIdAndReturnedDateIsNull(asset.getId())) {
            throw new ConflictException(
                    "Asset is already actively assigned. " +
                    "asset_tag='" + asset.getAssetTag() + "', " +
                    "serial_number='" + asset.getSerialNumber() + "', " +
                    "device_name='" + asset.getDeviceName() + "'");
        }

        // Capture current latest_used as previous_used before overwriting
        String currentLatestUsed = asset.getLatestUsed();
        if (currentLatestUsed != null && !currentLatestUsed.isBlank()) {
            asset.setPreviousUsed(currentLatestUsed);
        }

        asset.setLatestUsed(request.getAssignedTo());
        asset.setStatus(AssetStatusEnum.IN_USE);
        assetRepository.save(asset);

        AssetAssignment assignment = assignmentMapper.toEntity(request);
        assignment.setAsset(asset);
        assignment.setPreviousUsed(currentLatestUsed);

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

    @Override
    @Transactional
    public AssignmentResponse updateAssetAssignment(@NonNull Long assignmentId, UpdateAssetAssignmentRequest request) {
        AssetAssignment assignment = assignmentRepository.findById(assignmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Assignment not found with id: " + assignmentId));

        // If clearing the returnedDate (re-activating a returned assignment),
        // ensure no other active assignment already exists for the same asset
        boolean isBeingReactivated = (assignment.getReturnedDate() != null && request.getReturnedDate() == null);
        if (isBeingReactivated) {
            Asset asset = assignment.getAsset();
            if (assignmentRepository.existsByAssetIdAndReturnedDateIsNullAndIdNot(asset.getId(), assignmentId)) {
                throw new ConflictException(
                        "Cannot reactivate assignment: asset is already actively assigned. " +
                        "asset_tag='" + asset.getAssetTag() + "', " +
                        "serial_number='" + asset.getSerialNumber() + "', " +
                        "device_name='" + asset.getDeviceName() + "'");
            }
        }

        if (request.getAssignedTo() != null) {
            assignment.setAssignedTo(request.getAssignedTo());
        }
        if (request.getDepartment() != null) {
            assignment.setDepartment(request.getDepartment());
        }
        if (request.getJobTitle() != null) {
            assignment.setJobTitle(request.getJobTitle());
        }
        if (request.getAssignedBy() != null) {
            assignment.setAssignedBy(request.getAssignedBy());
        }
        if (request.getReturnedDate() != null) {
            assignment.setReturnedDate(request.getReturnedDate());
        }
        if (request.getReturnCondition() != null) {
            assignment.setReturnCondition(request.getReturnCondition());
        }
        if (request.getAssignedDate() != null) {
            assignment.setAssignedDate(request.getAssignedDate());
        }
        if (request.getNotes() != null) {
            assignment.setNotes(request.getNotes());
        }

        AssetAssignment updated = assignmentRepository.save(assignment);
        return assignmentMapper.toResponse(updated);
    }

    @Override
    @Transactional
    public void deleteAssetAssignment(@NonNull Long assignmentId) {
        AssetAssignment assignment = assignmentRepository.findById(assignmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Assignment not found with id: " + assignmentId));

        // If this is the active assignment (no return date), reset asset status
        if (assignment.getReturnedDate() == null) {
            Asset asset = assignment.getAsset();
            asset.setStatus(AssetStatusEnum.AVAILABLE);
            // Restore previous_used back to latest_used on asset
            asset.setLatestUsed(asset.getPreviousUsed());
            asset.setPreviousUsed(null);
            assetRepository.save(asset);
        }

        assignmentRepository.deleteById(assignmentId);
    }
}
