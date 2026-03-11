package com.tid.asset_management_bridge.asset_module.mapper;

import com.tid.asset_management_bridge.asset_module.dto.CreateAssetRequest;
import com.tid.asset_management_bridge.asset_module.dto.AssetResponse;
import com.tid.asset_management_bridge.asset_module.entity.Asset;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Component;

@Component
public class AssetMapper {

    @NonNull
    public Asset toEntity(CreateAssetRequest request) {
        Asset asset = new Asset();
        asset.setAssetTag(request.getAssetTag());
        asset.setSerialNumber(request.getSerialNumber());
        asset.setDeviceName(request.getDeviceName());
        asset.setDeviceType(request.getDeviceType());
        asset.setManufacturer(request.getManufacturer());
        asset.setModel(request.getModel());
        asset.setStatus(request.getStatus());
        asset.setCpu(request.getCpu());
        asset.setRamGb(request.getRamGb());
        asset.setDiskType(request.getDiskType());
        asset.setDiskModel(request.getDiskModel());
        asset.setStorageSizeGb(request.getStorageSizeGb());
        asset.setScreenSizeInch(request.getScreenSizeInch());
        asset.setOperatingSystem(request.getOperatingSystem());
        asset.setOsVersion(request.getOsVersion());
        asset.setDomainJoined(request.getDomainJoined());
        asset.setCondition(request.getCondition());
        asset.setIssueDescription(request.getIssueDescription());
        asset.setLastSecurityCheck(request.getLastSecurityCheck());
        return asset;
    }

    public AssetResponse toResponse(Asset asset) {
        AssetResponse response = new AssetResponse();
        response.setId(asset.getId());
        response.setAssetTag(asset.getAssetTag());
        response.setSerialNumber(asset.getSerialNumber());
        response.setDeviceName(asset.getDeviceName());
        response.setDeviceType(asset.getDeviceType());
        response.setManufacturer(asset.getManufacturer());
        response.setModel(asset.getModel());
        response.setStatus(asset.getStatus());
        response.setCpu(asset.getCpu());
        response.setRamGb(asset.getRamGb());
        response.setDiskType(asset.getDiskType());
        response.setDiskModel(asset.getDiskModel());
        response.setStorageSizeGb(asset.getStorageSizeGb());
        response.setScreenSizeInch(asset.getScreenSizeInch());
        response.setOperatingSystem(asset.getOperatingSystem());
        response.setOsVersion(asset.getOsVersion());
        response.setDomainJoined(asset.getDomainJoined());
        response.setCondition(asset.getCondition());
        response.setIssueDescription(asset.getIssueDescription());
        response.setLastSecurityCheck(asset.getLastSecurityCheck());
        response.setCreatedAt(asset.getCreatedAt());
        response.setUpdatedAt(asset.getUpdatedAt());
        return response;
    }
}