package com.tid.asset_management_bridge.asset_module.dto;

import com.tid.asset_management_bridge.asset_module.entity.AssetStatusEnum;
import com.tid.asset_management_bridge.asset_module.entity.DeviceTypeEnum;

import java.time.LocalDateTime;

public class AssetResponse {

    private Long id;
    private String assetTag;
    private String serialNumber;
    private String deviceName;
    private DeviceTypeEnum deviceType;
    private String manufacturer;
    private String model;
    private AssetStatusEnum status;
    private String cpu;
    private Integer ramGb;
    private String diskType;
    private String diskModel;
    private Integer storageSizeGb;
    private Double screenSizeInch;
    private String operatingSystem;
    private String osVersion;
    private Boolean domainJoined;
    private String condition;
    private String issueDescription;
    private String image;
    private LocalDateTime lastSecurityCheck;
    private String latestUsed;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getAssetTag() {
        return assetTag;
    }

    public void setAssetTag(String assetTag) {
        this.assetTag = assetTag;
    }

    public String getSerialNumber() {
        return serialNumber;
    }

    public void setSerialNumber(String serialNumber) {
        this.serialNumber = serialNumber;
    }

    public String getDeviceName() {
        return deviceName;
    }

    public void setDeviceName(String deviceName) {
        this.deviceName = deviceName;
    }

    public DeviceTypeEnum getDeviceType() {
        return deviceType;
    }

    public void setDeviceType(DeviceTypeEnum deviceType) {
        this.deviceType = deviceType;
    }

    public String getManufacturer() {
        return manufacturer;
    }

    public void setManufacturer(String manufacturer) {
        this.manufacturer = manufacturer;
    }

    public String getModel() {
        return model;
    }

    public void setModel(String model) {
        this.model = model;
    }

    public AssetStatusEnum getStatus() {
        return status;
    }

    public void setStatus(AssetStatusEnum status) {
        this.status = status;
    }

    public String getCpu() {
        return cpu;
    }

    public void setCpu(String cpu) {
        this.cpu = cpu;
    }

    public Integer getRamGb() {
        return ramGb;
    }

    public void setRamGb(Integer ramGb) {
        this.ramGb = ramGb;
    }

    public String getDiskType() {
        return diskType;
    }

    public void setDiskType(String diskType) {
        this.diskType = diskType;
    }

    public String getDiskModel() {
        return diskModel;
    }

    public void setDiskModel(String diskModel) {
        this.diskModel = diskModel;
    }

    public Integer getStorageSizeGb() {
        return storageSizeGb;
    }

    public void setStorageSizeGb(Integer storageSizeGb) {
        this.storageSizeGb = storageSizeGb;
    }

    public Double getScreenSizeInch() {
        return screenSizeInch;
    }

    public void setScreenSizeInch(Double screenSizeInch) {
        this.screenSizeInch = screenSizeInch;
    }

    public String getOperatingSystem() {
        return operatingSystem;
    }

    public void setOperatingSystem(String operatingSystem) {
        this.operatingSystem = operatingSystem;
    }

    public String getOsVersion() {
        return osVersion;
    }

    public void setOsVersion(String osVersion) {
        this.osVersion = osVersion;
    }

    public Boolean getDomainJoined() {
        return domainJoined;
    }

    public void setDomainJoined(Boolean domainJoined) {
        this.domainJoined = domainJoined;
    }

    public String getCondition() {
        return condition;
    }

    public void setCondition(String condition) {
        this.condition = condition;
    }

    public String getIssueDescription() {
        return issueDescription;
    }

    public void setIssueDescription(String issueDescription) {
        this.issueDescription = issueDescription;
    }

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public LocalDateTime getLastSecurityCheck() {
        return lastSecurityCheck;
    }

    public void setLastSecurityCheck(LocalDateTime lastSecurityCheck) {
        this.lastSecurityCheck = lastSecurityCheck;
    }

    public String getLatestUsed() {
        return latestUsed;
    }

    public void setLatestUsed(String latestUsed) {
        this.latestUsed = latestUsed;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}