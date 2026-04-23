package com.tid.asset_management_bridge.asset_assignments_module.dto;


import java.time.LocalDate;
import com.tid.asset_management_bridge.employee_management_module.dto.EmployeeResponse;
import com.tid.asset_management_bridge.user_management_module.dto.UserResponse;

public class AssignmentResponse {

    private Long id;
    private Long assetId;
    private String assetTag;
    private String deviceName;
    private EmployeeResponse employee;
    private UserResponse assignedByUser;
    private LocalDate assignedDate;
    private LocalDate returnedDate;
    private String returnCondition;
    private UserResponse confirmReturnByUser;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getAssetId() {
        return assetId;
    }

    public void setAssetId(Long assetId) {
        this.assetId = assetId;
    }

    public String getAssetTag() {
        return assetTag;
    }

    public void setAssetTag(String assetTag) {
        this.assetTag = assetTag;
    }

    public String getDeviceName() {
        return deviceName;
    }

    public void setDeviceName(String deviceName) {
        this.deviceName = deviceName;
    }

    public EmployeeResponse getEmployee() {
        return employee;
    }

    public void setEmployee(EmployeeResponse employee) {
        this.employee = employee;
    }


    public LocalDate getAssignedDate() {
        return assignedDate;
    }

    public void setAssignedDate(LocalDate assignedDate) {
        this.assignedDate = assignedDate;
    }

    public LocalDate getReturnedDate() {
        return returnedDate;
    }

    public void setReturnedDate(LocalDate returnedDate) {
        this.returnedDate = returnedDate;
    }

    public String getReturnCondition() {
        return returnCondition;
    }

    public void setReturnCondition(String returnCondition) {
        this.returnCondition = returnCondition;
    }


    public UserResponse getAssignedByUser() {
        return assignedByUser;
    }

    public void setAssignedByUser(UserResponse assignedByUser) {
        this.assignedByUser = assignedByUser;
    }

    public UserResponse getConfirmReturnByUser() {
        return confirmReturnByUser;
    }

    public void setConfirmReturnByUser(UserResponse confirmReturnByUser) {
        this.confirmReturnByUser = confirmReturnByUser;
    }

}
