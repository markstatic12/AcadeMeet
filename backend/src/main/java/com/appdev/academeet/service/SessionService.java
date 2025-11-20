package com.appdev.academeet.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.appdev.academeet.dto.SessionDTO;
import com.appdev.academeet.model.Session;
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

    @Transactional(readOnly = true)
    public List<SessionDTO> getSessionsByUserId(Long userId) {
        return sessionRepository.findByHost_Id(userId)
                .stream()
                .map(SessionDTO::new)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<SessionDTO> getAllSessions() {
        return sessionRepository.findAll()
                .stream()
                .map(SessionDTO::new)
                .collect(Collectors.toList());
    }

    public Session getSessionById(Long sessionId) {
        return sessionRepository.findById(sessionId)
                .orElseThrow(() -> new RuntimeException("Session not found"));
    }

    public void deleteSession(Long sessionId) {
        if (!sessionRepository.existsById(sessionId)) {
            throw new RuntimeException("Session not found");
        }
        sessionRepository.deleteById(sessionId);
    }
}