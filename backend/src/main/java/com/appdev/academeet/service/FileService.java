package com.appdev.academeet.service;

// UPDATED: Import FileEntity
import com.appdev.academeet.model.FileEntity;
import com.appdev.academeet.model.Session;
import com.appdev.academeet.repository.FileRepository;
import com.appdev.academeet.repository.SessionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class FileService {
    
    @Autowired
    private FileRepository fileRepository;
    
    @Autowired
    private SessionRepository sessionRepository;
    
    // Create
    // UPDATED: Parameter and return type are FileEntity
    public FileEntity uploadFile(FileEntity file) {
        // Validate session exists
        // UPDATED: Use file.getSession().getId() and Long type
        if (file.getSession() != null && file.getSession().getId() != null) {
            Session session = sessionRepository.findById(file.getSession().getId())
                    .orElseThrow(() -> new RuntimeException("Session not found with id: " + file.getSession().getId()));
            file.setSession(session);
        }
        
        return fileRepository.save(file);
    }
    
    // Read
    // UPDATED: Return type is List<FileEntity>
    public List<FileEntity> getAllFiles() {
        return fileRepository.findAll();
    }
    
    // UPDATED: Return type is Optional<FileEntity>
    public Optional<FileEntity> getFileById(Integer id) {
        return fileRepository.findById(id);
    }
    
    // UPDATED: Return type is List<FileEntity>
    public List<FileEntity> getFilesBySession(Session session) {
        return fileRepository.findBySession(session);
    }
    
    // UPDATED: Parameter is Long
    public List<FileEntity> getFilesBySessionId(Long sessionId) {
        return fileRepository.findBySessionIdOrderByUploadDateDesc(sessionId);
    }
    
    // UPDATED: Return type is List<FileEntity>
    public List<FileEntity> searchFilesByName(String name) {
        return fileRepository.findByNameContainingIgnoreCase(name);
    }
    
    // UPDATED: Return type is List<FileEntity>
    public List<FileEntity> getFilesByUploadDate(LocalDate uploadDate) {
        return fileRepository.findByUploadDate(uploadDate);
    }
    
    // UPDATED: Return type is List<FileEntity>
    public List<FileEntity> getFilesLargerThan(Double size) {
        return fileRepository.findFilesLargerThan(size);
    }
    
    // Update
    // UPDATED: Parameter and return type are FileEntity
    public FileEntity updateFile(Integer id, FileEntity fileDetails) {
        FileEntity file = fileRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("File not found with id: " + id));
        
        file.setName(fileDetails.getName());
        file.setContent(fileDetails.getContent());
        file.setSize(fileDetails.getSize());
        file.setUploadDate(fileDetails.getUploadDate());
        
        // Update session if provided
        // UPDATED: Use fileDetails.getSession().getId() and Long type
        if (fileDetails.getSession() != null && fileDetails.getSession().getId() != null) {
            Session session = sessionRepository.findById(fileDetails.getSession().getId())
                    .orElseThrow(() -> new RuntimeException("Session not found with id: " + fileDetails.getSession().getId()));
            file.setSession(session);
        }
        
        return fileRepository.save(file);
    }
    
    // Delete
    public void deleteFile(Integer id) {
        // UPDATED: Use FileEntity
        FileEntity file = fileRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("File not found with id: " + id));
        fileRepository.delete(file);
    }
    
    // Delete all files by session
    // UPDATED: Parameter is Long, uses correct repository method
    public void deleteFilesBySessionId(Long sessionId) {
        List<FileEntity> files = fileRepository.findBySessionId(sessionId);
        fileRepository.deleteAll(files);
    }
}