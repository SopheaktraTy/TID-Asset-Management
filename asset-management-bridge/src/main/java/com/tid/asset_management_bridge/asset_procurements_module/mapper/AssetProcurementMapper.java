package com.tid.asset_management_bridge.asset_procurements_module.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

import com.tid.asset_management_bridge.asset_procurements_module.dto.ProcurementRequest;
import com.tid.asset_management_bridge.asset_procurements_module.dto.ProcurementResponse;
import com.tid.asset_management_bridge.asset_procurements_module.entity.AssetProcurement;

@Mapper(componentModel = "spring", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface AssetProcurementMapper {

    AssetProcurement toEntity(ProcurementRequest request);

    @Mapping(source = "asset.id", target = "assetId")
    ProcurementResponse toResponse(AssetProcurement entity);

    void updateEntityFromRequest(ProcurementRequest request, @MappingTarget AssetProcurement entity);
}
