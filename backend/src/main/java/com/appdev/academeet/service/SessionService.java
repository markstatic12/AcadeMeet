package com.appdev.academeet.service;

import com.appdev.academeet.dto.SessionDTO; // <-- IMPORT DTO
import com.appdev.academeet.model.Session;
import com.appdev.academeet.repository.SessionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional; // <-- IMPORT TRANSACTIONAL

import java.util.List;
import java.util.stream.Collectors; // <-- IMPORT COLLECTORS

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
        return sessionRepository.findAll()
                .stream()
                .map(SessionDTO::new) // <-- CONVERT TO DTO
                .collect(Collectors.toList());
    }
}