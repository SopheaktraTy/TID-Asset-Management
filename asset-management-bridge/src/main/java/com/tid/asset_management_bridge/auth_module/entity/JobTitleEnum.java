package com.tid.asset_management_bridge.auth_module.entity;

public enum JobTitleEnum {
    ASSISTANT_MANAGER("Assistant Manager"),
    ASSOCIATE("Associate"),
    ASSOCIATE_DIRECTOR("Associate Director"),
    CONSULTANT("Consultant"),
    DIRECTOR("Director"),
    EXECUTIVE("Executive"),
    EXECUTIVE_ASSISTANT("Executive Assistant"),
    INTERN("Intern"),
    MANAGER("Manager"),
    PERSONAL_ASSISTANT_TO_MANAGING_PARTNER("Personal Assistant to Managing Partner"),
    RECEPTIONIST("Receptionist"),
    SENIOR_ADMIN_EXECUTIVE("Senior Admin Executive"),
    SENIOR_ASSOCIATE("Senior Associate"),
    SENIOR_CONSULTANT("Senior Consultant"),
    SENIOR_EXECUTIVE("Senior Executive"),
    SENIOR_IT_EXECUTIVE("Senior IT Executive"),
    SENIOR_MANAGER("Senior Manager"),
    SUPERVISOR("Supervisor");

    private final String value;

    JobTitleEnum(String value) {
        this.value = value;
    }

    public String getValue() {
        return value;
    }
}
