package com.tid.asset_management_bridge.asset_module.service;

import com.tid.asset_management_bridge.asset_module.dto.CreateAssetRequest;
import com.tid.asset_management_bridge.asset_module.dto.AssetResponse;

public interface AssetService {
    AssetResponse createAsset(CreateAssetRequest request);
}