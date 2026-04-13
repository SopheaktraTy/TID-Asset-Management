package com.tid.asset_management_bridge.asset_module.service;

import com.tid.asset_management_bridge.asset_module.dto.CreateAssetRequest;
import com.tid.asset_management_bridge.asset_module.dto.UpdateAssetRequest;
import com.tid.asset_management_bridge.asset_module.dto.AssetResponse;
import org.springframework.lang.NonNull;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface AssetService {

    AssetResponse createAsset(CreateAssetRequest request, MultipartFile imageFile);

    List<AssetResponse> getAllAssets();

    AssetResponse getAssetById(@NonNull Long id);

    AssetResponse updateAsset(@NonNull Long id, UpdateAssetRequest request, MultipartFile imageFile, boolean removeImage);

    void deleteAsset(@NonNull Long id);
}
