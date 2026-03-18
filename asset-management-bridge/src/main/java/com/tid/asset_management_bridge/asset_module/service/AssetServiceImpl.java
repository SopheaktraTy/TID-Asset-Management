package com.tid.asset_management_bridge.asset_module.service;

import com.tid.asset_management_bridge.asset_module.dto.CreateAssetRequest;
import com.tid.asset_management_bridge.asset_module.dto.AssetResponse;
import com.tid.asset_management_bridge.asset_module.entity.Asset;
import com.tid.asset_management_bridge.asset_module.mapper.AssetMapper;
import com.tid.asset_management_bridge.asset_module.repository.AssetRepository;
import com.tid.asset_management_bridge.common.exception.ConflictException;
import com.tid.asset_management_bridge.common.exception.ResourceNotFoundException;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
public class AssetServiceImpl implements AssetService {

    private final AssetRepository assetRepository;
    private final AssetMapper assetMapper;

    public AssetServiceImpl(AssetRepository assetRepository, AssetMapper assetMapper) {
        this.assetRepository = assetRepository;
        this.assetMapper = assetMapper;
    }

    @Override
    @Transactional
    public AssetResponse createAsset(CreateAssetRequest request) {
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

        Asset asset = assetMapper.toEntity(request);
        Asset savedAsset = Objects.requireNonNull(assetRepository.save(asset));

        return assetMapper.toResponse(savedAsset);
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
    @SuppressWarnings("null")
    public AssetResponse updateAsset(@NonNull Long id, com.tid.asset_management_bridge.asset_module.dto.UpdateAssetRequest request) {
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

        assetMapper.partialUpdate(request, asset);
        Asset updatedAsset = Objects.requireNonNull(assetRepository.save(asset));

        return assetMapper.toResponse(updatedAsset);
    }

    @Override
    @Transactional
    public void deleteAsset(@NonNull Long id) {
        if (!assetRepository.existsById(id)) {
            throw new ResourceNotFoundException("Asset not found with id: " + id);
        }
        assetRepository.deleteById(id);
    }

}