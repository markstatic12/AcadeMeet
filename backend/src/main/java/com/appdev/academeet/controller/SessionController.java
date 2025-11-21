package com.appdev.academeet.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.appdev.academeet.dto.JoinSessionRequest;
import com.appdev.academeet.dto.SessionDTO;
import com.appdev.academeet.dto.UpdateStatusRequest;
import com.appdev.academeet.model.Session;
import com.appdev.academeet.model.SessionStatus;
import com.appdev.academeet.model.User;
import com.appdev.academeet.repository.UserRepository;
import com.appdev.academeet.service.SessionService;

@RestController
@RequestMapping("/api/sessions")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174"})
public class SessionController {

    private final SessionService sessionService;
    private final UserRepository userRepository;

    public SessionController(SessionService sessionService, UserRepository userRepository) {
        this.sessionService = sessionService;
        this.userRepository = userRepository;
    }

    // --- CREATE SESSION (RESTful with X-User-Id header) ---
    @PostMapping
    public SessionDTO createSession(@RequestBody Session session, @RequestHeader(value = "X-User-Id", required = true) Long userId) {
        User host = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        session.setHost(host); 
        
        Session savedSession = sessionService.createSession(session);
        
        return new SessionDTO(savedSession);
    }

    // --- MODIFIED METHOD ---
    @GetMapping("/user/{userId}")
    public List<SessionDTO> getSessionsByUser(@PathVariable Long userId) { // <-- CHANGED RETURN TYPE
        return sessionService.getSessionsByUserId(userId);
    }

    // --- NEW METHOD ---
    @GetMapping("/all-sessions")
    public List<SessionDTO> getAllSessions() {
        return sessionService.getAllSessions();
    }

    // Session Privacy & Status Endpoints
    @PostMapping("/{id}/join")
    public ResponseEntity<?> joinSession(@PathVariable Long id, @RequestBody JoinSessionRequest request) {
        try {
            // Validate password if session is private
            if (!sessionService.validateSessionPassword(id, request.getPassword())) {
                return ResponseEntity.badRequest().body(Map.of("error", "Invalid password or session not found"));
            }
            
            // Check participant limit
            if (!sessionService.checkParticipantLimit(id)) {
                return ResponseEntity.badRequest().body(Map.of("error", "Session is full"));
            }
            
            // Join session (increment participant count)
            sessionService.incrementParticipant(id);
            
            return ResponseEntity.ok(Map.of("message", "Successfully joined session"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<?> updateSessionStatus(@PathVariable Long id, @RequestBody UpdateStatusRequest request) {
        try {
            sessionService.updateSessionStatus(id, request.getStatus());
            return ResponseEntity.ok(Map.of("message", "Session status updated successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping
    public List<SessionDTO> getSessionsByStatus(@RequestParam(required = false) SessionStatus status) {
        if (status != null) {
            return sessionService.getSessionsByStatus(status);
        } else {
            return sessionService.getAllSessions();
        }
    }

    @PostMapping("/{id}/upload-image")
    public ResponseEntity<?> uploadSessionImage(@PathVariable Long id, 
                                              @RequestParam("file") MultipartFile file, 
                                              @RequestParam("type") String type) {
        try {
            String imageUrl = sessionService.uploadSessionImage(id, file, type);
            return ResponseEntity.ok(Map.of("imageUrl", imageUrl));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}