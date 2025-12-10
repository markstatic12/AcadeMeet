package com.appdev.academeet.service;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.appdev.academeet.dto.CreateSessionRequest;
import com.appdev.academeet.dto.SessionDTO;
import com.appdev.academeet.dto.UpdateSessionRequest;
import com.appdev.academeet.model.Session;
import com.appdev.academeet.model.SessionParticipant;
import com.appdev.academeet.model.SessionParticipantId;
import com.appdev.academeet.model.SessionPrivacy;
import com.appdev.academeet.model.SessionStatus;
import com.appdev.academeet.model.User;
import com.appdev.academeet.repository.SessionParticipantRepository;
import com.appdev.academeet.repository.SessionRepository;
import com.appdev.academeet.repository.UserRepository;
import com.appdev.academeet.security.JwtUtil;
import com.appdev.academeet.util.DateTimeUtils;

@Service
public class SessionService {

    private static final Logger logger = LoggerFactory.getLogger(SessionService.class);

    private final SessionRepository sessionRepository;
    private final SessionParticipantRepository sessionParticipantRepository;
    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final ReminderService reminderService;
    private final NotificationService notificationService;
    private final JwtUtil jwtUtil;

    public SessionService(SessionRepository sessionRepository,
                          SessionParticipantRepository sessionParticipantRepository,
                          UserRepository userRepository,
                          BCryptPasswordEncoder passwordEncoder,
                          ReminderService reminderService,
                          NotificationService notificationService,
                          JwtUtil jwtUtil) {
        this.sessionRepository = sessionRepository;
        this.sessionParticipantRepository = sessionParticipantRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.reminderService = reminderService;
        this.notificationService = notificationService;
        this.jwtUtil = jwtUtil;
    }

    private Session mapToEntity(CreateSessionRequest request) {
        Session session = new Session();
        session.setTitle(request.getTitle());
        session.setDescription(request.getDescription());
    
        LocalDateTime start = DateTimeUtils.parseFromSeparateFields(
            request.getMonth(), request.getDay(), request.getYear(), request.getStartTime());
        LocalDateTime end = DateTimeUtils.parseFromSeparateFields(
            request.getMonth(), request.getDay(), request.getYear(), request.getEndTime());
        
        session.setStartTime(start);
        session.setEndTime(end);
        session.setLocation(request.getLocation());
        session.setMaxParticipants(request.getMaxParticipants());
        
        if (request.getSessionPrivacy() != null) {
            session.setSessionPrivacy(request.getSessionPrivacy());
        }
        
        session.setTags(request.getTags());
        
        if (request.getPassword() != null && !request.getPassword().isEmpty()) {
            session.setSessionPassword(request.getPassword());
        }
        
        return session;
    }

    private Session mapToEntity(UpdateSessionRequest request) {
        Session session = new Session();
        session.setTitle(request.getTitle());
        session.setDescription(request.getDescription());
        
        LocalDateTime parsedStartTime = DateTimeUtils.parseNullableFromSeparateFields(
            request.getMonth(), request.getDay(), request.getYear(), request.getStartTime());
        LocalDateTime parsedEndTime = DateTimeUtils.parseNullableFromSeparateFields(
            request.getMonth(), request.getDay(), request.getYear(), request.getEndTime());
        
        session.setStartTime(parsedStartTime);
        session.setEndTime(parsedEndTime);
        session.setLocation(request.getLocation());
        session.setMaxParticipants(request.getMaxParticipants());
        
        if (request.getSessionPrivacy() != null) {
            session.setSessionPrivacy(request.getSessionPrivacy());
        }
        
        session.setTags(request.getTags());
        
        if (request.getPassword() != null && !request.getPassword().isEmpty()) {
            session.setSessionPassword(request.getPassword());
        }
        
        return session;
    }

    private void validateSessionData(Session session) {
        if (session.getStartTime() != null && session.getStartTime().isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("Session start time must be in the future");
        }

        if (session.getStartTime() != null && session.getEndTime() != null) {
            if (session.getEndTime().isBefore(session.getStartTime()) || 
                session.getEndTime().equals(session.getStartTime())) {
                throw new IllegalArgumentException("End time must be after start time");
            }

            long durationMinutes = Duration.between(session.getStartTime(), session.getEndTime()).toMinutes();
            if (durationMinutes < 15) {
                throw new IllegalArgumentException("Session must be at least 15 minutes long");
            }
        }

        if (session.getSessionPrivacy() == SessionPrivacy.PRIVATE) {
            if (session.getSessionPassword() == null || session.getSessionPassword().trim().isEmpty()) {
                throw new IllegalArgumentException("Private sessions must have a password");
            }
        }
    }

