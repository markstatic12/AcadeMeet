package com.appdev.academeet.service;

import com.appdev.academeet.model.Session;
import com.appdev.academeet.repository.SessionRepository;
import org.springframework.stereotype.Service;
import java.util.List;


@Service
public class SessionService {

    private final SessionRepository sessionRepository;

    public SessionService(SessionRepository sessionRepository) {
        this.sessionRepository = sessionRepository;
    }

    public Session createSession(Session session) {
        return sessionRepository.save(session);
    }

    public List<Session> getSessionsByUserId(Long userId) {
        return sessionRepository.findByHost_Id(userId);
    }

    public List<Session> getAllSessions() {
        return sessionRepository.findAll();
    }
}