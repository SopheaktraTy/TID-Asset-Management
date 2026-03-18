package com.tid.asset_management_bridge.asset_procurements_module.service;

import com.tid.asset_management_bridge.asset_module.entity.Asset;
import com.tid.asset_management_bridge.asset_module.repository.AssetRepository;
import com.tid.asset_management_bridge.common.exception.ConflictException;
import com.tid.asset_management_bridge.common.exception.ResourceNotFoundException;
import com.tid.asset_management_bridge.asset_procurements_module.dto.ProcurementRequest;
import com.tid.asset_management_bridge.asset_procurements_module.dto.ProcurementResponse;
import com.tid.asset_management_bridge.asset_procurements_module.entity.AssetProcurement;
import com.tid.asset_management_bridge.asset_procurements_module.mapper.AssetProcurementMapper;
import com.tid.asset_management_bridge.asset_procurements_module.repository.AssetProcurementRepository;

import java.util.Objects;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@SuppressWarnings("null")
public class AssetProcurementServiceImpl implements AssetProcurementService {

    private final AssetProcurementRepository procurementRepository;
    private final AssetRepository assetRepository;
    private final AssetProcurementMapper procurementMapper;

    public AssetProcurementServiceImpl(AssetProcurementRepository procurementRepository,
            AssetRepository assetRepository,
            AssetProcurementMapper procurementMapper) {
        this.procurementRepository = procurementRepository;
        this.assetRepository = assetRepository;
        this.procurementMapper = procurementMapper;
    }

    @Override
    @Transactional
    public ProcurementResponse createProcurement(@NonNull Long assetId, ProcurementRequest request) {
        Asset asset = assetRepository.findById(assetId)
                .orElseThrow(() -> new ResourceNotFoundException("Asset not found with id: " + assetId));

        if (procurementRepository.existsByAssetId(assetId)) {
            throw new ConflictException("Procurement record already exists for asset id: " + assetId);
        }

        validateDates(request);

        AssetProcurement procurement = procurementMapper.toEntity(request);
        procurement.setAsset(asset);

        AssetProcurement saved = Objects.requireNonNull(procurementRepository.save(procurement));
        return procurementMapper.toResponse(saved);
    }

    @Override
    @Transactional
    public ProcurementResponse updateProcurement(@NonNull Long assetId, ProcurementRequest request) {
        AssetProcurement procurement = procurementRepository.findByAssetId(assetId)
                .orElseThrow(() -> new ResourceNotFoundException("Procurement not found for asset id: " + assetId));

        validateDates(request);

        procurementMapper.updateEntityFromRequest(request, procurement);

        AssetProcurement updated = Objects.requireNonNull(procurementRepository.save(procurement));
        return procurementMapper.toResponse(updated);
    }

    @Override
    @Transactional(readOnly = true)
    public ProcurementResponse getProcurementByAssetId(@NonNull Long assetId) {
        if (!assetRepository.existsById(assetId)) {
            throw new ResourceNotFoundException("Asset not found with id: " + assetId);
        }

        AssetProcurement procurement = procurementRepository.findByAssetId(assetId)
                .orElseThrow(() -> new ResourceNotFoundException("Procurement not found for asset id: " + assetId));

        return procurementMapper.toResponse(procurement);
    }

    @Override
    @Transactional
    public void deleteProcurement(@NonNull Long assetId) {
        AssetProcurement procurement = procurementRepository.findByAssetId(assetId)
                .orElseThrow(() -> new ResourceNotFoundException("Procurement not found for asset id: " + assetId));
        Long procurementId = Objects.requireNonNull(procurement.getId());
        procurementRepository.deleteById(procurementId);
    }

    private void validateDates(ProcurementRequest request) {
        if (request.getPurchaseDate() != null && request.getWarrantyExpiryDate() != null) {
            if (request.getWarrantyExpiryDate().isBefore(request.getPurchaseDate())) {
                throw new IllegalArgumentException("Warranty expiry date must be after or equal to the purchase date.");
            }
        }
    }
}
