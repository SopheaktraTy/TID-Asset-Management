package com.tid.asset_management_bridge.asset_procurements_module.dto;

import jakarta.validation.constraints.Min;
import java.math.BigDecimal;
import java.time.LocalDate;

public class ProcurementRequest {

    private LocalDate purchaseDate;

    private String purchaseVendor;

    @Min(value = 0, message = "Purchase cost cannot be negative")
    private BigDecimal purchaseCost;

    private LocalDate warrantyExpiryDate;

    // Getters and Setters

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
