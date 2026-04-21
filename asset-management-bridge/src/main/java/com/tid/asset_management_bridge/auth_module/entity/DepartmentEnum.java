package com.tid.asset_management_bridge.auth_module.entity;

public enum DepartmentEnum {
    OFFICE_ADMIN("Office Admin", "OA"),
    TAX_ACCOUNTING_ADVISORY("Tax & Accounting Advisory", "TAA"),
    LEGAL_CORPORATE_ADVISORY("Legal & Corporate Advisory", "LCA"),
    AUDIT_ASSURANCE("Audit & Assurance", "AA"),
    PRACTICE_DEVELOPMENT_MANAGEMENT("Practice Development & Management", "PDM"),
    CLIENT_OPERATION_MANAGEMENT("Client & Operation Management", "COM"),
    FINANCE_HUMAN_RESOURCE("Finance & Human Resource", "FHR"),
    TECHNOLOGY_INNOVATION_DEVELOPMENT("Technology Innovation and Development", "TID");

    private final String value;
    private final String shortName;

    DepartmentEnum(String value, String shortName) {
        this.value = value;
        this.shortName = shortName;
    }

    public String getValue() {
        return value;
    }

    public String getShortName() {
        return shortName;
    }
}
