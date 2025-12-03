package com.appdev.academeet.service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.appdev.academeet.dto.SessionDTO;
import com.appdev.academeet.model.Session;
import com.appdev.academeet.model.SessionStatus;
import com.appdev.academeet.model.SessionType;
import com.appdev.academeet.repository.SessionRepository;

@Service
public class SessionService {

    private final SessionRepository sessionRepository;

    public SessionService(SessionRepository sessionRepository) {
        this.sessionRepository = sessionRepository;
    }

    public Session createSession(Session session) {
        return sessionRepository.save(session);
    }

    // --- MODIFIED METHOD ---
    @Transactional(readOnly = true) // <-- ADD TRANSACTIONAL
    public List<SessionDTO> getSessionsByUserId(Long userId) {
        return sessionRepository.findByHost_Id(userId)
                .stream()
                .map(SessionDTO::new) // <-- CONVERT TO DTO
                .collect(Collectors.toList());
    }

    // --- MODIFIED METHOD ---
    @Transactional(readOnly = true) // <-- ADD TRANSACTIONAL
    public List<SessionDTO> getAllSessions() {
        return sessionRepository.findAllByOrderByStartTime()
            .stream()
            .filter(session -> session.getStatus() == SessionStatus.ACTIVE)
            .map(SessionDTO::new)
            .collect(Collectors.toList());
    }

    // Session Privacy & Status Methods
    public boolean validateSessionPassword(Long sessionId, String password) {
        Optional<Session> sessionOpt = sessionRepository.findById(sessionId);
        if (sessionOpt.isPresent()) {
            Session session = sessionOpt.get();
            if (session.getSessionType() == SessionType.PRIVATE) {
                return password != null && password.equals(session.getPassword());
            }
            return true; // Public sessions don't need password validation
        }
        return false;
    }

    public boolean checkParticipantLimit(Long sessionId) {
        Optional<Session> sessionOpt = sessionRepository.findById(sessionId);
        if (sessionOpt.isPresent()) {
            Session session = sessionOpt.get();
            Integer maxParticipants = session.getMaxParticipants();
            Integer currentParticipants = session.getCurrentParticipants();
            
            if (maxParticipants == null) {
                return true; // No limit set
            }
            
            return currentParticipants < maxParticipants;
        }
        return false;
    }

    @Transactional
    public void incrementParticipant(Long sessionId) {
        Optional<Session> sessionOpt = sessionRepository.findById(sessionId);
        if (sessionOpt.isPresent()) {
            Session session = sessionOpt.get();
            Integer current = session.getCurrentParticipants();
            session.setCurrentParticipants(current + 1);
            sessionRepository.save(session);
        }
    }

    @Transactional
    public void decrementParticipant(Long sessionId) {
        Optional<Session> sessionOpt = sessionRepository.findById(sessionId);
        if (sessionOpt.isPresent()) {
            Session session = sessionOpt.get();
            Integer current = session.getCurrentParticipants();
            if (current > 0) {
                session.setCurrentParticipants(current - 1);
                sessionRepository.save(session);
            }
        }
    }

    @Transactional
    public void updateSessionStatus(Long sessionId, SessionStatus newStatus) {
        Optional<Session> sessionOpt = sessionRepository.findById(sessionId);
        if (sessionOpt.isPresent()) {
            Session session = sessionOpt.get();
            session.setStatus(newStatus);
            sessionRepository.save(session);
        }
    }

    @Transactional
    public Session updateSession(Long sessionId, Session updatedSession, Long userId) {
        Optional<Session> sessionOpt = sessionRepository.findById(sessionId);
        if (sessionOpt.isEmpty()) {
            throw new RuntimeException("Session not found");
        }

        Session existingSession = sessionOpt.get();
        
        // Verify that the user is the session owner
        if (!existingSession.getHost().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized: Only the session owner can edit this session");
        }

        // Update session fields
        existingSession.setTitle(updatedSession.getTitle());
        existingSession.setDescription(updatedSession.getDescription());
        existingSession.setLocation(updatedSession.getLocation());
        existingSession.setSessionType(updatedSession.getSessionType());
        existingSession.setMaxParticipants(updatedSession.getMaxParticipants());
        
        // Update date and time fields
        existingSession.setMonth(updatedSession.getMonth());
        existingSession.setDay(updatedSession.getDay());
        existingSession.setYear(updatedSession.getYear());
        existingSession.setStartTime(updatedSession.getStartTime());
        existingSession.setEndTime(updatedSession.getEndTime());
        
        // Only update password if provided (for PRIVATE sessions)
        if (updatedSession.getPassword() != null && !updatedSession.getPassword().isEmpty()) {
            existingSession.setPassword(updatedSession.getPassword());
        }

        existingSession.setUpdatedAt(LocalDateTime.now());

        return sessionRepository.save(existingSession);
    }

    public List<SessionDTO> getSessionsByStatus(SessionStatus status) {
        return sessionRepository.findAll()
                .stream()
                .filter(session -> session.getStatus() == status)
                .map(SessionDTO::new)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<SessionDTO> getSessionsByDate(String year, String month, String day) {
        return sessionRepository.findAll()
                .stream()
                .filter(session -> year.equals(session.getYear()) && 
                                 month.equals(session.getMonth()) && 
                                 day.equals(session.getDay()))
                .map(SessionDTO::new)
                .collect(Collectors.toList());
    }

    public String uploadSessionImage(Long sessionId, MultipartFile file, String imageType) throws IOException {
        Optional<Session> sessionOpt = sessionRepository.findById(sessionId);
        if (sessionOpt.isPresent()) {
            Session session = sessionOpt.get();
            
            // Create unique filename
            String filename = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
            Path uploadPath = Paths.get("uploads/sessions/");
            
            // Create directory if it doesn't exist
            Files.createDirectories(uploadPath);
            
            // Save file
            Path filePath = uploadPath.resolve(filename);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
            
            String imageUrl = "/uploads/sessions/" + filename;
            
            // Update appropriate field based on image type
            if ("profile".equals(imageType)) {
                session.setProfileImageUrl(imageUrl);
            } else if ("cover".equals(imageType)) {
                session.setCoverImageUrl(imageUrl);
            }
            
            sessionRepository.save(session);
            return imageUrl;
        }
        throw new RuntimeException("Session not found");
    }

    @Transactional(readOnly = true)
    public Optional<Session> findById(Long sessionId) {
        return sessionRepository.findById(sessionId);
    }
}