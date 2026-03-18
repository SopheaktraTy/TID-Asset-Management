package com.tid.asset_management_bridge.asset_procurements_module.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public class ProcurementResponse {

    private Long id;
    private Long assetId;
    private LocalDate purchaseDate;
    private String purchaseVendor;
    private BigDecimal purchaseCost;
    private LocalDate warrantyExpiryDate;

    // Getters and Setters

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

    public LocalDate getPurchaseDate() {
        return purchaseDate;
    }

    public void setPurchaseDate(LocalDate purchaseDate) {
        this.purchaseDate = purchaseDate;
    }

    public String getPurchaseVendor() {
        return purchaseVendor;
    }

    public void setPurchaseVendor(String purchaseVendor) {
        this.purchaseVendor = purchaseVendor;
    }

    public BigDecimal getPurchaseCost() {
        return purchaseCost;
    }

    public void setPurchaseCost(BigDecimal purchaseCost) {
        this.purchaseCost = purchaseCost;
    }

    public LocalDate getWarrantyExpiryDate() {
        return warrantyExpiryDate;
    }

    public void setWarrantyExpiryDate(LocalDate warrantyExpiryDate) {
        this.warrantyExpiryDate = warrantyExpiryDate;
    }
}
