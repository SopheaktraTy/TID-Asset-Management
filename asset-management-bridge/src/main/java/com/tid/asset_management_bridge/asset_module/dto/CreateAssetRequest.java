package com.tid.asset_management_bridge.asset_module.dto;

import com.tid.asset_management_bridge.asset_module.entity.AssetStatus;
import com.tid.asset_management_bridge.asset_module.entity.DeviceType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;

import java.time.LocalDateTime;

public class CreateAssetRequest {

    @NotBlank
    @Size(max = 100)
    private String assetTag;

    @Size(max = 100)
    private String serialNumber;

    @NotBlank
    @Size(max = 150)
    private String deviceName;

    @NotNull
    private DeviceType deviceType;

    @Size(max = 100)
    private String manufacturer;

    @Size(max = 100)
    private String model;

    private AssetStatus status;

    @Size(max = 150)
    private String cpu;

    @PositiveOrZero
    private Integer ramGb;

    @Size(max = 50)
    private String diskType;

    @Size(max = 150)
    private String diskModel;

    @PositiveOrZero
    private Integer storageSizeGb;

    @Positive
    private Double screenSizeInch;

    @Size(max = 100)
    private String operatingSystem;

    @Size(max = 100)
    private String osVersion;

    private Boolean domainJoined;

    @Size(max = 100)
    private String condition;

    private String issueDescription;

    private LocalDateTime lastSecurityCheck;

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

    public DeviceType getDeviceType() {
        return deviceType;
    }

    public void setDeviceType(DeviceType deviceType) {
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

    public AssetStatus getStatus() {
        return status;
    }

    public void setStatus(AssetStatus status) {
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

    public LocalDateTime getLastSecurityCheck() {
        return lastSecurityCheck;
    }

    public void setLastSecurityCheck(LocalDateTime lastSecurityCheck) {
        this.lastSecurityCheck = lastSecurityCheck;
    }
}