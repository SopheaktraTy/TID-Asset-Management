package com.tid.asset_management_bridge.asset_assignments_module.entity;

import com.tid.asset_management_bridge.asset_module.entity.Asset;
import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "asset_assignments")
public class AssetAssignment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "asset_id", nullable = false)
    private Asset asset;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employee_id", nullable = false)
    private com.tid.asset_management_bridge.employee_management_module.entity.Employee employee;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assigned_by_user_id")
    private com.tid.asset_management_bridge.auth_module.entity.User assignedByUser;

    @Column(name = "assigned_date", nullable = false, updatable = false)
    private LocalDate assignedDate;

    @Column(name = "returned_date")
    private LocalDate returnedDate;

    @Column(name = "return_condition", length = 100)
    private String returnCondition;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "confirm_return_by_user_id")
    private com.tid.asset_management_bridge.auth_module.entity.User confirmReturnByUser;

    @Column(name = "remark", columnDefinition = "TEXT")
    private String remark;


    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    public void prePersist() {
        LocalDateTime now = LocalDateTime.now();
        this.createdAt = now;
        this.updatedAt = now;
        if (this.assignedDate == null) {
            this.assignedDate = LocalDate.now();
        }
    }

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    // Getters and Setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Asset getAsset() {
        return asset;
    }

    public void setAsset(Asset asset) {
        this.asset = asset;
    }

    public com.tid.asset_management_bridge.employee_management_module.entity.Employee getEmployee() {
        return employee;
    }

    public void setEmployee(com.tid.asset_management_bridge.employee_management_module.entity.Employee employee) {
        this.employee = employee;
    }


    public com.tid.asset_management_bridge.auth_module.entity.User getAssignedByUser() {
        return assignedByUser;
    }

    public void setAssignedByUser(com.tid.asset_management_bridge.auth_module.entity.User assignedByUser) {
        this.assignedByUser = assignedByUser;
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


    public com.tid.asset_management_bridge.auth_module.entity.User getConfirmReturnByUser() {
        return confirmReturnByUser;
    }

    public void setConfirmReturnByUser(com.tid.asset_management_bridge.auth_module.entity.User confirmReturnByUser) {
        this.confirmReturnByUser = confirmReturnByUser;
    }

    public String getRemark() {
        return remark;
    }

    public void setRemark(String remark) {
        this.remark = remark;
    }


    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
}
