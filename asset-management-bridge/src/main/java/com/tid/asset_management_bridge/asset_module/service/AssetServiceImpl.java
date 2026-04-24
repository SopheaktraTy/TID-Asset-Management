package com.tid.asset_management_bridge.asset_module.service;

import com.tid.asset_management_bridge.asset_module.dto.CreateAssetRequest;
import com.tid.asset_management_bridge.asset_module.dto.UpdateAssetRequest;
import com.tid.asset_management_bridge.asset_module.dto.AssetResponse;
import com.tid.asset_management_bridge.asset_module.entity.Asset;
import com.tid.asset_management_bridge.asset_module.mapper.AssetMapper;
import com.tid.asset_management_bridge.asset_module.repository.AssetRepository;
import com.tid.asset_management_bridge.common.exception.ConflictException;
import com.tid.asset_management_bridge.common.exception.ResourceNotFoundException;
import com.tid.asset_management_bridge.common.service.FileStorageService;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

import java.util.stream.Collectors;

@Service
public class AssetServiceImpl implements AssetService {

    // storeFile writes to: {uploadDir}/{subDir}/file → uploads/assets/file
    // The /uploads/ prefix is added separately when building the DB URL path.
    private static final String ASSET_IMAGE_SUBDIR = "assets";

    private final AssetRepository assetRepository;
    private final AssetMapper assetMapper;
    private final FileStorageService fileStorageService;
    private final com.tid.asset_management_bridge.asset_issues_module.repository.AssetIssueRepository issueRepository;
    private final com.tid.asset_management_bridge.asset_assignments_module.repository.AssetAssignmentRepository assignmentRepository;

    public AssetServiceImpl(AssetRepository assetRepository,
            AssetMapper assetMapper,
            FileStorageService fileStorageService,
            com.tid.asset_management_bridge.asset_issues_module.repository.AssetIssueRepository issueRepository,
            com.tid.asset_management_bridge.asset_assignments_module.repository.AssetAssignmentRepository assignmentRepository) {
        this.assetRepository = assetRepository;
        this.assetMapper = assetMapper;
        this.fileStorageService = fileStorageService;
        this.issueRepository = issueRepository;
        this.assignmentRepository = assignmentRepository;
    }

    @SuppressWarnings("null")
    private Asset saveAsset(Asset asset) {
        return assetRepository.save(asset);
    }

    @Override
    @Transactional
    public AssetResponse createAsset(CreateAssetRequest request, MultipartFile imageFile) {
        String normalizedAssetTag = request.getAssetTag().trim();

        if (assetRepository.existsByAssetTagIgnoreCase(normalizedAssetTag)) {
            throw new ConflictException("Asset tag already exists: " + normalizedAssetTag);
        }

        if (request.getSerialNumber() != null && !request.getSerialNumber().isBlank()) {
            String normalizedSerial = request.getSerialNumber().trim();
            if (assetRepository.existsBySerialNumberIgnoreCase(normalizedSerial)) {
                throw new ConflictException("Serial number already exists: " + normalizedSerial);
            }
            request.setSerialNumber(normalizedSerial);
        }

        if (request.getDeviceName() != null && !request.getDeviceName().isBlank()) {
            String normalizedDeviceName = request.getDeviceName().trim();
            if (assetRepository.existsByDeviceNameIgnoreCase(normalizedDeviceName)) {
                throw new ConflictException("Device name already exists: " + normalizedDeviceName);
            }
            request.setDeviceName(normalizedDeviceName);
        }

        request.setAssetTag(normalizedAssetTag);

        // ── Save image file ──────────────────────────────────────────────────────
        if (imageFile != null && !imageFile.isEmpty()) {
            String imagePath = fileStorageService.storeFile(imageFile, ASSET_IMAGE_SUBDIR);
            if (imagePath != null) {
                // Store as URL-style path so frontend can resolve it
                request.setImage("/uploads/" + imagePath.replace("\\", "/"));
            }
        }
        // ─────────────────────────────────────────────────────────────────────────

        Asset asset = assetMapper.toEntity(request);
        return assetMapper.toResponse(saveAsset(asset));
    }

