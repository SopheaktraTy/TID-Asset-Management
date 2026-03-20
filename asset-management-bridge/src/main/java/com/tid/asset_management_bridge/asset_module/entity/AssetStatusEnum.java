package com.tid.asset_management_bridge.asset_module.entity;

public enum AssetStatusEnum {
    AVAILABLE("Available"),
    IN_USE("In Use"),
    DAMAGED("Damaged"),
    UNDER_REPAIR("Under Repair"),
    LOST("Lost"),
    MALFUNCTION("Malfunction"),
    MAINTENANCE("Maintenance"),
    OTHER("Other");

    private final String value;

    AssetStatusEnum(String value) {
        this.value = value;
    }

    public String getValue() {
        return value;
    }
}