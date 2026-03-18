package com.tid.asset_management_bridge.asset_procurements_module.service;

import org.springframework.lang.NonNull;

import com.tid.asset_management_bridge.asset_procurements_module.dto.ProcurementRequest;
import com.tid.asset_management_bridge.asset_procurements_module.dto.ProcurementResponse;

public interface AssetProcurementService {
    ProcurementResponse createProcurement(@NonNull Long assetId, ProcurementRequest request);

    ProcurementResponse updateProcurement(@NonNull Long assetId, ProcurementRequest request);

    ProcurementResponse getProcurementByAssetId(@NonNull Long assetId);

    void deleteProcurement(@NonNull Long procurementId);
}
