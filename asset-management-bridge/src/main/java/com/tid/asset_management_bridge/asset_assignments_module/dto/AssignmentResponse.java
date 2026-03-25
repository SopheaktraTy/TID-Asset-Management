package com.tid.asset_management_bridge.asset_assignments_module.dto;


import com.tid.asset_management_bridge.asset_assignments_module.entity.DepartmentEnum;
import com.tid.asset_management_bridge.asset_assignments_module.entity.JobTitleEnum;
import java.time.LocalDate;

public class AssignmentResponse {

    private Long id;
    private Long assetId;
    private String assetTag;
    private String deviceName;
    private String assignedTo;
    private DepartmentEnum department;
    private JobTitleEnum jobTitle;
    private String assignedBy;
    private Long assignedByUserId;
    private LocalDate assignedDate;
    private LocalDate returnedDate;
    private String returnCondition;
    private String confirmReturnBy;
    private Long confirmReturnByUserId;

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

    public String getAssignedTo() {
        return assignedTo;
    }

    public void setAssignedTo(String assignedTo) {
        this.assignedTo = assignedTo;
    }

    public DepartmentEnum getDepartment() {
        return department;
    }

    public void setDepartment(DepartmentEnum department) {
        this.department = department;
    }

    public JobTitleEnum getJobTitle() {
        return jobTitle;
    }

    public void setJobTitle(JobTitleEnum jobTitle) {
        this.jobTitle = jobTitle;
    }

    public String getAssignedBy() {
        return assignedBy;
    }

    public void setAssignedBy(String assignedBy) {
        this.assignedBy = assignedBy;
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

    public String getConfirmReturnBy() {
        return confirmReturnBy;
    }

    public void setConfirmReturnBy(String confirmReturnBy) {
        this.confirmReturnBy = confirmReturnBy;
    }

    public Long getAssignedByUserId() {
        return assignedByUserId;
    }

    public void setAssignedByUserId(Long assignedByUserId) {
        this.assignedByUserId = assignedByUserId;
    }

    public Long getConfirmReturnByUserId() {
        return confirmReturnByUserId;
    }

    public void setConfirmReturnByUserId(Long confirmReturnByUserId) {
        this.confirmReturnByUserId = confirmReturnByUserId;
    }

}
