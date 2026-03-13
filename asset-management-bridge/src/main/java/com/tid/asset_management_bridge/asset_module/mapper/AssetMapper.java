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
        asset.setImage(request.getImage());
        asset.setLastSecurityCheck(request.getLastSecurityCheck());
        return asset;
    }

    public void partialUpdate(com.tid.asset_management_bridge.asset_module.dto.UpdateAssetRequest request, Asset asset) {
        if (request.getAssetTag() != null) asset.setAssetTag(request.getAssetTag());
        if (request.getSerialNumber() != null) asset.setSerialNumber(request.getSerialNumber());
        if (request.getDeviceName() != null) asset.setDeviceName(request.getDeviceName());
        if (request.getDeviceType() != null) asset.setDeviceType(request.getDeviceType());
        if (request.getManufacturer() != null) asset.setManufacturer(request.getManufacturer());
        if (request.getModel() != null) asset.setModel(request.getModel());
        if (request.getStatus() != null) asset.setStatus(request.getStatus());
        if (request.getCpu() != null) asset.setCpu(request.getCpu());
        if (request.getRamGb() != null) asset.setRamGb(request.getRamGb());
        if (request.getDiskType() != null) asset.setDiskType(request.getDiskType());
        if (request.getDiskModel() != null) asset.setDiskModel(request.getDiskModel());
        if (request.getStorageSizeGb() != null) asset.setStorageSizeGb(request.getStorageSizeGb());
        if (request.getScreenSizeInch() != null) asset.setScreenSizeInch(request.getScreenSizeInch());
        if (request.getOperatingSystem() != null) asset.setOperatingSystem(request.getOperatingSystem());
        if (request.getOsVersion() != null) asset.setOsVersion(request.getOsVersion());
        if (request.getDomainJoined() != null) asset.setDomainJoined(request.getDomainJoined());
        if (request.getCondition() != null) asset.setCondition(request.getCondition());
        if (request.getIssueDescription() != null) asset.setIssueDescription(request.getIssueDescription());
        if (request.getImage() != null) asset.setImage(request.getImage());
        if (request.getLastSecurityCheck() != null) asset.setLastSecurityCheck(request.getLastSecurityCheck());
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
        response.setImage(asset.getImage());
        response.setLastSecurityCheck(asset.getLastSecurityCheck());
        response.setCreatedAt(asset.getCreatedAt());
        response.setUpdatedAt(asset.getUpdatedAt());
        return response;
    }
}