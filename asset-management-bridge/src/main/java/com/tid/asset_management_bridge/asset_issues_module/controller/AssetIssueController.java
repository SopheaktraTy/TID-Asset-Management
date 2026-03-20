package com.tid.asset_management_bridge.asset_issues_module.controller;

import com.tid.asset_management_bridge.asset_issues_module.dto.IssueResponse;
import com.tid.asset_management_bridge.asset_issues_module.dto.ReportIssueRequest;
import com.tid.asset_management_bridge.asset_issues_module.dto.UpdateIssueRequest;
import com.tid.asset_management_bridge.asset_issues_module.service.AssetIssueService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class AssetIssueController {

    private final AssetIssueService issueService;

    public AssetIssueController(AssetIssueService issueService) {
        this.issueService = issueService;
    }

    // POST /api/assets/{id}/issues — Report a new issue for an asset
    @PostMapping("/assets/{id}/issues")
    @ResponseStatus(HttpStatus.CREATED)
    public IssueResponse reportIssue(@PathVariable @NonNull Long id,
                                     @Valid @RequestBody ReportIssueRequest request) {
        return issueService.reportIssue(id, request);
    }

    // GET /api/assets/{id}/issues — View all issues for an asset
    @GetMapping("/assets/{id}/issues")
    public List<IssueResponse> getIssuesByAsset(@PathVariable @NonNull Long id) {
        return issueService.getIssuesByAsset(id);
    }

    // PUT /api/issues/{id} — Update an issue
    @PutMapping("/issues/{id}")
    public IssueResponse updateIssue(@PathVariable @NonNull Long id,
                                     @RequestBody UpdateIssueRequest request) {
        return issueService.updateIssue(id, request);
    }

    // DELETE /api/issues/{id} — Delete an issue
    @DeleteMapping("/issues/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteIssue(@PathVariable @NonNull Long id) {
        issueService.deleteIssue(id);
    }
}
