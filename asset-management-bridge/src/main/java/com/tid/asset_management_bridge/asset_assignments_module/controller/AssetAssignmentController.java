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
import org.springframework.http.ResponseEntity;
import com.tid.asset_management_bridge.common.dto.ApiResponse;

import java.util.List;
import org.springframework.security.access.prepost.PreAuthorize;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;

@RestController
@RequestMapping("/api")
@SecurityRequirement(name = "bearerAuth")
public class AssetAssignmentController {

    private final AssetAssignmentService assignmentService;

    public AssetAssignmentController(AssetAssignmentService assignmentService) {
        this.assignmentService = assignmentService;
    }

    @PostMapping("/assets/{id}/assignments")
    @PreAuthorize("hasRole('SUPER_ADMIN') or hasAuthority('CREATE_ASSIGNMENT')")
    public ResponseEntity<ApiResponse<AssignmentResponse>> assignAsset(@PathVariable @NonNull Long id,
            @Valid @RequestBody AssignAssetRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(
                new ApiResponse<>(201, "Asset assigned successfully", assignmentService.assignAsset(id, request)));
    }

    @PostMapping("/assignments/{id}/return")
    @PreAuthorize("hasRole('SUPER_ADMIN') or hasAuthority('UPDATE_ASSIGNMENT')")
    public ResponseEntity<ApiResponse<AssignmentResponse>> returnAsset(@PathVariable @NonNull Long id,
            @RequestBody ReturnAssetRequest request) {
        return ResponseEntity
                .ok(new ApiResponse<>(200, "Asset returned successfully", assignmentService.returnAsset(id, request)));
    }

    @GetMapping("/assets/{id}/assignments")
    @PreAuthorize("hasRole('SUPER_ADMIN') or hasAuthority('READ_ASSIGNMENT')")
    public ResponseEntity<ApiResponse<List<AssignmentResponse>>> getAssetAssignments(@PathVariable @NonNull Long id) {
        return ResponseEntity.ok(new ApiResponse<>(200, "Asset assignments retrieved successfully",
                assignmentService.getAssetAssignments(id)));
    }

    @PutMapping("/assignments/{id}")
    @PreAuthorize("hasRole('SUPER_ADMIN') or hasAuthority('UPDATE_ASSIGNMENT')")
    public ResponseEntity<ApiResponse<AssignmentResponse>> updateAssetAssignment(@PathVariable @NonNull Long id,
            @RequestBody UpdateAssetAssignmentRequest request) {
        return ResponseEntity.ok(new ApiResponse<>(200, "Asset assignment updated successfully",
                assignmentService.updateAssetAssignment(id, request)));
    }

    @DeleteMapping("/assignments/{id}")
    @PreAuthorize("hasRole('SUPER_ADMIN') or hasAuthority('DELETE_ASSIGNMENT')")
    public ResponseEntity<ApiResponse<Void>> deleteAssetAssignment(@PathVariable @NonNull Long id) {
        assignmentService.deleteAssetAssignment(id);
        return ResponseEntity.ok(new ApiResponse<>(200, "Asset assignment deleted successfully"));
    }
}
