package com.appdev.academeet.service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

/**
 * Service for handling file uploads.
 * Contains all file I/O logic separated from controllers.
 */
@Service
public class FileUploadService {

    private static final String NOTES_UPLOAD_DIR = "uploads/notes";

    /**
     * Uploads a file and returns the relative path.
     * 
     * @param file the file to upload
     * @param directory the upload directory (relative path)
     * @return the relative path to the uploaded file
     * @throws IOException if upload fails
     */
    public String uploadFile(MultipartFile file, String directory) throws IOException {
        // Validate file
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("File is empty");
        }

        // Create upload directory if it doesn't exist
        Path uploadPath = Paths.get(directory);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        // Generate unique filename
        String originalFilename = file.getOriginalFilename();
        String fileExtension = "";
        if (originalFilename != null && originalFilename.contains(".")) {
            fileExtension = originalFilename.substring(originalFilename.lastIndexOf("."));
        }
        String uniqueFilename = UUID.randomUUID().toString() + fileExtension;
        Path filePath = uploadPath.resolve(uniqueFilename);

        // Save file to disk
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        // Return relative path for storage
        return "/" + directory + "/" + uniqueFilename;
    }

    /**
     * Uploads a note file.
     * 
     * @param file the file to upload
     * @return the relative path to the uploaded note
     * @throws IOException if upload fails
     */
    public String uploadNoteFile(MultipartFile file) throws IOException {
        return uploadFile(file, NOTES_UPLOAD_DIR);
    }

    /**
     * Deletes a file by its path.
     * 
     * @param relativePath the relative path to the file
     * @return true if file was deleted, false otherwise
     */
    public boolean deleteFile(String relativePath) {
        try {
            if (relativePath != null && relativePath.startsWith("/")) {
                relativePath = relativePath.substring(1);
            }
            Path filePath = Paths.get(relativePath);
            return Files.deleteIfExists(filePath);
        } catch (IOException e) {
            return false;
        }
    }

    /**
     * Extracts filename from filepath.
     */
    public String extractFilename(String filepath) {
        if (filepath == null) return "Unknown";
        int lastSlash = filepath.lastIndexOf('/');
        return lastSlash >= 0 ? filepath.substring(lastSlash + 1) : filepath;
    }
}
