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

@Service
public class SessionParticipantService {

    private final SessionParticipantRepository sessionParticipantRepository;
    private final SessionRepository sessionRepository;
    private final UserRepository userRepository;
    
    @Autowired
    public SessionParticipantService(SessionParticipantRepository sessionParticipantRepository,
                                     SessionRepository sessionRepository,
                                     UserRepository userRepository) {
        this.sessionParticipantRepository = sessionParticipantRepository;
        this.sessionRepository = sessionRepository;
        this.userRepository = userRepository;
    }


    @Transactional
    public SessionParticipant addParticipant(Long sessionId, Long userId) {
        Session session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new RuntimeException("Session not found with id: " + sessionId));
        
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
        
        if (sessionParticipantRepository.existsBySessionIdAndUserId(sessionId, userId)) {
            throw new IllegalStateException("User is already a participant in this session");
        }
        
        SessionParticipant participant = new SessionParticipant(session, user);
        return sessionParticipantRepository.save(participant);
    }

    @Transactional
    public void removeParticipant(Long sessionId, Long userId) {
        if (!sessionParticipantRepository.existsBySessionIdAndUserId(sessionId, userId)) {
            throw new IllegalStateException("User is not a participant in this session");
        }
        
        sessionParticipantRepository.deleteBySessionIdAndUserId(sessionId, userId);
    }

    @Transactional(readOnly = true)
    public List<SessionParticipant> getParticipantsBySession(Long sessionId) {
        return sessionParticipantRepository.findBySessionId(sessionId);
    }

    @Transactional(readOnly = true)
    public List<SessionParticipant> getSessionsByUser(Long userId) {
        return sessionParticipantRepository.findByUserId(userId);
    }

    public boolean isParticipant(Long sessionId, Long userId) {
        return sessionParticipantRepository.existsBySessionIdAndUserId(sessionId, userId);
    }

    public long getParticipantCount(Long sessionId) {
        return sessionParticipantRepository.countBySessionId(sessionId);
    }

    @Transactional
    public void removeAllParticipants(Long sessionId) {
        sessionParticipantRepository.deleteBySessionId(sessionId);
    }
}