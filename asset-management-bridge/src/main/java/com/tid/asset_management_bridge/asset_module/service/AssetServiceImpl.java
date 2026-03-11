package com.tid.asset_management_bridge.asset_module.service;

import com.tid.asset_management_bridge.asset_module.dto.CreateAssetRequest;
import com.tid.asset_management_bridge.asset_module.dto.AssetResponse;
import com.tid.asset_management_bridge.asset_module.entity.Asset;
import com.tid.asset_management_bridge.asset_module.mapper.AssetMapper;
import com.tid.asset_management_bridge.asset_module.repository.AssetRepository;
import com.tid.asset_management_bridge.common.exception.ConflictException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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

        request.setAssetTag(normalizedAssetTag);

        Asset asset = assetMapper.toEntity(request);
        Asset savedAsset = assetRepository.save(asset);

        return assetMapper.toResponse(savedAsset);
    }
}