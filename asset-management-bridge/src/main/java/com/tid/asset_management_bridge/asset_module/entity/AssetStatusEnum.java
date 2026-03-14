package com.tid.asset_management_bridge.asset_module.entity;

public enum AssetStatusEnum {
    AVAILABLE("Available"),
    IN_USE("In Use"),
    UNDER_REPAIR("Under Repair"),
    LOST("Lost"),
    DAMAGED("Damaged");

    private final String value;

    AssetStatusEnum(String value) {
        this.value = value;
    }

    public String getValue() {
        return value;
    }
}