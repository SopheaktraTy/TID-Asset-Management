package com.tid.asset_management_bridge.asset_procurements_module.controller;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.*;

import com.tid.asset_management_bridge.asset_procurements_module.dto.ProcurementRequest;
import com.tid.asset_management_bridge.asset_procurements_module.dto.ProcurementResponse;
import com.tid.asset_management_bridge.asset_procurements_module.service.AssetProcurementService;

@RestController
@RequestMapping("/api")
public class AssetProcurementController {

    private final AssetProcurementService procurementService;

    public AssetProcurementController(AssetProcurementService procurementService) {
        this.procurementService = procurementService;
    }

    @PostMapping("/assets/{id}/procurement")
    @ResponseStatus(HttpStatus.CREATED)
    public ProcurementResponse createProcurement(@PathVariable @NonNull Long id,
            @Valid @RequestBody ProcurementRequest request) {
        return procurementService.createProcurement(id, request);
    }

    @PatchMapping("/assets/{id}/procurement")
    public ProcurementResponse updateProcurement(@PathVariable @NonNull Long id,
            @Valid @RequestBody ProcurementRequest request) {
        return procurementService.updateProcurement(id, request);
    }

    @GetMapping("/assets/{id}/procurement")
    public ProcurementResponse getProcurement(@PathVariable @NonNull Long id) {
        return procurementService.getProcurementByAssetId(id);
    }

    @DeleteMapping("/assets/{id}/procurement")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteProcurement(@PathVariable @NonNull Long id) {
        procurementService.deleteProcurement(id);
    }
}
