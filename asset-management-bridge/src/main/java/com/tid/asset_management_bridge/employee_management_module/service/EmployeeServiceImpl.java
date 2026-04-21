package com.tid.asset_management_bridge.employee_management_module.service;

import com.tid.asset_management_bridge.common.exception.ConflictException;
import com.tid.asset_management_bridge.common.exception.ResourceNotFoundException;
import com.tid.asset_management_bridge.employee_management_module.dto.CreateEmployeeRequest;
import com.tid.asset_management_bridge.employee_management_module.dto.EmployeeResponse;
import com.tid.asset_management_bridge.employee_management_module.dto.UpdateEmployeeRequest;
import com.tid.asset_management_bridge.employee_management_module.entity.Employee;
import com.tid.asset_management_bridge.employee_management_module.mapper.EmployeeMapper;
import com.tid.asset_management_bridge.employee_management_module.repository.EmployeeRepository;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
public class EmployeeServiceImpl implements EmployeeService {

    private final EmployeeRepository employeeRepository;
    private final EmployeeMapper employeeMapper;

    public EmployeeServiceImpl(EmployeeRepository employeeRepository, EmployeeMapper employeeMapper) {
        this.employeeRepository = employeeRepository;
        this.employeeMapper = employeeMapper;
    }

    @Override
    @Transactional(readOnly = true)
    public List<EmployeeResponse> getAllEmployees() {
        return employeeRepository.findAll().stream()
                .map(employeeMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public EmployeeResponse getEmployeeById(@NonNull Long id) {
        Employee employee = Objects.requireNonNull(employeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with id " + id)));
        return employeeMapper.toResponse(employee);
    }

    @Override
    @Transactional
    public EmployeeResponse createEmployee(@NonNull CreateEmployeeRequest request) {
        if (employeeRepository.findByUsername(request.getUsername()).isPresent()) {
            throw new ConflictException("Employee with username '" + request.getUsername() + "' already exists");
        }
        
        Employee employee = Objects.requireNonNull(employeeMapper.toEntity(request));
        return employeeMapper.toResponse(Objects.requireNonNull(employeeRepository.save(employee)));
    }

    @Override
    @Transactional
    public EmployeeResponse updateEmployee(@NonNull Long id, @NonNull UpdateEmployeeRequest request) {
        Employee employee = Objects.requireNonNull(employeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with id " + id)));

        // Handle username change with conflict check
        if (request.getUsername() != null && !request.getUsername().equals(employee.getUsername())) {
            if (employeeRepository.findByUsername(request.getUsername()).isPresent()) {
                throw new ConflictException("Employee with username '" + request.getUsername() + "' already exists");
            }
            employee.setUsername(request.getUsername());
        }

        employeeMapper.updateEntityFromRequest(request, employee);
        return employeeMapper.toResponse(Objects.requireNonNull(employeeRepository.save(employee)));
    }

    @Override
    @Transactional
    public EmployeeResponse patchEmployee(@NonNull Long id, @NonNull UpdateEmployeeRequest request) {
        Employee employee = Objects.requireNonNull(employeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with id " + id)));

        // Handle optional username change
        if (request.getUsername() != null && !request.getUsername().equals(employee.getUsername())) {
            if (employeeRepository.findByUsername(request.getUsername()).isPresent()) {
                throw new ConflictException("Employee with username '" + request.getUsername() + "' already exists");
            }
            employee.setUsername(request.getUsername());
        }

        employeeMapper.patchEntityFromRequest(request, employee);
        return employeeMapper.toResponse(Objects.requireNonNull(employeeRepository.save(employee)));
    }

    @Override
    @Transactional
    public void deleteEmployee(@NonNull Long id) {
        if (!employeeRepository.existsById(id)) {
            throw new ResourceNotFoundException("Employee not found with id " + id);
        }
        employeeRepository.deleteById(id);
    }

    // Manual mapping removed in favor of EmployeeMapper
}
