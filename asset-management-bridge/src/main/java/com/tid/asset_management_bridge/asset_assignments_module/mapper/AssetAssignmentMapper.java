package com.tid.asset_management_bridge.asset_assignments_module.mapper;

import com.tid.asset_management_bridge.asset_assignments_module.dto.AssignAssetRequest;
import com.tid.asset_management_bridge.asset_assignments_module.dto.AssignmentResponse;
import com.tid.asset_management_bridge.asset_assignments_module.entity.AssetAssignment;
import org.springframework.stereotype.Component;

@Component
public class AssetAssignmentMapper {

    public AssetAssignment toEntity(AssignAssetRequest request) {
        AssetAssignment assignment = new AssetAssignment();
        assignment.setAssignedTo(request.getAssignedTo());
        assignment.setDepartment(request.getDepartment());
        assignment.setJobTitle(request.getJobTitle());
        assignment.setAssignedBy(request.getAssignedBy());
        assignment.setNotes(request.getNotes());
        return assignment;
    }

    public AssignmentResponse toResponse(AssetAssignment assignment) {
        AssignmentResponse response = new AssignmentResponse();
        response.setId(assignment.getId());
        response.setAssetId(assignment.getAsset().getId());
        response.setAssetTag(assignment.getAsset().getAssetTag());
        response.setDeviceName(assignment.getAsset().getDeviceName());
        response.setAssignedTo(assignment.getAssignedTo());
        response.setDepartment(assignment.getDepartment());
        response.setJobTitle(assignment.getJobTitle());
        response.setAssignedBy(assignment.getAssignedBy());
        response.setAssignedDate(assignment.getAssignedDate());
        response.setReturnedDate(assignment.getReturnedDate());
        response.setReturnCondition(assignment.getReturnCondition());
        response.setNotes(assignment.getNotes());
        return response;
    }
}

