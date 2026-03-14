package com.tid.asset_management_bridge.asset_assignments_module.entity;

public enum DepartmentEnum {
    OFFICE_ADMIN("Office Admin"),
    TAX_ACCOUNTING_ADVISORY("Tax & Accounting Advisory"),
    LEGAL_CORPORATE_ADVISORY("Legal & Corporate Advisory"),
    AUDIT_ASSURANCE("Audit & Assurance"),
    PRACTICE_DEVELOPMENT_MANAGEMENT("Practice Development & Management"),
    CLIENT_OPERATION_MANAGEMENT("Client & Operation Management"),
    FINANCE_HUMAN_RESOURCE("Finance & Human Resource"),
    TECHNOLOGY_INNOVATION_DEVELOPMENT("Technology Innovation and Development");

    private final String value;

    DepartmentEnum(String value) {
        this.value = value;
    }

    public String getValue() {
        return value;
    }
}
