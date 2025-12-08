package com.appdev.academeet.service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.appdev.academeet.dto.SessionDTO;
import com.appdev.academeet.model.Session;
import com.appdev.academeet.model.SessionParticipant;
import com.appdev.academeet.model.SessionParticipantId;
import com.appdev.academeet.model.SessionStatus;
import com.appdev.academeet.model.SessionType;
import com.appdev.academeet.model.User;
import com.appdev.academeet.repository.SessionParticipantRepository;
import com.appdev.academeet.repository.SessionRepository;
import com.appdev.academeet.repository.UserRepository;
import com.appdev.academeet.security.JwtUtil;

@Service
public class SessionService {

    private final SessionRepository sessionRepository;
    private final SessionParticipantRepository sessionParticipantRepository;
    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public SessionService(SessionRepository sessionRepository,
                          SessionParticipantRepository sessionParticipantRepository,
                          UserRepository userRepository,
                          JwtUtil jwtUtil) {
        this.sessionRepository = sessionRepository;
        this.sessionParticipantRepository = sessionParticipantRepository;
        this.userRepository = userRepository;
        this.jwtUtil = jwtUtil;
        this.passwordEncoder = new BCryptPasswordEncoder();
    }

    public Session createSession(Session session) {
        return sessionRepository.save(session);
    }

    @Transactional
    public Session createSession(Session session, Long hostId) {
        User host = userRepository.findById(hostId)
                .orElseThrow(() -> new RuntimeException("Host user not found with id: " + hostId));

        if (session.getStartTime() != null && session.getStartTime().isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("Session start time must be in the future");
        }

        session.setHost(host);

        if (session.getSessionPrivacy() == SessionType.PRIVATE) {
            if (session.getSessionPassword() == null || session.getSessionPassword().trim().isEmpty()) {
                throw new IllegalArgumentException("Private sessions must have a password");
            }
            session.setSessionPassword(passwordEncoder.encode(session.getSessionPassword()));
        }

        session.setCurrentParticipants(1); // Host is automatically a participant
        Session saved = sessionRepository.save(session);

        // Add host as a participant
        SessionParticipant participant = new SessionParticipant(saved, host);
        sessionParticipantRepository.save(participant);

        return saved;
    }

    // --- MODIFIED METHOD ---
    @Transactional(readOnly = true) // <-- ADD TRANSACTIONAL
    public List<SessionDTO> getSessionsByUserId(Long userId) {
        return sessionRepository.findByHost_Id(userId)
                .stream()
                .map(SessionDTO::new) // <-- CONVERT TO DTO
                .collect(Collectors.toList());
    }

    /**
     * Gets completed sessions (history) for a specific user.
     */
    @Transactional(readOnly = true)
    public List<SessionDTO> getCompletedSessionsByUserId(Long userId) {
        return sessionRepository.findByHost_Id(userId)
                .stream()
                .filter(session -> session.getSessionStatus() == SessionStatus.COMPLETED)
                .map(SessionDTO::new)
                .collect(Collectors.toList());
    }

    // --- MODIFIED METHOD ---
    @Transactional(readOnly = true) // <-- ADD TRANSACTIONAL
    public List<SessionDTO> getAllSessions() {
        return sessionRepository.findAllByOrderByStartTime()
            .stream()
            .filter(session -> session.getSessionStatus() == SessionStatus.ACTIVE)
            .map(SessionDTO::new)
            .collect(Collectors.toList());
    }

