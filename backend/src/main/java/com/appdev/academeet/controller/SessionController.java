package com.appdev.academeet.controller;

import com.appdev.academeet.model.Session;
import com.appdev.academeet.service.SessionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/sessions")
@CrossOrigin(origins = "http://localhost:5173")
public class SessionController {
    
    @Autowired
    private SessionService sessionService;
    
    // Create
    @PostMapping
    public ResponseEntity<?> createSession(@RequestBody Session session) {
        try {
            Session createdSession = sessionService.createSession(session);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdSession);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    // Get all
    @GetMapping
    public ResponseEntity<List<Session>> getAllSessions() {
        List<Session> sessions = sessionService.getAllSessions();
        return ResponseEntity.ok(sessions);
    }
    
    // Get by ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getSessionById(@PathVariable Integer id) {
        Optional<Session> session = sessionService.getSessionById(id);
        if (session.isPresent()) {
            return ResponseEntity.ok(session.get());
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Session not found");
    }
    
    // Get by host ID
    @GetMapping("/host/{hostId}")
    public ResponseEntity<List<Session>> getSessionsByHostId(@PathVariable Long hostId) {
        List<Session> sessions = sessionService.getSessionsByHostId(hostId);
        return ResponseEntity.ok(sessions);
    }
    
    // Get by status
    @GetMapping("/status/{status}")
    public ResponseEntity<List<Session>> getSessionsByStatus(@PathVariable String status) {
        List<Session> sessions = sessionService.getSessionsByStatus(status);
        return ResponseEntity.ok(sessions);
    }
    
    // Search by subject
    @GetMapping("/search")
    public ResponseEntity<List<Session>> searchSessionsBySubject(@RequestParam String subject) {
        List<Session> sessions = sessionService.searchSessionsBySubject(subject);
        return ResponseEntity.ok(sessions);
    }
    
    // Get upcoming sessions
    @GetMapping("/upcoming")
    public ResponseEntity<List<Session>> getUpcomingSessions() {
        List<Session> sessions = sessionService.getUpcomingSessions();
        return ResponseEntity.ok(sessions);
    }
    
    // Get sessions between dates
    @GetMapping("/between")
    public ResponseEntity<List<Session>> getSessionsBetweenDates(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime end) {
        List<Session> sessions = sessionService.getSessionsBetweenDates(start, end);
        return ResponseEntity.ok(sessions);
    }
    
    // Update
    @PutMapping("/{id}")
    public ResponseEntity<?> updateSession(@PathVariable Integer id, @RequestBody Session session) {
        try {
            Session updatedSession = sessionService.updateSession(id, session);
            return ResponseEntity.ok(updatedSession);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
    
    // Delete
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteSession(@PathVariable Integer id) {
        try {
            sessionService.deleteSession(id);
            return ResponseEntity.ok("Session deleted successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
    
    // Update status
    @PatchMapping("/{id}/status")
    public ResponseEntity<?> updateSessionStatus(@PathVariable Integer id, @RequestBody String status) {
        try {
            Session session = sessionService.updateSessionStatus(id, status);
            return ResponseEntity.ok(session);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
    
    // Start session
    @PatchMapping("/{id}/start")
    public ResponseEntity<?> startSession(@PathVariable Integer id) {
        try {
            Session session = sessionService.startSession(id);
            return ResponseEntity.ok(session);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
    
    // Complete session
    @PatchMapping("/{id}/complete")
    public ResponseEntity<?> completeSession(@PathVariable Integer id) {
        try {
            Session session = sessionService.completeSession(id);
            return ResponseEntity.ok(session);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
    
    // Cancel session
    @PatchMapping("/{id}/cancel")
    public ResponseEntity<?> cancelSession(@PathVariable Integer id) {
        try {
            Session session = sessionService.cancelSession(id);
            return ResponseEntity.ok(session);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
}
