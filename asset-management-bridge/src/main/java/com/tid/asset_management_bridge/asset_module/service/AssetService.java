package com.tid.asset_management_bridge.asset_module.service;

import com.tid.asset_management_bridge.asset_module.dto.CreateAssetRequest;
import com.tid.asset_management_bridge.asset_module.dto.AssetResponse;
import org.springframework.lang.NonNull;

import java.util.List;

public interface AssetService {
    AssetResponse createAsset(CreateAssetRequest request);

    List<AssetResponse> getAllAssets();

    AssetResponse getAssetById(@NonNull Long id);

    void deleteAsset(@NonNull Long id);
}