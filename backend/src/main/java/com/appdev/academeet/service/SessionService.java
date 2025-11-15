package com.appdev.academeet.service;

import org.springframework.stereotype.Service;

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
}