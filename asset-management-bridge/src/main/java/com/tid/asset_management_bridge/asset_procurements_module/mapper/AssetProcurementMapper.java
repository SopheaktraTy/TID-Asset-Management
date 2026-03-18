package com.tid.asset_management_bridge.asset_procurements_module.mapper;

import org.springframework.stereotype.Component;

import com.tid.asset_management_bridge.asset_procurements_module.dto.ProcurementRequest;
import com.tid.asset_management_bridge.asset_procurements_module.dto.ProcurementResponse;
import com.tid.asset_management_bridge.asset_procurements_module.entity.AssetProcurement;

@Component
public class AssetProcurementMapper {

    public AssetProcurement toEntity(ProcurementRequest request) {
        if (request == null) {
            return null;
        }
        AssetProcurement entity = new AssetProcurement();
        entity.setPurchaseDate(request.getPurchaseDate());
        entity.setPurchaseVendor(request.getPurchaseVendor());
        entity.setPurchaseCost(request.getPurchaseCost());
        entity.setWarrantyExpiryDate(request.getWarrantyExpiryDate());
        return entity;
    }

    public ProcurementResponse toResponse(AssetProcurement entity) {
        if (entity == null) {
            return null;
        }
        ProcurementResponse response = new ProcurementResponse();
        response.setId(entity.getId());
        if (entity.getAsset() != null) {
            response.setAssetId(entity.getAsset().getId());
        }
        response.setPurchaseDate(entity.getPurchaseDate());
        response.setPurchaseVendor(entity.getPurchaseVendor());
        response.setPurchaseCost(entity.getPurchaseCost());
        response.setWarrantyExpiryDate(entity.getWarrantyExpiryDate());
        return response;
    }

    public void updateEntityFromRequest(ProcurementRequest request, AssetProcurement entity) {
        if (request == null || entity == null) {
            return;
        }
        if (request.getPurchaseDate() != null)
            entity.setPurchaseDate(request.getPurchaseDate());
        if (request.getPurchaseVendor() != null)
            entity.setPurchaseVendor(request.getPurchaseVendor());
        if (request.getPurchaseCost() != null)
            entity.setPurchaseCost(request.getPurchaseCost());
        if (request.getWarrantyExpiryDate() != null)
            entity.setWarrantyExpiryDate(request.getWarrantyExpiryDate());
    }
}
