package com.appdev.academeet.controller;

// UPDATED: Import FileEntity
import com.appdev.academeet.model.FileEntity;
import com.appdev.academeet.service.FileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/files")
@CrossOrigin(origins = "http://localhost:5173")
public class FileController {
    
    @Autowired
    private FileService fileService;
    
    // Upload file
    // UPDATED: Uses FileEntity
    @PostMapping
    public ResponseEntity<?> uploadFile(@RequestBody FileEntity file) {
        try {
            FileEntity uploadedFile = fileService.uploadFile(file);
            return ResponseEntity.status(HttpStatus.CREATED).body(uploadedFile);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    // Get all files
    // UPDATED: Returns List<FileEntity>
    @GetMapping
    public ResponseEntity<List<FileEntity>> getAllFiles() {
        List<FileEntity> files = fileService.getAllFiles();
        return ResponseEntity.ok(files);
    }
    
    // Get by ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getFileById(@PathVariable Integer id) {
        // UPDATED: Uses FileEntity
        Optional<FileEntity> file = fileService.getFileById(id);
        if (file.isPresent()) {
            return ResponseEntity.ok(file.get());
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("File not found");
    }
    
    // Get by session ID
    // UPDATED: Parameter is Long
    @GetMapping("/session/{sessionId}")
    public ResponseEntity<List<FileEntity>> getFilesBySessionId(@PathVariable Long sessionId) {
        List<FileEntity> files = fileService.getFilesBySessionId(sessionId);
        return ResponseEntity.ok(files);
    }
    
    // Search by name
    // UPDATED: Returns List<FileEntity>
    @GetMapping("/search")
    public ResponseEntity<List<FileEntity>> searchFilesByName(@RequestParam String name) {
        List<FileEntity> files = fileService.searchFilesByName(name);
        return ResponseEntity.ok(files);
    }
    
    // Get by upload date
    // UPDATED: Returns List<FileEntity>
    @GetMapping("/date/{uploadDate}")
    public ResponseEntity<List<FileEntity>> getFilesByUploadDate(
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate uploadDate) {
        List<FileEntity> files = fileService.getFilesByUploadDate(uploadDate);
        return ResponseEntity.ok(files);
    }
    
    // Get files larger than size
    // UPDATED: Returns List<FileEntity>
    @GetMapping("/size")
    public ResponseEntity<List<FileEntity>> getFilesLargerThan(@RequestParam Double size) {
        List<FileEntity> files = fileService.getFilesLargerThan(size);
        return ResponseEntity.ok(files);
    }
    
    // Update file
    // UPDATED: Uses FileEntity
    @PutMapping("/{id}")
    public ResponseEntity<?> updateFile(@PathVariable Integer id, @RequestBody FileEntity file) {
        try {
            FileEntity updatedFile = fileService.updateFile(id, file);
            return ResponseEntity.ok(updatedFile);
        } catch (RuntimeException e){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
    
    // Delete file
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteFile(@PathVariable Integer id) {
        try {
            fileService.deleteFile(id);
            return ResponseEntity.ok("File deleted successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
    
    // Delete all files by session
    // UPDATED: Parameter is Long
    @DeleteMapping("/session/{sessionId}")
    public ResponseEntity<?> deleteFilesBySessionId(@PathVariable Long sessionId) {
        try {
            fileService.deleteFilesBySessionId(sessionId);
            return ResponseEntity.ok("All files for session deleted successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}