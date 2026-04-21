package com.tid.asset_management_bridge.employee_management_module.service;

import com.tid.asset_management_bridge.employee_management_module.dto.CreateEmployeeRequest;
import com.tid.asset_management_bridge.employee_management_module.dto.EmployeeResponse;
import com.tid.asset_management_bridge.employee_management_module.dto.UpdateEmployeeRequest;
import org.springframework.lang.NonNull;

import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface EmployeeService {
    List<EmployeeResponse> getAllEmployees();
    EmployeeResponse getEmployeeById(@NonNull Long id);
    EmployeeResponse createEmployee(@NonNull CreateEmployeeRequest request, MultipartFile imageFile);
    EmployeeResponse updateEmployee(@NonNull Long id, @NonNull UpdateEmployeeRequest request, MultipartFile imageFile, boolean removeImage);
    EmployeeResponse patchEmployee(@NonNull Long id, @NonNull UpdateEmployeeRequest request, MultipartFile imageFile, boolean removeImage);
    void deleteEmployee(@NonNull Long id);
}
