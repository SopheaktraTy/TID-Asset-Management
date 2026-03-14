package com.tid.asset_management_bridge.asset_module.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "assets", uniqueConstraints = {
        @UniqueConstraint(name = "uk_assets_asset_tag", columnNames = "asset_tag"),
        @UniqueConstraint(name = "uk_assets_serial_number", columnNames = "serial_number")
})
public class Asset {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "asset_tag", nullable = false, length = 100)
    private String assetTag;

    @Column(name = "serial_number", length = 100)
    private String serialNumber;

    @Column(name = "device_name", nullable = false, length = 150)
    private String deviceName;

    @Enumerated(EnumType.STRING)
    @Column(name = "device_type", nullable = false, length = 50)
    private DeviceTypeEnum deviceType;

    @Column(name = "manufacturer", length = 100)
    private String manufacturer;

    @Column(name = "model", length = 100)
    private String model;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 50)
    private AssetStatusEnum status;

    @Column(name = "cpu", length = 150)
    private String cpu;

    @Column(name = "ram_gb")
    private Integer ramGb;

    @Column(name = "disk_type", length = 50)
    private String diskType;

    @Column(name = "disk_model", length = 150)
    private String diskModel;

    @Column(name = "storage_size_gb")
    private Integer storageSizeGb;

    @Column(name = "screen_size_inch")
    private Double screenSizeInch;

    @Column(name = "operating_system", length = 100)
    private String operatingSystem;

    @Column(name = "os_version", length = 100)
    private String osVersion;

    @Column(name = "domain_joined")
    private Boolean domainJoined;

    @Column(name = "condition", length = 100)
    private String condition;

    @Column(name = "issue_description", columnDefinition = "TEXT")
    private String issueDescription;

    @Column(name = "image", columnDefinition = "TEXT")
    private String image;

    @Column(name = "last_security_check")
    private LocalDateTime lastSecurityCheck;

    @Column(name = "latest_used", length = 255)
    private String latestUsed;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    public void prePersist() {
        LocalDateTime now = LocalDateTime.now();
        this.createdAt = now;
        this.updatedAt = now;

        if (this.status == null) {
            this.status = AssetStatusEnum.AVAILABLE;
        }
        if (this.domainJoined == null) {
            this.domainJoined = Boolean.FALSE;
        }
    }

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
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

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
}