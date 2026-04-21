package com.tid.asset_management_bridge.employee_management_module.service;

import com.tid.asset_management_bridge.employee_management_module.dto.CreateEmployeeRequest;
import com.tid.asset_management_bridge.employee_management_module.dto.EmployeeResponse;
import com.tid.asset_management_bridge.employee_management_module.dto.UpdateEmployeeRequest;
import org.springframework.lang.NonNull;

import java.util.List;

public interface EmployeeService {
    List<EmployeeResponse> getAllEmployees();
    EmployeeResponse getEmployeeById(@NonNull Long id);
    EmployeeResponse createEmployee(@NonNull CreateEmployeeRequest request);
    EmployeeResponse updateEmployee(@NonNull Long id, @NonNull UpdateEmployeeRequest request);
    EmployeeResponse patchEmployee(@NonNull Long id, @NonNull UpdateEmployeeRequest request);
    void deleteEmployee(@NonNull Long id);
}
