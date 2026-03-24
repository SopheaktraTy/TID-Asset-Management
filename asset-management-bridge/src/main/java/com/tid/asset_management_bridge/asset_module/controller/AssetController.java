package com.tid.asset_management_bridge.asset_module.controller;

import com.tid.asset_management_bridge.asset_module.dto.CreateAssetRequest;
import com.tid.asset_management_bridge.asset_module.dto.AssetResponse;
import com.tid.asset_management_bridge.asset_module.service.AssetService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.*;
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

    @PostMapping
    @PreAuthorize("hasRole('SUPER_ADMIN') or hasAuthority('CREATE_ASSET')")
    public ResponseEntity<ApiResponse<AssetResponse>> createAsset(@Valid @RequestBody CreateAssetRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ApiResponse<>(201, "Asset created successfully", assetService.createAsset(request)));
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

    @PatchMapping("/{id}")
    @PreAuthorize("hasRole('SUPER_ADMIN') or hasAuthority('UPDATE_ASSET')")
    public ResponseEntity<ApiResponse<AssetResponse>> updateAsset(@PathVariable @NonNull Long id,
            @Valid @RequestBody com.tid.asset_management_bridge.asset_module.dto.UpdateAssetRequest request) {
        return ResponseEntity
                .ok(new ApiResponse<>(200, "Asset updated successfully", assetService.updateAsset(id, request)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('SUPER_ADMIN') or hasAuthority('DELETE_ASSET')")
    public ResponseEntity<ApiResponse<Void>> deleteAsset(@PathVariable @NonNull Long id) {
        assetService.deleteAsset(id);
        return ResponseEntity.ok(new ApiResponse<>(200, "Asset deleted successfully"));
    }

}
