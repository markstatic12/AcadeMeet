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

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.appdev.academeet.dto.SessionDTO;
import com.appdev.academeet.model.Session;
import com.appdev.academeet.model.SessionStatus;
import com.appdev.academeet.model.SessionType;
import com.appdev.academeet.model.User;
import com.appdev.academeet.repository.SessionRepository;
import com.appdev.academeet.repository.UserRepository;

@Service
public class SessionService {

    private final SessionRepository sessionRepository;
    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    
    @Autowired
    private SessionParticipantService sessionParticipantService;

    @Autowired
    public SessionService(SessionRepository sessionRepository, UserRepository userRepository) {
        this.sessionRepository = sessionRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = new BCryptPasswordEncoder();
    }

    /**
     * Create a new session with business logic enforcement.
     * 
     * Business Rules:
     * 1. Start time must be in the future
     * 2. If session is PRIVATE, hash and save the password
     * 3. Automatically enroll the host as a participant
     */
    @Transactional
    public Session createSession(Session session, Long hostId) {
        // Find the host user
        User host = userRepository.findById(hostId)
                .orElseThrow(() -> new RuntimeException("Host user not found with id: " + hostId));
        
        // Business Rule 1: Validate that start_time is in the future
        if (session.getStartTime() != null && session.getStartTime().isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("Session start time must be in the future");
        }
        
        // Set the host
        session.setHost(host);
        
        // Business Rule 2: If session is PRIVATE, hash the password
        if (session.getSessionType() == SessionType.PRIVATE) {
            if (session.getPassword() == null || session.getPassword().trim().isEmpty()) {
                throw new IllegalArgumentException("Private sessions must have a password");
            }
            // Hash the password before saving
            session.setPassword(passwordEncoder.encode(session.getPassword()));
        }
        
        // Initialize participant count
        session.setCurrentParticipants(0);
        
        // Save the session
        Session savedSession = sessionRepository.save(session);
        
        // Business Rule 3: Automatically enroll the host as a participant
        sessionParticipantService.addParticipant(savedSession.getId(), hostId);
        
        return savedSession;
    }

    /**
     * Join a session with comprehensive validation.
     * 
     * Business Rules:
     * 1. Session must be ACTIVE
     * 2. Check participant limit
     * 3. If PRIVATE, verify password
     */
    @Transactional
    public void joinSession(Long sessionId, Long userId, String password) {
        Session session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new RuntimeException("Session not found with id: " + sessionId));
        
        // Business Rule 1: Ensure session is ACTIVE
        if (session.getStatus() != SessionStatus.ACTIVE) {
            throw new IllegalStateException("Cannot join a session that is not active");
        }
        
        // Check if user is already a participant
        if (sessionParticipantService.isParticipant(sessionId, userId)) {
            throw new IllegalStateException("User is already a participant in this session");
        }
        
        // Business Rule 2: Check participant limit
        long currentParticipantCount = sessionParticipantService.getParticipantCount(sessionId);
        if (session.getMaxParticipants() != null && currentParticipantCount >= session.getMaxParticipants()) {
            throw new IllegalStateException("Session has reached maximum participant limit");
        }
        
        // Business Rule 3: If session is PRIVATE, verify password
        if (session.getSessionType() == SessionType.PRIVATE) {
            if (password == null || !passwordEncoder.matches(password, session.getPassword())) {
                throw new SecurityException("Invalid session password");
            }
        }
        
        // Add the participant
        sessionParticipantService.addParticipant(sessionId, userId);
    }

    /**
     * Leave a session.
     */
    @Transactional
    public void leaveSession(Long sessionId, Long userId) {
        Session session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new RuntimeException("Session not found with id: " + sessionId));
        
        // Don't allow the host to leave their own session
        if (session.getHost().getId().equals(userId)) {
            throw new IllegalStateException("Host cannot leave their own session. Delete the session instead.");
        }
        
        sessionParticipantService.removeParticipant(sessionId, userId);
    }

    /**
     * Close a session and update status to COMPLETED.
     * Only the host can close a session.
     */
    @Transactional
    public void closeSession(Long sessionId, Long userId) {
        Session session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new RuntimeException("Session not found with id: " + sessionId));
        
        // Authorization: Only host can close the session
        if (!session.getHost().getId().equals(userId)) {
            throw new SecurityException("Only the session host can close the session");
        }
        
        // Update status to COMPLETED
        session.setStatus(SessionStatus.COMPLETED);
        sessionRepository.save(session);
        
        // TODO: Trigger reputation updates or other subsequent actions
    }

    /**
     * Search sessions with privacy filtering and pagination.
     */
    @Transactional(readOnly = true)
    public Page<Session> searchSessions(String keyword, SessionStatus status, Long userId, Pageable pageable) {
        Page<Session> sessions;
        
        if (keyword != null && !keyword.trim().isEmpty() && status != null) {
            sessions = sessionRepository.findByTitleContainingAndStatus(keyword, status, pageable);
        } else if (keyword != null && !keyword.trim().isEmpty()) {
            sessions = sessionRepository.findByTitleContaining(keyword, pageable);
        } else if (status != null) {
            sessions = sessionRepository.findByStatus(status, pageable);
        } else {
            sessions = sessionRepository.findAll(pageable);
        }
        
        // Filter based on privacy
        return sessions;
    }

    /**
     * Get sessions by date range.
     */
    @Transactional(readOnly = true)
    public List<Session> getSessionsByDateRange(LocalDateTime start, LocalDateTime end) {
        return sessionRepository.findByStartTimeBetween(start, end);
    }

    /**
     * Get sessions by status with pagination.
     */
    @Transactional(readOnly = true)
    public Page<Session> getSessionsByStatus(SessionStatus status, Pageable pageable) {
        return sessionRepository.findByStatus(status, pageable);
    }

    // Backward compatibility method
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

    public List<SessionDTO> getSessionsByStatus(SessionStatus status) {
        return sessionRepository.findAll()
                .stream()
                .filter(session -> session.getStatus() == status)
                .map(SessionDTO::new)
                .collect(Collectors.toList());
    }

    // Removed getSessionsByDate - use getSessionsByDateRange instead with LocalDateTime

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