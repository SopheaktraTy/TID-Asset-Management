package com.tid.asset_management_bridge.employee_management_module.service;

import com.tid.asset_management_bridge.common.exception.ConflictException;
import com.tid.asset_management_bridge.common.exception.ResourceNotFoundException;
import com.tid.asset_management_bridge.employee_management_module.dto.CreateEmployeeRequest;
import com.tid.asset_management_bridge.employee_management_module.dto.EmployeeResponse;
import com.tid.asset_management_bridge.employee_management_module.dto.UpdateEmployeeRequest;
import com.tid.asset_management_bridge.employee_management_module.entity.Employee;
import com.tid.asset_management_bridge.employee_management_module.mapper.EmployeeMapper;
import com.tid.asset_management_bridge.employee_management_module.repository.EmployeeRepository;
import com.tid.asset_management_bridge.common.service.FileStorageService;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
public class EmployeeServiceImpl implements EmployeeService {

    private static final String EMPLOYEE_IMAGE_SUBDIR = "employees";

    private final EmployeeRepository employeeRepository;
    private final EmployeeMapper employeeMapper;
    private final FileStorageService fileStorageService;

    public EmployeeServiceImpl(EmployeeRepository employeeRepository,
                               EmployeeMapper employeeMapper,
                               FileStorageService fileStorageService) {
        this.employeeRepository = employeeRepository;
        this.employeeMapper = employeeMapper;
        this.fileStorageService = fileStorageService;
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
    public EmployeeResponse createEmployee(@NonNull CreateEmployeeRequest request, MultipartFile imageFile) {
        if (employeeRepository.findByUsername(request.getUsername()).isPresent()) {
            throw new ConflictException("Employee with username '" + request.getUsername() + "' already exists");
        }

        // ── Save image file ──────────────────────────────────────────────────────
        if (imageFile != null && !imageFile.isEmpty()) {
            String imagePath = fileStorageService.storeFile(imageFile, EMPLOYEE_IMAGE_SUBDIR);
            if (imagePath != null) {
                // Store as URL-style path so frontend can resolve it
                request.setImage("/uploads/" + imagePath.replace("\\", "/"));
            }
        }
        // ─────────────────────────────────────────────────────────────────────────
        
        Employee employee = Objects.requireNonNull(employeeMapper.toEntity(request));
        return employeeMapper.toResponse(Objects.requireNonNull(employeeRepository.save(employee)));
    }

    @Override
    @Transactional
    public EmployeeResponse updateEmployee(@NonNull Long id, @NonNull UpdateEmployeeRequest request, MultipartFile imageFile, boolean removeImage) {
        Employee employee = Objects.requireNonNull(employeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with id " + id)));

        // Handle username change with conflict check
        if (request.getUsername() != null && !request.getUsername().equals(employee.getUsername())) {
            if (employeeRepository.findByUsername(request.getUsername()).isPresent()) {
                throw new ConflictException("Employee with username '" + request.getUsername() + "' already exists");
            }
            employee.setUsername(request.getUsername());
        }

        // Capture old image path for cleanup
        String oldImage = employee.getImage();

        // 🗑️ Handle explicit removal
        if (removeImage && oldImage != null) {
            fileStorageService.deleteFile(oldImage);
            employee.setImage(null);
            request.setImage("");
        }

        // ── Replace/Upload image file ──────────────────────────────────────────
        if (imageFile != null && !imageFile.isEmpty()) {
            String imagePath = fileStorageService.storeFile(imageFile, EMPLOYEE_IMAGE_SUBDIR);
            if (imagePath != null) {
                if (oldImage != null) {
                    fileStorageService.deleteFile(oldImage);
                }
                request.setImage("/uploads/" + imagePath.replace("\\", "/"));
            }
        }
        // ─────────────────────────────────────────────────────────────────────────

        employeeMapper.updateEntityFromRequest(request, employee);

        // Ensure image is set to null if request.getImage() == "" and we removed it
        if (removeImage && !(imageFile != null && !imageFile.isEmpty())) {
            employee.setImage(null);
        }

        return employeeMapper.toResponse(Objects.requireNonNull(employeeRepository.save(employee)));
    }

    @Override
    @Transactional
    public EmployeeResponse patchEmployee(@NonNull Long id, @NonNull UpdateEmployeeRequest request, MultipartFile imageFile, boolean removeImage) {
        Employee employee = Objects.requireNonNull(employeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with id " + id)));

        // Handle optional username change
        if (request.getUsername() != null && !request.getUsername().equals(employee.getUsername())) {
            if (employeeRepository.findByUsername(request.getUsername()).isPresent()) {
                throw new ConflictException("Employee with username '" + request.getUsername() + "' already exists");
            }
            employee.setUsername(request.getUsername());
        }

        // Capture old image path for cleanup
        String oldImage = employee.getImage();

        // 🗑️ Handle explicit removal
        if (removeImage && oldImage != null) {
            fileStorageService.deleteFile(oldImage);
            employee.setImage(null);
            request.setImage("");
        }

        // ── Replace/Upload image file ──────────────────────────────────────────
        if (imageFile != null && !imageFile.isEmpty()) {
            String imagePath = fileStorageService.storeFile(imageFile, EMPLOYEE_IMAGE_SUBDIR);
            if (imagePath != null) {
                if (oldImage != null) {
                    fileStorageService.deleteFile(oldImage);
                }
                request.setImage("/uploads/" + imagePath.replace("\\", "/"));
            }
        }
        // ─────────────────────────────────────────────────────────────────────────

        employeeMapper.patchEntityFromRequest(request, employee);

        // Ensure image is set to null if request.getImage() == "" and we removed it
        if (removeImage && !(imageFile != null && !imageFile.isEmpty())) {
            employee.setImage(null);
        }

        return employeeMapper.toResponse(Objects.requireNonNull(employeeRepository.save(employee)));
    }

    @Override
    @Transactional
    public void deleteEmployee(@NonNull Long id) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with id " + id));

        // ── Delete image file from disk ──────────────────────────────────────────
        if (employee.getImage() != null && !employee.getImage().isBlank()) {
            fileStorageService.deleteFile(employee.getImage());
        }
        // ─────────────────────────────────────────────────────────────────────────

        employeeRepository.delete(employee);
    }
}
