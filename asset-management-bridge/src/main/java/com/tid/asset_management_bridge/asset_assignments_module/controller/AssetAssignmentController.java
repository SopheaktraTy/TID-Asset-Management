package com.tid.asset_management_bridge.asset_assignments_module.controller;

import com.tid.asset_management_bridge.asset_assignments_module.dto.AssignAssetRequest;
import com.tid.asset_management_bridge.asset_assignments_module.dto.AssignmentResponse;
import com.tid.asset_management_bridge.asset_assignments_module.dto.ReturnAssetRequest;
import com.tid.asset_management_bridge.asset_assignments_module.dto.UpdateAssetAssignmentRequest;
import com.tid.asset_management_bridge.asset_assignments_module.service.AssetAssignmentService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class AssetAssignmentController {

    private final AssetAssignmentService assignmentService;

    public AssetAssignmentController(AssetAssignmentService assignmentService) {
        this.assignmentService = assignmentService;
    }

    @PostMapping("/assets/{id}/assignments")
    @ResponseStatus(HttpStatus.CREATED)
    public AssignmentResponse assignAsset(@PathVariable @NonNull Long id,
                                          @Valid @RequestBody AssignAssetRequest request) {
        return assignmentService.assignAsset(id, request);
    }

    @PostMapping("/assignments/{id}/return")
    public AssignmentResponse returnAsset(@PathVariable @NonNull Long id, @RequestBody ReturnAssetRequest request) {
        return assignmentService.returnAsset(id, request);
    }

    @GetMapping("/assets/{id}/assignments")
    public List<AssignmentResponse> getAssetAssignments(@PathVariable @NonNull Long id) {
        return assignmentService.getAssetAssignments(id);
    }

    @PutMapping("/assignments/{id}")
    public AssignmentResponse updateAssetAssignment(@PathVariable @NonNull Long id, @RequestBody UpdateAssetAssignmentRequest request) {
        return assignmentService.updateAssetAssignment(id, request);
    }

    @DeleteMapping("/assignments/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteAssetAssignment(@PathVariable @NonNull Long id) {
        assignmentService.deleteAssetAssignment(id);
    }
}
