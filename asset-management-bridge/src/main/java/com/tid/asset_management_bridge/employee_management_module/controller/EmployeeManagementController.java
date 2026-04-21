package com.tid.asset_management_bridge.employee_management_module.controller;

import com.tid.asset_management_bridge.common.dto.ApiResponse;
import com.tid.asset_management_bridge.employee_management_module.dto.CreateEmployeeRequest;
import com.tid.asset_management_bridge.employee_management_module.dto.EmployeeResponse;
import com.tid.asset_management_bridge.employee_management_module.dto.UpdateEmployeeRequest;
import com.tid.asset_management_bridge.employee_management_module.service.EmployeeService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/employees")
@SecurityRequirement(name = "bearerAuth")
public class EmployeeManagementController {

    private final EmployeeService employeeService;

    public EmployeeManagementController(EmployeeService employeeService) {
        this.employeeService = employeeService;
    }

    // GET all employees
    @GetMapping
    public ResponseEntity<ApiResponse<List<EmployeeResponse>>> getAllEmployees() {
        return ResponseEntity.ok(new ApiResponse<>(200, "Employees retrieved successfully", employeeService.getAllEmployees()));
    }

    // GET single employee by ID
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<EmployeeResponse>> getEmployeeById(@PathVariable @NonNull Long id) {
        return ResponseEntity.ok(new ApiResponse<>(200, "Employee retrieved successfully", employeeService.getEmployeeById(id)));
    }

    // POST create new employee
    @PostMapping
    public ResponseEntity<ApiResponse<EmployeeResponse>> createEmployee(@Valid @RequestBody @NonNull CreateEmployeeRequest request) {
        EmployeeResponse created = employeeService.createEmployee(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ApiResponse<>(201, "Employee created successfully", created));
    }

    // PUT full update
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<EmployeeResponse>> updateEmployee(
            @PathVariable @NonNull Long id,
            @RequestBody @NonNull UpdateEmployeeRequest request) {
        return ResponseEntity.ok(new ApiResponse<>(200, "Employee updated successfully", employeeService.updateEmployee(id, request)));
    }

    // PATCH partial update
    @PatchMapping("/{id}")
    public ResponseEntity<ApiResponse<EmployeeResponse>> patchEmployee(
            @PathVariable @NonNull Long id,
            @RequestBody @NonNull UpdateEmployeeRequest request) {
        return ResponseEntity.ok(new ApiResponse<>(200, "Employee patched successfully", employeeService.patchEmployee(id, request)));
    }

    // DELETE employee
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteEmployee(@PathVariable @NonNull Long id) {
        employeeService.deleteEmployee(id);
        return ResponseEntity.ok(new ApiResponse<>(200, "Employee deleted successfully"));
    }
}