    @Override
    @Transactional(readOnly = true)
    public List<AssetResponse> getAllAssets() {
        return assetRepository.findAll().stream()
                .map(assetMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public AssetResponse getAssetById(@NonNull Long id) {
        Asset asset = assetRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Asset not found with id: " + id));
        return assetMapper.toResponse(asset);
    }

    @Override
    @Transactional
    public AssetResponse updateAsset(@NonNull Long id, UpdateAssetRequest request, MultipartFile imageFile,
            boolean removeImage) {
        Asset asset = assetRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Asset not found with id: " + id));

        if (request.getAssetTag() != null && !request.getAssetTag().isBlank()) {
            String normalizedAssetTag = request.getAssetTag().trim();
            if (!asset.getAssetTag().equalsIgnoreCase(normalizedAssetTag) &&
                    assetRepository.existsByAssetTagIgnoreCase(normalizedAssetTag)) {
                throw new ConflictException("Asset tag already exists: " + normalizedAssetTag);
            }
            request.setAssetTag(normalizedAssetTag);
        }

        if (request.getSerialNumber() != null && !request.getSerialNumber().isBlank()) {
            String normalizedSerial = request.getSerialNumber().trim();
            if (asset.getSerialNumber() != null && !asset.getSerialNumber().equalsIgnoreCase(normalizedSerial) &&
                    assetRepository.existsBySerialNumberIgnoreCase(normalizedSerial)) {
                throw new ConflictException("Serial number already exists: " + normalizedSerial);
            }
            request.setSerialNumber(normalizedSerial);
        }

        if (request.getDeviceName() != null && !request.getDeviceName().isBlank()) {
            String normalizedDeviceName = request.getDeviceName().trim();
            if (asset.getDeviceName() != null && !asset.getDeviceName().equalsIgnoreCase(normalizedDeviceName) &&
                    assetRepository.existsByDeviceNameIgnoreCase(normalizedDeviceName)) {
                throw new ConflictException("Device name already exists: " + normalizedDeviceName);
            }
            request.setDeviceName(normalizedDeviceName);
        }

        // Capture old image path for cleanup
        String oldImage = asset.getImage();

        // 🗑️ Handle explicit removal
        if (removeImage && oldImage != null) {
            fileStorageService.deleteFile(oldImage);
            asset.setImage(null);
            // It's important to set this in the request or mapper won't update it
            request.setImage("");
        }

        // ── Replace/Upload image file
        // ───────────────────────────────────────────────────
        if (imageFile != null && !imageFile.isEmpty()) {
            String imagePath = fileStorageService.storeFile(imageFile, ASSET_IMAGE_SUBDIR);
            if (imagePath != null) {
                if (oldImage != null) {
                    fileStorageService.deleteFile(oldImage);
                }
                request.setImage("/uploads/" + imagePath.replace("\\", "/"));
            }
        }
        // ─────────────────────────────────────────────────────────────────────────

        assetMapper.partialUpdate(request, asset);

        // Sync remark to Active Issue and Active Assignment
        if (request.getRemark() != null && !request.getRemark().isBlank()) {
            final String newRemark = request.getRemark();
            
            // Link: update active issue
            issueRepository.findFirstByAssetIdAndIssueStatusInOrderByReportedAtDesc(asset.getId(),
                List.of(com.tid.asset_management_bridge.asset_issues_module.entity.IssueStatusEnum.OPEN, 
                        com.tid.asset_management_bridge.asset_issues_module.entity.IssueStatusEnum.IN_PROGRESS))
                .ifPresent(issue -> {
                    issue.setRemark(newRemark);
                    issueRepository.save(issue);
                });

            // Link: update active assignment
            assignmentRepository.findFirstByAssetIdAndReturnedDateIsNull(asset.getId())
                .ifPresent(assignment -> {
                    assignment.setRemark(newRemark);
                    assignmentRepository.save(assignment);
                });
        }

        // Ensure image is set to null if request.getImage() == "" and we removed it
        if (removeImage && !(imageFile != null && !imageFile.isEmpty())) {
            asset.setImage(null);
        }

        return assetMapper.toResponse(saveAsset(asset));
    }

    @Override
    @Transactional
    public void deleteAsset(@NonNull Long id) {
        Asset asset = assetRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Asset not found with id: " + id));

        // ── Delete image file from disk ──────────────────────────────────────────
        if (asset.getImage() != null && !asset.getImage().isBlank()) {
            fileStorageService.deleteFile(asset.getImage());
        }
        // ─────────────────────────────────────────────────────────────────────────

        assetRepository.deleteById(id);
    }

}