package com.tid.asset_management_bridge.asset_issues_module.mapper;

import com.tid.asset_management_bridge.asset_issues_module.dto.IssueResponse;
import com.tid.asset_management_bridge.asset_issues_module.dto.ReportIssueRequest;
import com.tid.asset_management_bridge.asset_issues_module.entity.AssetIssue;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface AssetIssueMapper {

    AssetIssue toEntity(ReportIssueRequest request);

    @Mapping(source = "asset.id", target = "assetId")
    @Mapping(source = "asset.assetTag", target = "assetTag")
    @Mapping(source = "asset.deviceName", target = "deviceName")
    IssueResponse toResponse(AssetIssue issue);
}
