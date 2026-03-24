package com.tid.asset_management_bridge.asset_issues_module.controller;

import com.tid.asset_management_bridge.asset_issues_module.dto.IssueResponse;
import com.tid.asset_management_bridge.asset_issues_module.dto.ReportIssueRequest;
import com.tid.asset_management_bridge.asset_issues_module.dto.UpdateIssueRequest;
import com.tid.asset_management_bridge.asset_issues_module.service.AssetIssueService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import com.tid.asset_management_bridge.common.dto.ApiResponse;

import java.util.List;
import org.springframework.security.access.prepost.PreAuthorize;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;

@RestController
@RequestMapping("/api")
@SecurityRequirement(name = "bearerAuth")
public class AssetIssueController {

    private final AssetIssueService issueService;

    public AssetIssueController(AssetIssueService issueService) {
        this.issueService = issueService;
    }

    // POST /api/assets/{id}/issues — Report a new issue for an asset
    @PostMapping("/assets/{id}/issues")
    @PreAuthorize("hasRole('SUPER_ADMIN') or hasAuthority('CREATE_ISSUE')")
    public ResponseEntity<ApiResponse<IssueResponse>> reportIssue(@PathVariable @NonNull Long id,
            @Valid @RequestBody ReportIssueRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ApiResponse<>(201, "Issue reported successfully", issueService.reportIssue(id, request)));
    }

    // GET /api/assets/{id}/issues — View all issues for an asset
    @GetMapping("/assets/{id}/issues")
    @PreAuthorize("hasRole('SUPER_ADMIN') or hasAuthority('READ_ISSUE')")
    public ResponseEntity<ApiResponse<List<IssueResponse>>> getIssuesByAsset(@PathVariable @NonNull Long id) {
        return ResponseEntity
                .ok(new ApiResponse<>(200, "Issues retrieved successfully", issueService.getIssuesByAsset(id)));
    }

    // PUT /api/issues/{id} — Update an issue
    @PutMapping("/issues/{id}")
    @PreAuthorize("hasRole('SUPER_ADMIN') or hasAuthority('UPDATE_ISSUE')")
    public ResponseEntity<ApiResponse<IssueResponse>> updateIssue(@PathVariable @NonNull Long id,
            @RequestBody UpdateIssueRequest request) {
        return ResponseEntity
                .ok(new ApiResponse<>(200, "Issue updated successfully", issueService.updateIssue(id, request)));
    }

    // DELETE /api/issues/{id} — Delete an issue
    @DeleteMapping("/issues/{id}")
    @PreAuthorize("hasRole('SUPER_ADMIN') or hasAuthority('DELETE_ISSUE')")
    public ResponseEntity<ApiResponse<Void>> deleteIssue(@PathVariable @NonNull Long id) {
        issueService.deleteIssue(id);
        return ResponseEntity.ok(new ApiResponse<>(200, "Issue deleted successfully"));
    }
}
