package com.tid.asset_management_bridge.asset_module.mapper;

import com.tid.asset_management_bridge.asset_module.dto.CreateAssetRequest;
import com.tid.asset_management_bridge.asset_module.dto.UpdateAssetRequest;
import com.tid.asset_management_bridge.asset_module.dto.AssetResponse;
import com.tid.asset_management_bridge.asset_module.entity.Asset;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(componentModel = "spring", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface AssetMapper {

    Asset toEntity(CreateAssetRequest request);

    void partialUpdate(UpdateAssetRequest request, @MappingTarget Asset asset);

    AssetResponse toResponse(Asset asset);
}