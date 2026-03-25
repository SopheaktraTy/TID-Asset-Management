package com.tid.asset_management_bridge.report_module.service;

import java.util.Map;
import java.util.List;

public interface ReportService {
    
    Map<String, Object> getDashboardSummary();
    
    List<Map<String, Object>> getAvailableAssets();
    
    Map<String, Object> getIssueOverview();
    
    Map<String, Object> getDeviceDetail(String searchTerm);
    
    List<Map<String, Object>> getWarrantyExpiryDate();
}
