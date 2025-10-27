package com.appdev.academeet.service;

import com.appdev.academeet.model.File;
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
    public File uploadFile(File file) {
        // Validate session exists
        if (file.getSession() != null && file.getSession().getSessionId() != null) {
            Session session = sessionRepository.findById(file.getSession().getSessionId())
                .orElseThrow(() -> new RuntimeException("Session not found with id: " + file.getSession().getSessionId()));
            file.setSession(session);
        }
        
        return fileRepository.save(file);
    }
    
    // Read
    public List<File> getAllFiles() {
        return fileRepository.findAll();
    }
    
    public Optional<File> getFileById(Integer id) {
        return fileRepository.findById(id);
    }
    
    public List<File> getFilesBySession(Session session) {
        return fileRepository.findBySession(session);
    }
    
    public List<File> getFilesBySessionId(Integer sessionId) {
        return fileRepository.findBySessionIdOrderByUploadDateDesc(sessionId);
    }
    
    public List<File> searchFilesByName(String name) {
        return fileRepository.findByNameContainingIgnoreCase(name);
    }
    
    public List<File> getFilesByUploadDate(LocalDate uploadDate) {
        return fileRepository.findByUploadDate(uploadDate);
    }
    
    public List<File> getFilesLargerThan(Double size) {
        return fileRepository.findFilesLargerThan(size);
    }
    
    // Update
    public File updateFile(Integer id, File fileDetails) {
        File file = fileRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("File not found with id: " + id));
        
        file.setName(fileDetails.getName());
        file.setContent(fileDetails.getContent());
        file.setSize(fileDetails.getSize());
        file.setUploadDate(fileDetails.getUploadDate());
        
        // Update session if provided
        if (fileDetails.getSession() != null && fileDetails.getSession().getSessionId() != null) {
            Session session = sessionRepository.findById(fileDetails.getSession().getSessionId())
                .orElseThrow(() -> new RuntimeException("Session not found with id: " + fileDetails.getSession().getSessionId()));
            file.setSession(session);
        }
        
        return fileRepository.save(file);
    }
    
    // Delete
    public void deleteFile(Integer id) {
        File file = fileRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("File not found with id: " + id));
        fileRepository.delete(file);
    }
    
    // Delete all files by session
    public void deleteFilesBySessionId(Integer sessionId) {
        List<File> files = fileRepository.findBySessionSessionId(sessionId);
        fileRepository.deleteAll(files);
    }
}
