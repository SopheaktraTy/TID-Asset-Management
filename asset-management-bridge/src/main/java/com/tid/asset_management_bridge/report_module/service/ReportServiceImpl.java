package com.tid.asset_management_bridge.report_module.service;


import com.tid.asset_management_bridge.asset_issues_module.entity.IssueStatusEnum;
import com.tid.asset_management_bridge.asset_issues_module.repository.AssetIssueRepository;
import com.tid.asset_management_bridge.asset_module.entity.Asset;
import com.tid.asset_management_bridge.asset_module.entity.AssetStatusEnum;
import com.tid.asset_management_bridge.asset_module.repository.AssetRepository;
import com.tid.asset_management_bridge.asset_procurements_module.entity.AssetProcurement;
import com.tid.asset_management_bridge.asset_procurements_module.repository.AssetProcurementRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class ReportServiceImpl implements ReportService {

    private final AssetRepository assetRepository;
    private final AssetIssueRepository assetIssueRepository;
    private final AssetProcurementRepository assetProcurementRepository;

    public ReportServiceImpl(
            AssetRepository assetRepository,
            AssetIssueRepository assetIssueRepository,
            AssetProcurementRepository assetProcurementRepository) {
        this.assetRepository = assetRepository;
        this.assetIssueRepository = assetIssueRepository;
        this.assetProcurementRepository = assetProcurementRepository;
    }

    // -------------------------------------------------------------------------
    // GET /api/reports/summary
    // Returns high-level counts grouped by asset status + issue breakdown
    // -------------------------------------------------------------------------
    @Override
    @Transactional(readOnly = true)
    public Map<String, Object> getDashboardSummary() {
        long totalAssets      = assetRepository.count();
        long availableAssets  = assetRepository.countByStatus(AssetStatusEnum.AVAILABLE);
        long inUseAssets      = assetRepository.countByStatus(AssetStatusEnum.IN_USE);
        long damagedAssets    = assetRepository.countByStatus(AssetStatusEnum.DAMAGED);
        long underRepair      = assetRepository.countByStatus(AssetStatusEnum.UNDER_REPAIR);
        long maintenance      = assetRepository.countByStatus(AssetStatusEnum.MAINTENANCE);
        long lost             = assetRepository.countByStatus(AssetStatusEnum.LOST);
        long malfunction      = assetRepository.countByStatus(AssetStatusEnum.MALFUNCTION);
        long other            = assetRepository.countByStatus(AssetStatusEnum.OTHER);

        long totalIssues      = assetIssueRepository.count();
        long openIssues       = assetIssueRepository.countByIssueStatus(IssueStatusEnum.OPEN);
        long inProgressIssues = assetIssueRepository.countByIssueStatus(IssueStatusEnum.IN_PROGRESS);
        long resolvedIssues   = assetIssueRepository.countByIssueStatus(IssueStatusEnum.RESOLVED);
        long cantResolved     = assetIssueRepository.countByIssueStatus(IssueStatusEnum.CANT_RESOLVED);

        Map<String, Object> assetBreakdown = new LinkedHashMap<>();
        assetBreakdown.put("available",   availableAssets);
        assetBreakdown.put("inUse",       inUseAssets);
        assetBreakdown.put("damaged",     damagedAssets);
        assetBreakdown.put("underRepair", underRepair);
        assetBreakdown.put("maintenance", maintenance);
        assetBreakdown.put("lost",        lost);
        assetBreakdown.put("malfunction", malfunction);
        assetBreakdown.put("other",       other);

        Map<String, Object> issueBreakdown = new LinkedHashMap<>();
        issueBreakdown.put("open",        openIssues);
        issueBreakdown.put("inProgress",  inProgressIssues);
        issueBreakdown.put("resolved",    resolvedIssues);
        issueBreakdown.put("cantResolved", cantResolved);

        Map<String, Object> summary = new LinkedHashMap<>();
        summary.put("totalAssets",      totalAssets);
        summary.put("assetsByStatus",   assetBreakdown);
        summary.put("totalIssues",      totalIssues);
        summary.put("issuesByStatus",   issueBreakdown);
        return summary;
    }

    // -------------------------------------------------------------------------
    // GET /api/reports/available-assets
    // Returns a flat list of all AVAILABLE assets with their procurement info
    // -------------------------------------------------------------------------
    @Override
    @Transactional(readOnly = true)
    public List<Map<String, Object>> getAvailableAssets() {
        List<Asset> assets = assetRepository.findByStatus(AssetStatusEnum.AVAILABLE);
        List<Map<String, Object>> result = new ArrayList<>();

        for (Asset asset : assets) {
            Map<String, Object> row = buildAssetRow(asset);
            result.add(row);
        }
        return result;
    }

    // -------------------------------------------------------------------------
    // GET /api/reports/issues
    // Returns issue counts grouped by status
    // -------------------------------------------------------------------------
    @Override
    @Transactional(readOnly = true)
    public Map<String, Object> getIssueOverview() {
        long total       = assetIssueRepository.count();
        long open        = assetIssueRepository.countByIssueStatus(IssueStatusEnum.OPEN);
        long inProgress  = assetIssueRepository.countByIssueStatus(IssueStatusEnum.IN_PROGRESS);
        long resolved    = assetIssueRepository.countByIssueStatus(IssueStatusEnum.RESOLVED);
        long cantResolve = assetIssueRepository.countByIssueStatus(IssueStatusEnum.CANT_RESOLVED);

        Map<String, Object> overview = new LinkedHashMap<>();
        overview.put("totalIssues",    total);
        overview.put("openIssues",     open);
        overview.put("inProgress",     inProgress);
        overview.put("resolvedIssues", resolved);
        overview.put("cantResolved",   cantResolve);
        return overview;
    }

    // -------------------------------------------------------------------------
    // GET /api/reports/search/device-detail?searchTerm=xxx
    // Full-text search across deviceName, assetTag, serialNumber
    // -------------------------------------------------------------------------
    @Override
    @Transactional(readOnly = true)
    public Map<String, Object> getDeviceDetail(String searchTerm) {
        List<Asset> matches = searchTerm == null || searchTerm.isBlank()
                ? assetRepository.findAll()
                : assetRepository.searchByTerm(searchTerm.trim());

        List<Map<String, Object>> devices = new ArrayList<>();
        for (Asset asset : matches) {
            devices.add(buildAssetRow(asset));
        }

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("searchTerm",  searchTerm);
        result.put("totalFound",  matches.size());
        result.put("devices",     devices);
        return result;
    }

    // -------------------------------------------------------------------------
    // GET /api/reports/warranty-expiry-date
    // Returns all assets with warranty info, ordered by soonest expiry
    // -------------------------------------------------------------------------
    @Override
    @Transactional(readOnly = true)
    public List<Map<String, Object>> getWarrantyExpiryDate() {
        List<AssetProcurement> procurements = assetProcurementRepository.findAllWithWarrantyOrderedBySoonest();
        List<Map<String, Object>> result = new ArrayList<>();
        LocalDate today = LocalDate.now();

        for (AssetProcurement p : procurements) {
            Asset asset = p.getAsset();
            Map<String, Object> row = new LinkedHashMap<>();
            row.put("assetId",           asset.getId());
            row.put("assetTag",          asset.getAssetTag());
            row.put("deviceName",        asset.getDeviceName());
            row.put("deviceType",        asset.getDeviceType() != null ? asset.getDeviceType().getValue() : null);
            row.put("status",            asset.getStatus() != null ? asset.getStatus().getValue() : null);
            row.put("purchaseDate",      p.getPurchaseDate());
            row.put("purchaseVendor",    p.getPurchaseVendor());
            row.put("purchaseCost",      p.getPurchaseCost());
            row.put("warrantyExpiryDate", p.getWarrantyExpiryDate());

            // Convenience: days until expiry (negative = already expired)
            if (p.getWarrantyExpiryDate() != null) {
                long daysUntilExpiry = today.until(p.getWarrantyExpiryDate(), java.time.temporal.ChronoUnit.DAYS);
                row.put("daysUntilExpiry", daysUntilExpiry);
                row.put("isExpired",       daysUntilExpiry < 0);
                row.put("expiresWithin30Days", daysUntilExpiry >= 0 && daysUntilExpiry <= 30);
            }
            result.add(row);
        }
        return result;
    }

    // -------------------------------------------------------------------------
    // Helper: build a rich asset row map (shared by available-assets & search)
    // -------------------------------------------------------------------------
    private Map<String, Object> buildAssetRow(Asset asset) {
        Map<String, Object> row = new LinkedHashMap<>();
        row.put("id",              asset.getId());
        row.put("assetTag",        asset.getAssetTag());
        row.put("serialNumber",    asset.getSerialNumber());
        row.put("deviceName",      asset.getDeviceName());
        row.put("deviceType",      asset.getDeviceType()  != null ? asset.getDeviceType().getValue()  : null);
        row.put("manufacturer",    asset.getManufacturer());
        row.put("model",           asset.getModel());
        row.put("status",          asset.getStatus() != null ? asset.getStatus().getValue() : null);
        row.put("cpu",             asset.getCpu());
        row.put("ramGb",           asset.getRamGb());
        row.put("diskType",        asset.getDiskType());
        row.put("diskModel",       asset.getDiskModel());
        row.put("storageSizeGb",   asset.getStorageSizeGb());
        row.put("screenSizeInch",  asset.getScreenSizeInch());
        row.put("operatingSystem", asset.getOperatingSystem());
        row.put("osVersion",       asset.getOsVersion());
        row.put("domainJoined",    asset.getDomainJoined());
        row.put("condition",       asset.getCondition());
        row.put("latestUsed",      asset.getLatestUsed());
        row.put("image",           asset.getImage());
        row.put("updatedAt",       asset.getUpdatedAt());

        // Attach procurement info if available
        Optional<AssetProcurement> procurement = assetProcurementRepository.findByAssetId(asset.getId());
        if (procurement.isPresent()) {
            AssetProcurement p = procurement.get();
            Map<String, Object> procMap = new HashMap<>();
            procMap.put("purchaseDate",       p.getPurchaseDate());
            procMap.put("purchaseVendor",     p.getPurchaseVendor());
            procMap.put("purchaseCost",       p.getPurchaseCost());
            procMap.put("warrantyExpiryDate", p.getWarrantyExpiryDate());
            row.put("procurement", procMap);
        } else {
            row.put("procurement", null);
        }

        return row;
    }
}

