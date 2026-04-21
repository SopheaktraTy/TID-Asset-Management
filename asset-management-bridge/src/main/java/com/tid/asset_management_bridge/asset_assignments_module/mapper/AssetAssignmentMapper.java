package com.tid.asset_management_bridge.asset_assignments_module.mapper;

import com.tid.asset_management_bridge.asset_assignments_module.dto.AssignAssetRequest;
import com.tid.asset_management_bridge.asset_assignments_module.dto.AssignmentResponse;
import com.tid.asset_management_bridge.asset_assignments_module.entity.AssetAssignment;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring", uses = {com.tid.asset_management_bridge.auth_module.mapper.UserMapper.class})
public interface AssetAssignmentMapper {

    AssetAssignment toEntity(AssignAssetRequest request);

    @Mapping(source = "asset.id", target = "assetId")
    @Mapping(source = "asset.assetTag", target = "assetTag")
    @Mapping(source = "asset.deviceName", target = "deviceName")
    @Mapping(source = "employee", target = "employee")
    @Mapping(source = "assignedByUser", target = "assignedByUser")
    @Mapping(source = "confirmReturnByUser", target = "confirmReturnByUser")
    AssignmentResponse toResponse(AssetAssignment assignment);
}
