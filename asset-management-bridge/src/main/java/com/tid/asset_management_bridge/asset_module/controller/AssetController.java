package com.tid.asset_management_bridge.asset_module.controller;

import com.tid.asset_management_bridge.asset_module.dto.CreateAssetRequest;
import com.tid.asset_management_bridge.asset_module.dto.UpdateAssetRequest;
import com.tid.asset_management_bridge.asset_module.dto.AssetResponse;
import com.tid.asset_management_bridge.asset_module.service.AssetService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.http.ResponseEntity;
import com.tid.asset_management_bridge.common.dto.ApiResponse;

import java.util.List;
import org.springframework.security.access.prepost.PreAuthorize;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;

@RestController
@RequestMapping("/api/assets")
@SecurityRequirement(name = "bearerAuth")
public class AssetController {

    private final AssetService assetService;

    public AssetController(AssetService assetService) {
        this.assetService = assetService;
    }

    @PostMapping(consumes = {"multipart/form-data"})
    @PreAuthorize("hasRole('SUPER_ADMIN') or hasAuthority('CREATE_ASSET')")
    public ResponseEntity<ApiResponse<AssetResponse>> createAsset(
            @RequestPart("asset") @Valid CreateAssetRequest request,
            @RequestPart(value = "imageFile", required = false) MultipartFile imageFile) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ApiResponse<>(201, "Asset created successfully", assetService.createAsset(request, imageFile)));
    }

    @GetMapping
    @PreAuthorize("hasRole('SUPER_ADMIN') or hasAuthority('READ_ASSET')")
    public ResponseEntity<ApiResponse<List<AssetResponse>>> getAllAssets() {
        return ResponseEntity.ok(new ApiResponse<>(200, "Assets retrieved successfully", assetService.getAllAssets()));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('SUPER_ADMIN') or hasAuthority('READ_ASSET')")
    public ResponseEntity<ApiResponse<AssetResponse>> getAssetById(@PathVariable @NonNull Long id) {
        return ResponseEntity.ok(new ApiResponse<>(200, "Asset retrieved successfully", assetService.getAssetById(id)));
    }

    @PatchMapping(value = "/{id}", consumes = {"multipart/form-data"})
    @PreAuthorize("hasRole('SUPER_ADMIN') or hasAuthority('UPDATE_ASSET')")
    public ResponseEntity<ApiResponse<AssetResponse>> updateAsset(
            @PathVariable @NonNull Long id,
            @RequestPart("asset") @Valid UpdateAssetRequest request,
            @RequestParam(value = "removeImage", defaultValue = "false") boolean removeImage,
            @RequestPart(value = "imageFile", required = false) MultipartFile imageFile) {
        return ResponseEntity
                .ok(new ApiResponse<>(200, "Asset updated successfully", assetService.updateAsset(id, request, imageFile, removeImage)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('SUPER_ADMIN') or hasAuthority('DELETE_ASSET')")
    public ResponseEntity<ApiResponse<Void>> deleteAsset(@PathVariable @NonNull Long id) {
        assetService.deleteAsset(id);
        return ResponseEntity.ok(new ApiResponse<>(200, "Asset deleted successfully"));
    }

}
