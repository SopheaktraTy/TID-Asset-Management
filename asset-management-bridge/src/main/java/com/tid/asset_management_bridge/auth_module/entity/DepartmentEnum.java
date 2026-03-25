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

    private final String displayName;
    private final String shortName;

    DepartmentEnum(String displayName, String shortName) {
        this.displayName = displayName;
        this.shortName = shortName;
    }

    public String getDisplayName() {
        return displayName;
    }

    public String getShortName() {
        return shortName;
    }
}
