package com.tid.asset_management_bridge.asset_module.entity;

public enum DeviceTypeEnum {
    LAPTOP("Laptop"),
    DESKTOP("Desktop"),
    PORTABLE_MONITOR("Portable Monitor"),
    STAND_MONITOR("Stand Monitor");

    private final String value;

    DeviceTypeEnum(String value) {
        this.value = value;
    }

    public String getValue() {
        return value;
    }
}