    public boolean validateSessionPassword(Long sessionId, String password) {
        Optional<Session> sessionOpt = sessionRepository.findById(sessionId);
        if (sessionOpt.isPresent()) {
            Session session = sessionOpt.get();
            if (session.getSessionPrivacy() == SessionType.PRIVATE) {
                String stored = session.getSessionPassword();
                if (stored == null) return false;
                if (stored.startsWith("$2a$") || stored.startsWith("$2b$") || stored.startsWith("$2y$")) {
                    return password != null && passwordEncoder.matches(password, stored);
                }
                return password != null && password.equals(stored);
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
    public void joinSession(Long sessionId, User user) {
        joinSession(sessionId, user, null);
    }

    @Transactional
    public void joinSession(Long sessionId, User user, String password) {
        // Check if user has already joined
        if (sessionParticipantRepository.existsBySessionIdAndUserId(sessionId, user.getId())) {
            throw new RuntimeException("User has already joined this session");
        }

        // Get session
        Session session = sessionRepository.findById(sessionId)
            .orElseThrow(() -> new RuntimeException("Session not found"));

        // Validate password if session is PRIVATE
        if (session.getSessionPrivacy() == SessionType.PRIVATE) {
            if (password == null || password.trim().isEmpty()) {
                throw new RuntimeException("Password is required for private sessions");
            }
            if (!validateSessionPassword(sessionId, password)) {
                throw new RuntimeException("Invalid password");
            }
        }

        // Check participant limit
        Integer maxParticipants = session.getMaxParticipants();
        Integer currentParticipants = session.getCurrentParticipants();
        
        if (maxParticipants != null && currentParticipants >= maxParticipants) {
            throw new RuntimeException("Session is full");
        }

        // Create participant record
        SessionParticipant participant = new SessionParticipant(session, user);
        sessionParticipantRepository.save(participant);

        // Increment participant count
        session.setCurrentParticipants(currentParticipants + 1);
        sessionRepository.save(session);
    }

    @Transactional
    public void cancelJoinSession(Long sessionId, User user) {
        // Check if user is a participant
        SessionParticipantId participantId = new SessionParticipantId(sessionId, user.getId());
        SessionParticipant participant = sessionParticipantRepository.findById(participantId)
            .orElseThrow(() -> new RuntimeException("User is not a participant of this session"));

        // Delete participant record
        sessionParticipantRepository.delete(participant);

        // Decrement participant count
        Session session = sessionRepository.findById(sessionId)
            .orElseThrow(() -> new RuntimeException("Session not found"));
        
        Integer currentParticipants = session.getCurrentParticipants();
        if (currentParticipants > 0) {
            session.setCurrentParticipants(currentParticipants - 1);
            sessionRepository.save(session);
        }
    }

    /**
     * Leave by user id.
     */
    @Transactional
    public void leaveSession(Long sessionId, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        Session session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new RuntimeException("Session not found with id: " + sessionId));

        // Don't allow host to leave
        if (session.getHost() != null && session.getHost().getId().equals(userId)) {
            throw new IllegalStateException("Host cannot leave their own session. Delete the session instead.");
        }

        cancelJoinSession(sessionId, user);
    }

    @Transactional(readOnly = true)
    public boolean isUserParticipant(Long sessionId, Long userId) {
        return sessionParticipantRepository.existsBySessionIdAndUserId(sessionId, userId);
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
            session.setSessionStatus(newStatus);
            sessionRepository.save(session);
        }
    }

    @Transactional
    public void closeSession(Long sessionId, Long userId) {
        Session session = sessionRepository.findById(sessionId)
            .orElseThrow(() -> new RuntimeException("Session not found"));

        if (session.getHost() == null || !session.getHost().getId().equals(userId)) {
            throw new SecurityException("Only the session host can close the session");
        }

        session.setSessionStatus(SessionStatus.COMPLETED);
        sessionRepository.save(session);
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

        // Determine the intended privacy after update (respect null -> keep existing)
        SessionType intendedPrivacy = updatedSession.getSessionPrivacy() != null
                ? updatedSession.getSessionPrivacy()
                : existingSession.getSessionPrivacy();

        // If switching to PRIVATE, ensure there is either an existing password or a new password provided
        if (intendedPrivacy == SessionType.PRIVATE) {
            boolean hasExistingPassword = existingSession.getSessionPassword() != null
                    && !existingSession.getSessionPassword().isEmpty();
            boolean hasNewPassword = updatedSession.getSessionPassword() != null
                    && !updatedSession.getSessionPassword().isEmpty();
            if (!hasExistingPassword && !hasNewPassword) {
                throw new IllegalArgumentException("Private sessions must have a password");
            }
        }

        // If switching to PUBLIC, clear any stored password to avoid surprise retained hashes
        if (intendedPrivacy == SessionType.PUBLIC) {
            existingSession.setSessionPassword(null);
        }

        // Update session fields only when non-null on the incoming object to support partial updates
        if (updatedSession.getTitle() != null) {
            existingSession.setTitle(updatedSession.getTitle());
        }
        if (updatedSession.getDescription() != null) {
            existingSession.setDescription(updatedSession.getDescription());
        }
        if (updatedSession.getLocation() != null) {
            existingSession.setLocation(updatedSession.getLocation());
        }
        if (updatedSession.getSessionPrivacy() != null) {
            existingSession.setSessionPrivacy(updatedSession.getSessionPrivacy());
        }
        if (updatedSession.getMaxParticipants() != null) {
            existingSession.setMaxParticipants(updatedSession.getMaxParticipants());
        }

        // Update date and time fields if provided
        if (updatedSession.getStartTime() != null) {
            existingSession.setStartTime(updatedSession.getStartTime());
        }
        if (updatedSession.getEndTime() != null) {
            existingSession.setEndTime(updatedSession.getEndTime());
        }

        // Update tags if provided
        if (updatedSession.getTags() != null) {
            existingSession.setTags(updatedSession.getTags());
        }

        // Only update password if provided (for PRIVATE sessions)
        if (updatedSession.getSessionPassword() != null && !updatedSession.getSessionPassword().isEmpty()) {
            existingSession.setSessionPassword(passwordEncoder.encode(updatedSession.getSessionPassword()));
        }

        existingSession.setUpdatedAt(LocalDateTime.now());

        return sessionRepository.save(existingSession);
    }

    public List<SessionDTO> getSessionsByStatus(SessionStatus status) {
        return sessionRepository.findAll()
                .stream()
                .filter(session -> session.getSessionStatus() == status)
                .map(SessionDTO::new)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<SessionDTO> getSessionsByDate(String year, String month, String day) {
        try {
            // Convert month name to number (1-12)
            int yearInt = Integer.parseInt(year);
            int dayInt = Integer.parseInt(day);
            
            // Convert month name to number
            int monthInt;
            try {
                // Try parsing as number first
                monthInt = Integer.parseInt(month);
            } catch (NumberFormatException e) {
                // Parse month name (e.g., "December" -> 12)
                monthInt = java.time.Month.valueOf(month.toUpperCase()).getValue();
            }
            
            System.out.println("Searching for sessions: " + yearInt + "-" + monthInt + "-" + dayInt);
            
            List<Session> sessions = sessionRepository.findByYearMonthDay(yearInt, monthInt, dayInt);
            System.out.println("Found " + sessions.size() + " sessions");
            
            return sessions.stream()
                    .map(SessionDTO::new)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            System.err.println("Error in getSessionsByDate: " + e.getMessage());
            e.printStackTrace();
            return new ArrayList<>();
        }
    }

    /**
     * New: search sessions with optional keyword/status and pagination.
     */
    @Transactional(readOnly = true)
    public Page<Session> searchSessions(String keyword, SessionStatus status, Long userId, Pageable pageable) {
        Page<Session> sessions;
        if (keyword != null && !keyword.trim().isEmpty() && status != null) {
            sessions = sessionRepository.findByTitleContainingAndSessionStatus(keyword, status, pageable);
        } else if (keyword != null && !keyword.trim().isEmpty()) {
            sessions = sessionRepository.findByTitleContaining(keyword, pageable);
        } else if (status != null) {
            sessions = sessionRepository.findBySessionStatus(status, pageable);
        } else {
            sessions = sessionRepository.findAll(pageable);
        }

        // TODO: filter out PRIVATE sessions depending on user access (host/participant)
        return sessions;
    }

    @Transactional(readOnly = true)
    public List<Session> getSessionsByDateRange(LocalDateTime start, LocalDateTime end) {
        return sessionRepository.findByStartTimeBetween(start, end);
    }

    @Transactional(readOnly = true)
    public Page<Session> getSessionsByStatus(SessionStatus status, Pageable pageable) {
        return sessionRepository.findBySessionStatus(status, pageable);
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

    /**
     * Get trending sessions ranked by tag popularity (top 4).
     */
    @Transactional(readOnly = true)
    public List<SessionDTO> getTrendingSessions() {
        List<Session> trending = sessionRepository.findTrendingSessions(PageRequest.of(0, 4));
        return trending.stream()
                .map(SessionDTO::new)
                .collect(Collectors.toList());
    }

    /**
     * Get all participants for a session.
     */
    @Transactional(readOnly = true)
    public List<Map<String, Object>> getSessionParticipants(Long sessionId) {
        // Verify session exists
        Session session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new RuntimeException("Session not found"));
        
        // Get all participants
        List<SessionParticipant> participants = sessionParticipantRepository.findBySessionId(sessionId);
        
        // Map to user info
        return participants.stream()
                .map(sp -> {
                    User user = sp.getUser();
                    Map<String, Object> userMap = new HashMap<>();
                    userMap.put("id", user.getId());
                    userMap.put("name", user.getName());
                    userMap.put("email", user.getEmail());
                    userMap.put("program", user.getProgram());
                    userMap.put("profilePic", user.getProfileImageUrl());
                    userMap.put("joinedAt", sp.getJoinedAt());
                    userMap.put("isHost", user.getId().equals(session.getHost().getId()));
                    return userMap;
                })
                .collect(Collectors.toList());
    }

    /**
     * Remove a participant from a session (host only).
     */
    @Transactional
    public Map<String, String> removeParticipant(Long sessionId, Long userId, String token) {
        // Extract user from token
        String jwt = token.replace("Bearer ", "");
        String email = jwtUtil.getEmailFromToken(jwt);
        User currentUser = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        // Get session
        Session session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new RuntimeException("Session not found"));
        
        // Verify current user is the host
        if (!session.getHost().getId().equals(currentUser.getId())) {
            throw new RuntimeException("Only the host can remove participants");
        }
        
        // Verify user to remove is not the host
        if (userId.equals(currentUser.getId())) {
            throw new RuntimeException("Host cannot be removed from the session");
        }
        
        // Check if user is a participant
        SessionParticipantId participantId = new SessionParticipantId(sessionId, userId);
        SessionParticipant participant = sessionParticipantRepository.findById(participantId)
                .orElseThrow(() -> new RuntimeException("User is not a participant of this session"));
        
        // Remove participant
        sessionParticipantRepository.delete(participant);
        
        // Decrement participant count
        session.setCurrentParticipants(session.getCurrentParticipants() - 1);
        sessionRepository.save(session);
        
        return Map.of("message", "Participant removed successfully");
    }

}