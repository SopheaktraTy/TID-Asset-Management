package com.tid.asset_management_bridge.common.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
public class FileStorageService {

    @Value("${file.upload.dir:uploads}")
    private String uploadDir;

    public String storeFile(MultipartFile file, String subDir) {
        if (file == null || file.isEmpty()) {
            return null;
        }

        try {
            // Create directory if not exists
            Path root = Paths.get(uploadDir, subDir);
            if (!Files.exists(root)) {
                Files.createDirectories(root);
            }

            // Generate unique filename
            String originalFilename = file.getOriginalFilename();
            String extension = "";
            if (originalFilename != null && originalFilename.contains(".")) {
                extension = originalFilename.substring(originalFilename.lastIndexOf("."));
            }
            String fileName = UUID.randomUUID().toString() + extension;

            // Save file
            Path targetPath = root.resolve(fileName);
            Files.copy(file.getInputStream(), targetPath);

            // Return relative path for database storage (URL Path method)
            return subDir + "/" + fileName;

        } catch (IOException e) {
            throw new RuntimeException("Could not store file. Error: " + e.getMessage());
        }
    }

    public void deleteFile(String relativePath) {
        if (relativePath == null || relativePath.isBlank()) {
            return;
        }

        try {
            // Strip leading /uploads/ if present (database often stores full URL/path)
            String cleanPath = relativePath.startsWith("/uploads/") 
                ? relativePath.substring("/uploads/".length()) 
                : relativePath;

            Path targetPath = Paths.get(uploadDir).resolve(cleanPath);
            if (Files.exists(targetPath)) {
                Files.delete(targetPath);
            }
        } catch (IOException e) {
            // Log warning but don't fail business logic if file deletion fails
            System.err.println("Could not delete file at " + relativePath + ". Error: " + e.getMessage());
        }
    }
}
