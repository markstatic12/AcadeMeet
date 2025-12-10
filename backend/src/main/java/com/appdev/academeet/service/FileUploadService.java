package com.appdev.academeet.service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class FileUploadService {

    private static final String NOTES_UPLOAD_DIR = "uploads/notes";

    public String uploadFile(MultipartFile file, String directory) throws IOException {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("File is empty");
        }

        if (directory == null || directory.contains("..")) {
            throw new IllegalArgumentException("Invalid directory path");
        }

        Path uploadPath = Paths.get(directory).normalize().toAbsolutePath();
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        String originalFilename = file.getOriginalFilename();
        if (originalFilename != null && originalFilename.contains("..")) {
            throw new IllegalArgumentException("Invalid filename");
        }
        
        String fileExtension = "";
        if (originalFilename != null && originalFilename.contains(".")) {
            fileExtension = originalFilename.substring(originalFilename.lastIndexOf("."));
            if (!isAllowedExtension(fileExtension)) {
                throw new IllegalArgumentException("File type not allowed");
            }
        }
        
        String uniqueFilename = UUID.randomUUID().toString() + fileExtension;
        Path filePath = uploadPath.resolve(uniqueFilename).normalize();
        
        if (!filePath.startsWith(uploadPath)) {
            throw new SecurityException("Path traversal attempt detected");
        }

        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        return "/" + directory + "/" + uniqueFilename;
    }
    
    private boolean isAllowedExtension(String extension) {
        String[] allowedExtensions = {".pdf", ".doc", ".docx", ".txt", ".ppt", ".pptx", ".xls", ".xlsx", ".jpg", ".jpeg", ".png", ".gif"};
        String lowerExt = extension.toLowerCase();
        for (String allowed : allowedExtensions) {
            if (lowerExt.equals(allowed)) {
                return true;
            }
        }
        return false;
    }

    public String uploadNoteFile(MultipartFile file) throws IOException {
        return uploadFile(file, NOTES_UPLOAD_DIR);
    }

    public boolean deleteFile(String relativePath) {
        try {
            if (relativePath == null || relativePath.trim().isEmpty()) {
                return false;
            }
            
            if (relativePath.startsWith("/")) {
                relativePath = relativePath.substring(1);
            }
            
            if (relativePath.contains("..")) {
                throw new SecurityException("Path traversal attempt detected");
            }
            
            Path basePath = Paths.get("").toAbsolutePath().normalize();
            Path filePath = basePath.resolve(relativePath).normalize();
            
            if (!filePath.startsWith(basePath)) {
                throw new SecurityException("Path traversal attempt detected");
            }
            
            return Files.deleteIfExists(filePath);
        } catch (IOException e) {
            return false;
        } catch (SecurityException e) {
            System.err.println("Security violation: " + e.getMessage());
            return false;
        }
    }

    public String extractFilename(String filepath) {
        if (filepath == null) return "Unknown";
        int lastSlash = filepath.lastIndexOf('/');
        return lastSlash >= 0 ? filepath.substring(lastSlash + 1) : filepath;
    }
}