    @Transactional
    public Session createSessionFromDTO(CreateSessionRequest request, Long hostId) {
        Session session = mapToEntity(request);
        return createSession(session, hostId);
    }
    
    @Transactional
    public Session updateSessionFromDTO(Long sessionId, UpdateSessionRequest request, Long userId) {
        Session updates = mapToEntity(request);
        return updateSession(sessionId, updates, userId);
    }
    @Transactional
    public Session createSession(Session session, Long hostId) {
        User host = userRepository.findById(hostId)
                .orElseThrow(() -> new RuntimeException("Host user not found with id: " + hostId));

        validateSessionData(session);
        session.setHost(host);

        if (session.getSessionPrivacy() == SessionPrivacy.PRIVATE) {
            session.setSessionPassword(passwordEncoder.encode(session.getSessionPassword()));
        }

        session.setCurrentParticipants(1); 
        Session saved = sessionRepository.save(session);

        SessionParticipant participant = new SessionParticipant(saved, host);
        sessionParticipantRepository.save(participant);

        return saved;
    }

    @Transactional(readOnly = true) 
    public List<SessionDTO> getSessionsByUserId(Long userId) {
        return sessionRepository.findByHost_Id(userId)
                .stream()
                .map(SessionDTO::new) 
                .filter(dto -> {
                    SessionStatus status = dto.getStatus();
                    return status == SessionStatus.ACTIVE || status == SessionStatus.SCHEDULED;
                })
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<SessionDTO> getCompletedSessionsByUserId(Long userId) {
        return sessionRepository.findByHost_Id(userId)
                .stream()
                .map(SessionDTO::new) 
                .filter(dto -> dto.getStatus() == SessionStatus.COMPLETED)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<SessionDTO> getTrashedSessionsByUserId(Long userId) {
        return sessionRepository.findByHost_Id(userId)
                .stream()
                .filter(session -> session.getSessionStatus() == SessionStatus.TRASH)
                .map(SessionDTO::new)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<SessionDTO> getJoinedSessionsByUserId(Long userId) {
        return sessionParticipantRepository.findByUserId(userId)
                .stream()
                .map(SessionParticipant::getSession)
                .map(SessionDTO::new) 
                .filter(dto -> dto.getStatus() == SessionStatus.SCHEDULED || 
                              dto.getStatus() == SessionStatus.ACTIVE)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<SessionDTO> getPublicSessionsByUserId(Long userId) {
        return sessionRepository.findByHost_Id(userId)
                .stream()
                .filter(session -> session.getSessionPrivacy() == SessionPrivacy.PUBLIC)
                .map(SessionDTO::new)
                .filter(dto -> {
                    SessionStatus status = dto.getStatus();
                    return status == SessionStatus.ACTIVE || status == SessionStatus.SCHEDULED;
                })
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<SessionDTO> getAllSessions() {
        return sessionRepository.findAllByOrderByStartTime()
            .stream()
            .map(SessionDTO::new) 
            .filter(dto -> {
                SessionStatus status = dto.getStatus();
                return status != SessionStatus.DELETED && 
                       status != SessionStatus.TRASH &&
                       status != SessionStatus.COMPLETED;
            })
            .collect(Collectors.toList());
    }

    public void validateSessionPassword(Long sessionId, String password) {
        Session session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new RuntimeException("Session not found"));
        
        if (session.getSessionPrivacy() == SessionPrivacy.PRIVATE) {
            String stored = session.getSessionPassword();
            if (stored == null) {
                throw new SecurityException("Invalid password");
            }
            
            boolean isValid;
            if (stored.startsWith("$2a$") || stored.startsWith("$2b$") || stored.startsWith("$2y$")) {
                isValid = password != null && passwordEncoder.matches(password, stored);
            } else {
                isValid = password != null && password.equals(stored);
            }
            
            if (!isValid) {
                throw new SecurityException("Invalid password");
            }
        }
        
    }

    public boolean checkParticipantLimit(Long sessionId) {
        Optional<Session> sessionOpt = sessionRepository.findById(sessionId);
        if (sessionOpt.isPresent()) {
            Session session = sessionOpt.get();
            Integer maxParticipants = session.getMaxParticipants();
            Integer currentParticipants = session.getCurrentParticipants();
            
            if (maxParticipants == null) {
                return true; 
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
        
        if (sessionParticipantRepository.existsBySessionIdAndUserId(sessionId, user.getId())) {
            throw new RuntimeException("User has already joined this session");
        }

        Session session = sessionRepository.findById(sessionId)
            .orElseThrow(() -> new RuntimeException("Session not found"));

        if (session.getSessionPrivacy() == SessionPrivacy.PRIVATE) {
            if (password == null || password.trim().isEmpty()) {
                throw new SecurityException("Password is required for private sessions");
            }
            validateSessionPassword(sessionId, password); 
        }

        Integer maxParticipants = session.getMaxParticipants();
        Integer currentParticipants = session.getCurrentParticipants();
        
        if (maxParticipants != null && currentParticipants >= maxParticipants) {
            throw new RuntimeException("Session is full");
        }

        SessionParticipant participant = new SessionParticipant(session, user);
        sessionParticipantRepository.save(participant);
        session.setCurrentParticipants(currentParticipants + 1);
        sessionRepository.save(session);
        reminderService.createRemindersForSession(user, session);
        
        notificationService.notifyJoinConfirmation(user, session);
        notificationService.notifyParticipantJoined(user, session);
    }

    @Transactional
    public void cancelJoinSession(Long sessionId, User user) {
        SessionParticipantId participantId = new SessionParticipantId(sessionId, user.getId());
        SessionParticipant participant = sessionParticipantRepository.findById(participantId)
            .orElseThrow(() -> new RuntimeException("User is not a participant of this session"));

        sessionParticipantRepository.delete(participant);

        Session session = sessionRepository.findById(sessionId)
            .orElseThrow(() -> new RuntimeException("Session not found"));
        
        Integer currentParticipants = session.getCurrentParticipants();
        if (currentParticipants > 0) {
            session.setCurrentParticipants(currentParticipants - 1);
            sessionRepository.save(session);
        }
    }

    @Transactional
    public void leaveSession(Long sessionId, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        Session session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new RuntimeException("Session not found with id: " + sessionId));

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
    public void updateSessionStatus(Long sessionId, SessionStatus newStatus, Long userId) {
        Session session = sessionRepository.findById(sessionId)
            .orElseThrow(() -> new RuntimeException("Session not found"));
        
        // Authorization check: only session owner can update status
        if (!session.getHost().getId().equals(userId)) {
            throw new SecurityException("Only the session owner can update session status");
        }
        
        session.setSessionStatus(newStatus);
        sessionRepository.save(session);
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
        
        List<User> participants = sessionParticipantRepository.findBySessionId(sessionId).stream()
                .map(SessionParticipant::getUser)
                .collect(Collectors.toList());
        notificationService.notifySessionCanceled(session, participants);
    }

    @Transactional
    public Session updateSession(Long sessionId, Session updatedSession, Long userId) {
        Optional<Session> sessionOpt = sessionRepository.findById(sessionId);
        if (sessionOpt.isEmpty()) {
            throw new RuntimeException("Session not found");
        }

        Session existingSession = sessionOpt.get();

        if (!existingSession.getHost().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized: Only the session owner can edit this session");
        }

        SessionPrivacy intendedPrivacy = updatedSession.getSessionPrivacy() != null
                ? updatedSession.getSessionPrivacy()
                : existingSession.getSessionPrivacy();

        if (intendedPrivacy == SessionPrivacy.PRIVATE) {
            boolean hasExistingPassword = existingSession.getSessionPassword() != null
                    && !existingSession.getSessionPassword().isEmpty();
            boolean hasNewPassword = updatedSession.getSessionPassword() != null
                    && !updatedSession.getSessionPassword().isEmpty();
            if (!hasExistingPassword && !hasNewPassword) {
                throw new IllegalArgumentException("Private sessions must have a password");
            }
        }

        if (intendedPrivacy == SessionPrivacy.PUBLIC) {
            existingSession.setSessionPassword(null);
        }

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

        if (updatedSession.getStartTime() != null) {
            existingSession.setStartTime(updatedSession.getStartTime());
        }
        if (updatedSession.getEndTime() != null) {
            existingSession.setEndTime(updatedSession.getEndTime());
        }

        if (updatedSession.getTags() != null) {
            existingSession.setTags(updatedSession.getTags());
        }

        if (updatedSession.getSessionPassword() != null && !updatedSession.getSessionPassword().isEmpty()) {
            existingSession.setSessionPassword(passwordEncoder.encode(updatedSession.getSessionPassword()));
        }

        existingSession.setUpdatedAt(LocalDateTime.now());
        Session savedSession = sessionRepository.save(existingSession);
        
        List<User> participants = sessionParticipantRepository.findBySessionId(sessionId).stream()
                .map(SessionParticipant::getUser)
                .collect(Collectors.toList());
        notificationService.notifySessionUpdated(savedSession, participants);
        
        return savedSession;
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
            int yearInt = Integer.parseInt(year);
            int dayInt = Integer.parseInt(day);
            
            int monthInt;
            try {
                monthInt = Integer.parseInt(month);
            } catch (NumberFormatException e) {
                monthInt = java.time.Month.valueOf(month.toUpperCase()).getValue();
            }
            
            logger.debug("Searching for sessions on date: {}-{}-{}", yearInt, monthInt, dayInt);
            
            List<Session> sessions = sessionRepository.findByYearMonthDay(yearInt, monthInt, dayInt);
            logger.debug("Found {} sessions for the specified date", sessions.size());
            
            return sessions.stream()
                    .map(SessionDTO::new)
                    .collect(Collectors.toList());
        } catch (IllegalArgumentException e) {
            logger.error("Invalid date format: year={}, month={}, day={}", year, month, day, e);
            return new ArrayList<>();
        }
    }

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

    @Transactional(readOnly = true)
    public Optional<Session> findById(Long sessionId) {
        return sessionRepository.findById(sessionId);
    }

    @Transactional(readOnly = true)
    public List<SessionDTO> getTrendingSessions() {
        List<Session> trending = sessionRepository.findTrendingSessions(PageRequest.of(0, 4));
        return trending.stream()
                .map(SessionDTO::new)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<Map<String, Object>> getSessionParticipants(Long sessionId) {
        
        Session session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new RuntimeException("Session not found"));
        
        List<SessionParticipant> participants = sessionParticipantRepository.findBySessionId(sessionId);
        
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

    @Transactional
    public Map<String, String> removeParticipant(Long sessionId, Long userId, String token) {
        String jwt = token.replace("Bearer ", "");
        String email = jwtUtil.getEmailFromToken(jwt);
        User currentUser = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        Session session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new RuntimeException("Session not found"));
        
        if (!session.getHost().getId().equals(currentUser.getId())) {
            throw new RuntimeException("Only the host can remove participants");
        }
        
        if (userId.equals(currentUser.getId())) {
            throw new RuntimeException("Host cannot be removed from the session");
        }
        
        SessionParticipantId participantId = new SessionParticipantId(sessionId, userId);
        SessionParticipant participant = sessionParticipantRepository.findById(participantId)
                .orElseThrow(() -> new RuntimeException("User is not a participant of this session"));
        
        sessionParticipantRepository.delete(participant);
        session.setCurrentParticipants(session.getCurrentParticipants() - 1);
        sessionRepository.save(session);
        
        return Map.of("message", "Participant removed successfully");
    }

    /**
     * Get session by ID with privacy check for the current user
     */
    @Transactional(readOnly = true)
    public SessionDTO getSessionByIdForUser(Long sessionId, Long userId) {
        Session session = sessionRepository.findById(sessionId)
            .orElseThrow(() -> new RuntimeException("Session not found"));
        
        if (session.getSessionPrivacy() == SessionPrivacy.PRIVATE) {
            boolean isOwner = session.getHost().getId().equals(userId);
            boolean isParticipant = isUserParticipant(sessionId, userId);
            
            if (!isOwner && !isParticipant) {
                throw new SecurityException("You do not have permission to view this private session");
            }
        }
        
        return new SessionDTO(session);
    }

    /**
     * Get sessions for user profile view (own or others)
     */
    @Transactional(readOnly = true)
    public List<SessionDTO> getSessionsForUserView(Long profileUserId, Long currentUserId) {
        if (currentUserId.equals(profileUserId)) {
            return getSessionsByUserId(profileUserId);
        } else {
            return getPublicSessionsByUserId(profileUserId);
        }
    }

}