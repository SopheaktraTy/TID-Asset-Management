package com.tid.asset_management_bridge.asset_assignments_module.dto;

public class ReturnAssetRequest {

    private String returnCondition;
    private String remark;


    public String getReturnCondition() {
        return returnCondition;
    }

    public void setReturnCondition(String returnCondition) {
        this.returnCondition = returnCondition;
    }

    public String getRemark() {
        return remark;
    }

    public void setRemark(String remark) {
        this.remark = remark;
    }

}
