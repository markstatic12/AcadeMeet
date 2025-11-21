package com.appdev.academeet.controller;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping; // <-- IMPORT DTO
import org.springframework.web.bind.annotation.RestController;

import com.appdev.academeet.dto.SessionDTO;
import com.appdev.academeet.model.Session;
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
    public SessionDTO createSession(@RequestBody Session session, @RequestHeader("X-User-Id") Long userId) {
        User host = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        session.setHost(host); // attach host
        
        Session savedSession = sessionService.createSession(session);
        
        // Convert to DTO before returning
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
}