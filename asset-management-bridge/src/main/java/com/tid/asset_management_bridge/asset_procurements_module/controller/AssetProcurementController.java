package com.tid.asset_management_bridge.asset_procurements_module.controller;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import com.tid.asset_management_bridge.common.dto.ApiResponse;

import com.tid.asset_management_bridge.asset_procurements_module.dto.ProcurementRequest;
import com.tid.asset_management_bridge.asset_procurements_module.dto.ProcurementResponse;
import com.tid.asset_management_bridge.asset_procurements_module.service.AssetProcurementService;
import org.springframework.security.access.prepost.PreAuthorize;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;

@RestController
@RequestMapping("/api")
@SecurityRequirement(name = "bearerAuth")
public class AssetProcurementController {

    private final AssetProcurementService procurementService;

    public AssetProcurementController(AssetProcurementService procurementService) {
        this.procurementService = procurementService;
    }

    @PostMapping("/assets/{id}/procurement")
    @PreAuthorize("hasRole('SUPER_ADMIN') or hasAuthority('CREATE_PROCUREMENT')")
    public ResponseEntity<ApiResponse<ProcurementResponse>> createProcurement(@PathVariable @NonNull Long id,
            @Valid @RequestBody ProcurementRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(new ApiResponse<>(201, "Procurement created successfully",
                procurementService.createProcurement(id, request)));
    }

    @PatchMapping("/assets/{id}/procurement")
    @PreAuthorize("hasRole('SUPER_ADMIN') or hasAuthority('UPDATE_PROCUREMENT')")
    public ResponseEntity<ApiResponse<ProcurementResponse>> updateProcurement(@PathVariable @NonNull Long id,
            @Valid @RequestBody ProcurementRequest request) {
        return ResponseEntity.ok(new ApiResponse<>(200, "Procurement updated successfully",
                procurementService.updateProcurement(id, request)));
    }

    @GetMapping("/assets/{id}/procurement")
    @PreAuthorize("hasRole('SUPER_ADMIN') or hasAuthority('READ_PROCUREMENT')")
    public ResponseEntity<ApiResponse<ProcurementResponse>> getProcurement(@PathVariable @NonNull Long id) {
        return ResponseEntity.ok(new ApiResponse<>(200, "Procurement retrieved successfully",
                procurementService.getProcurementByAssetId(id)));
    }

    @DeleteMapping("/assets/{id}/procurement")
    @PreAuthorize("hasRole('SUPER_ADMIN') or hasAuthority('DELETE_PROCUREMENT')")
    public ResponseEntity<ApiResponse<Void>> deleteProcurement(@PathVariable @NonNull Long id) {
        procurementService.deleteProcurement(id);
        return ResponseEntity.ok(new ApiResponse<>(200, "Procurement deleted successfully"));
    }
}
