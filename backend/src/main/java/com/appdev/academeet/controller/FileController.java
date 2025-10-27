package com.appdev.academeet.controller;

import com.appdev.academeet.model.File;
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
    @PostMapping
    public ResponseEntity<?> uploadFile(@RequestBody File file) {
        try {
            File uploadedFile = fileService.uploadFile(file);
            return ResponseEntity.status(HttpStatus.CREATED).body(uploadedFile);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    // Get all files
    @GetMapping
    public ResponseEntity<List<File>> getAllFiles() {
        List<File> files = fileService.getAllFiles();
        return ResponseEntity.ok(files);
    }
    
    // Get by ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getFileById(@PathVariable Integer id) {
        Optional<File> file = fileService.getFileById(id);
        if (file.isPresent()) {
            return ResponseEntity.ok(file.get());
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("File not found");
    }
    
    // Get by session ID
    @GetMapping("/session/{sessionId}")
    public ResponseEntity<List<File>> getFilesBySessionId(@PathVariable Integer sessionId) {
        List<File> files = fileService.getFilesBySessionId(sessionId);
        return ResponseEntity.ok(files);
    }
    
    // Search by name
    @GetMapping("/search")
    public ResponseEntity<List<File>> searchFilesByName(@RequestParam String name) {
        List<File> files = fileService.searchFilesByName(name);
        return ResponseEntity.ok(files);
    }
    
    // Get by upload date
    @GetMapping("/date/{uploadDate}")
    public ResponseEntity<List<File>> getFilesByUploadDate(
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate uploadDate) {
        List<File> files = fileService.getFilesByUploadDate(uploadDate);
        return ResponseEntity.ok(files);
    }
    
    // Get files larger than size
    @GetMapping("/size")
    public ResponseEntity<List<File>> getFilesLargerThan(@RequestParam Double size) {
        List<File> files = fileService.getFilesLargerThan(size);
        return ResponseEntity.ok(files);
    }
    
    // Update file
    @PutMapping("/{id}")
    public ResponseEntity<?> updateFile(@PathVariable Integer id, @RequestBody File file) {
        try {
            File updatedFile = fileService.updateFile(id, file);
            return ResponseEntity.ok(updatedFile);
        } catch (RuntimeException e) {
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
    @DeleteMapping("/session/{sessionId}")
    public ResponseEntity<?> deleteFilesBySessionId(@PathVariable Integer sessionId) {
        try {
            fileService.deleteFilesBySessionId(sessionId);
            return ResponseEntity.ok("All files for session deleted successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
