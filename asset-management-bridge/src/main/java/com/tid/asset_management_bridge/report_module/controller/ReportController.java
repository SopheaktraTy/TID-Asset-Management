package com.tid.asset_management_bridge.report_module.controller;

import com.tid.asset_management_bridge.common.dto.ApiResponse;
import com.tid.asset_management_bridge.report_module.service.ReportService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reports")
public class ReportController {

    private final ReportService reportService;

    public ReportController(ReportService reportService) {
        this.reportService = reportService;
    }

    // GET /api/reports/summary — dashboard summary (PUBLIC)
    @GetMapping("/summary")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getSummary() {
        Map<String, Object> summary = reportService.getDashboardSummary();
        return ResponseEntity.ok(new ApiResponse<>(200, "Dashboard summary retrieved successfully", summary));
    }

    // GET /api/reports/available-assets — availability (PUBLIC)
    @GetMapping("/available-assets")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getAvailableAssets() {
        List<Map<String, Object>> availableAssets = reportService.getAvailableAssets();
        return ResponseEntity.ok(new ApiResponse<>(200, "Available assets retrieved successfully", availableAssets));
    }

    // GET /api/reports/issues — issue overview (PUBLIC)
    @GetMapping("/issues")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getIssuesOverview() {
        Map<String, Object> issues = reportService.getIssueOverview();
        return ResponseEntity.ok(new ApiResponse<>(200, "Issue overview retrieved successfully", issues));
    }

    // GET /api/reports/search/device-detail — device detail search (PUBLIC)
    @GetMapping("/search/device-detail")
    public ResponseEntity<ApiResponse<Map<String, Object>>> searchDeviceDetail(@RequestParam(required = false, defaultValue = "") String searchTerm) {
        Map<String, Object> detail = reportService.getDeviceDetail(searchTerm);
        return ResponseEntity.ok(new ApiResponse<>(200, "Device detail retrieved successfully", detail));
    }

    // GET /api/reports/warranty-expiry-date — warranty expiry (PUBLIC)
    @GetMapping("/warranty-expiry-date")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getWarrantyExpiryDate() {
        List<Map<String, Object>> warranties = reportService.getWarrantyExpiryDate();
        return ResponseEntity.ok(new ApiResponse<>(200, "Warranty expiry dates retrieved successfully", warranties));
    }
}
