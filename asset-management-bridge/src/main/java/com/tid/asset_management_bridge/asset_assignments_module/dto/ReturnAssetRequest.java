package com.tid.asset_management_bridge.asset_assignments_module.dto;

public class ReturnAssetRequest {

    private String returnCondition;

    private String notes;

    public String getReturnCondition() {
        return returnCondition;
    }

    public void setReturnCondition(String returnCondition) {
        this.returnCondition = returnCondition;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }
}
