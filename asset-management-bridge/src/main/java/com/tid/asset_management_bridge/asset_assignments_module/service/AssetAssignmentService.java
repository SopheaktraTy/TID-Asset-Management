package com.tid.asset_management_bridge.asset_assignments_module.service;

import com.tid.asset_management_bridge.asset_assignments_module.dto.AssignAssetRequest;
import com.tid.asset_management_bridge.asset_assignments_module.dto.AssignmentResponse;
import com.tid.asset_management_bridge.asset_assignments_module.dto.ReturnAssetRequest;
import com.tid.asset_management_bridge.asset_assignments_module.dto.UpdateAssetAssignmentRequest;

import org.springframework.lang.NonNull;

import java.util.List;

public interface AssetAssignmentService {
    AssignmentResponse assignAsset(@NonNull Long assetId, AssignAssetRequest request);
    AssignmentResponse returnAsset(@NonNull Long assignmentId, ReturnAssetRequest request);
    AssignmentResponse updateAssetAssignment(@NonNull Long assignmentId, UpdateAssetAssignmentRequest request);
    List<AssignmentResponse> getAssetAssignments(@NonNull Long assetId);
    void deleteAssetAssignment(@NonNull Long assignmentId);
}
