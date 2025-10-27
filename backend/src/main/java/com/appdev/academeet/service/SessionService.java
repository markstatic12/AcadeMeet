package com.appdev.academeet.service;

import com.appdev.academeet.model.Session;
import com.appdev.academeet.model.Host;
import com.appdev.academeet.repository.SessionRepository;
import com.appdev.academeet.repository.HostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class SessionService {
    
    @Autowired
    private SessionRepository sessionRepository;
    
    @Autowired
    private HostRepository hostRepository;
    
    // Create
    public Session createSession(Session session) {
        // Validate host exists
        if (session.getHost() != null && session.getHost().getId() != null) {
            Host host = hostRepository.findById(session.getHost().getId())
                .orElseThrow(() -> new RuntimeException("Host not found with id: " + session.getHost().getId()));
            session.setHost(host);
        }
        
        return sessionRepository.save(session);
    }
    
    // Read
    public List<Session> getAllSessions() {
        return sessionRepository.findAll();
    }
    
    public Optional<Session> getSessionById(Integer id) {
        return sessionRepository.findById(id);
    }
    
    public List<Session> getSessionsByHost(Host host) {
        return sessionRepository.findByHost(host);
    }
    
    public List<Session> getSessionsByHostId(Long hostId) {
        return sessionRepository.findByHostId(hostId);
    }
    
    public List<Session> getSessionsByStatus(String status) {
        return sessionRepository.findByStatus(status);
    }
    
    public List<Session> searchSessionsBySubject(String subject) {
        return sessionRepository.findBySubjectContainingIgnoreCase(subject);
    }
    
    public List<Session> getSessionsBetweenDates(LocalDateTime start, LocalDateTime end) {
        return sessionRepository.findByScheduleBetween(start, end);
    }
    
    public List<Session> getUpcomingSessions() {
        return sessionRepository.findUpcomingSessions(LocalDateTime.now());
    }
    
    public List<Session> getSessionsByStatusOrdered(String status) {
        return sessionRepository.findByStatusOrderBySchedule(status);
    }
    
    // Update
    public Session updateSession(Integer id, Session sessionDetails) {
        Session session = sessionRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Session not found with id: " + id));
        
        session.setTime(sessionDetails.getTime());
        session.setSubject(sessionDetails.getSubject());
        session.setSchedule(sessionDetails.getSchedule());
        session.setDescription(sessionDetails.getDescription());
        session.setStatus(sessionDetails.getStatus());
        
        // Update host if provided
        if (sessionDetails.getHost() != null && sessionDetails.getHost().getId() != null) {
            Host host = hostRepository.findById(sessionDetails.getHost().getId())
                .orElseThrow(() -> new RuntimeException("Host not found with id: " + sessionDetails.getHost().getId()));
            session.setHost(host);
        }
        
        return sessionRepository.save(session);
    }
    
    // Delete
    public void deleteSession(Integer id) {
        Session session = sessionRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Session not found with id: " + id));
        sessionRepository.delete(session);
    }
    
    // Update status
    public Session updateSessionStatus(Integer id, String status) {
        Session session = sessionRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Session not found with id: " + id));
        session.setStatus(status);
        return sessionRepository.save(session);
    }
    
    // Cancel session
    public Session cancelSession(Integer id) {
        return updateSessionStatus(id, "CANCELLED");
    }
    
    // Complete session
    public Session completeSession(Integer id) {
        return updateSessionStatus(id, "COMPLETED");
    }
    
    // Start session
    public Session startSession(Integer id) {
        return updateSessionStatus(id, "ONGOING");
    }
}
