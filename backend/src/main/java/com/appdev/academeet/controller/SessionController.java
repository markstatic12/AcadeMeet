package com.appdev.academeet.controller;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.appdev.academeet.dto.SessionDTO;
import com.appdev.academeet.model.Session;
import com.appdev.academeet.model.User;
import com.appdev.academeet.repository.UserRepository;
import com.appdev.academeet.security.JwtUserPrincipal;
import com.appdev.academeet.service.SessionService;

@RestController
@RequestMapping("/api/sessions")
@CrossOrigin(origins = "http://localhost:5173")
public class SessionController {

    private final SessionService sessionService;
    private final UserRepository userRepository;

    public SessionController(SessionService sessionService, UserRepository userRepository) {
        this.sessionService = sessionService;
        this.userRepository = userRepository;
    }

    // Create session - automatically uses current authenticated user as host
    @PostMapping("/create")
    public SessionDTO createSession(
            @RequestBody Session session,
            @org.springframework.security.core.annotation.AuthenticationPrincipal JwtUserPrincipal userPrincipal) {
        
        if (userPrincipal == null) {
            throw new RuntimeException("User not authenticated");
        }
        
        User host = userRepository.findById(userPrincipal.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        session.setHost(host);
        Session savedSession = sessionService.createSession(session);
        return new SessionDTO(savedSession);
    }

    // Get current user's sessions
    @GetMapping("/my-sessions")
    public List<SessionDTO> getMySessionsNative(
            @org.springframework.security.core.annotation.AuthenticationPrincipal JwtUserPrincipal userPrincipal) {
        
        if (userPrincipal == null) {
            throw new RuntimeException("User not authenticated");
        }
        
        return sessionService.getSessionsByUserId(userPrincipal.getUserId());
    }

    // Get specific user's sessions (public)
    @GetMapping("/user/{userId}")
    public List<SessionDTO> getSessionsByUser(@PathVariable Long userId) {
        return sessionService.getSessionsByUserId(userId);
    }

    // Get all sessions (public browse)
    @GetMapping("/all")
    public List<SessionDTO> getAllSessions() {
        return sessionService.getAllSessions();
    }

    // Delete session
    @DeleteMapping("/{sessionId}")
    public void deleteSession(
            @PathVariable Long sessionId,
            @org.springframework.security.core.annotation.AuthenticationPrincipal JwtUserPrincipal userPrincipal) {
        
        if (userPrincipal == null) {
            throw new RuntimeException("User not authenticated");
        }
        
        Session session = sessionService.getSessionById(sessionId);
        if (!session.getHost().getId().equals(userPrincipal.getUserId())) {
            throw new RuntimeException("You can only delete your own sessions");
        }
        
        sessionService.deleteSession(sessionId);
    }
}