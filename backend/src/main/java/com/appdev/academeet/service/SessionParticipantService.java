package com.appdev.academeet.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.appdev.academeet.model.Session;
import com.appdev.academeet.model.SessionParticipant;
import com.appdev.academeet.model.User;
import com.appdev.academeet.repository.SessionParticipantRepository;
import com.appdev.academeet.repository.SessionRepository;
import com.appdev.academeet.repository.UserRepository;

/**
 * Service for managing session participants.
 * Handles joining, leaving, and tracking participation in sessions.
 */
@Service
public class SessionParticipantService {

    @Autowired
    private SessionParticipantRepository sessionParticipantRepository;
    
    @Autowired
    private SessionRepository sessionRepository;
    
    @Autowired
    private UserRepository userRepository;

    /**
     * Add a participant to a session.
     * This is called during session creation to enroll the host automatically.
     */
    @Transactional
    public SessionParticipant addParticipant(Long sessionId, Long userId) {
        Session session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new RuntimeException("Session not found with id: " + sessionId));
        
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
        
        // Check if user is already a participant
        if (sessionParticipantRepository.existsBySessionIdAndUserId(sessionId, userId)) {
            throw new IllegalStateException("User is already a participant in this session");
        }
        
        SessionParticipant participant = new SessionParticipant(session, user);
        return sessionParticipantRepository.save(participant);
    }

    /**
     * Remove a participant from a session (un-enroll).
     */
    @Transactional
    public void removeParticipant(Long sessionId, Long userId) {
        if (!sessionParticipantRepository.existsBySessionIdAndUserId(sessionId, userId)) {
            throw new IllegalStateException("User is not a participant in this session");
        }
        
        sessionParticipantRepository.deleteBySessionIdAndUserId(sessionId, userId);
    }

    /**
     * Get all participants for a specific session.
     */
    @Transactional(readOnly = true)
    public List<SessionParticipant> getParticipantsBySession(Long sessionId) {
        return sessionParticipantRepository.findBySessionId(sessionId);
    }

    /**
     * Get all sessions a user is participating in.
     */
    @Transactional(readOnly = true)
    public List<SessionParticipant> getSessionsByUser(Long userId) {
        return sessionParticipantRepository.findByUserId(userId);
    }

    /**
     * Check if a user is participating in a session.
     */
    public boolean isParticipant(Long sessionId, Long userId) {
        return sessionParticipantRepository.existsBySessionIdAndUserId(sessionId, userId);
    }

    /**
     * Get the count of participants in a session.
     */
    public long getParticipantCount(Long sessionId) {
        return sessionParticipantRepository.countBySessionId(sessionId);
    }

    /**
     * Remove all participants from a session (used when deleting a session).
     */
    @Transactional
    public void removeAllParticipants(Long sessionId) {
        sessionParticipantRepository.deleteBySessionId(sessionId);
    }
}
