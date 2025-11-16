package com.appdev.academeet.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.appdev.academeet.service.SessionService;
import com.appdev.academeet.dto.SessionDTO; // <-- IMPORT DTO
import com.appdev.academeet.model.Session;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import java.util.List;

import com.appdev.academeet.repository.UserRepository;
import com.appdev.academeet.model.User;
import org.springframework.web.bind.annotation.RequestParam;

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

    // --- MODIFIED METHOD ---
    @PostMapping("/create")
    public SessionDTO createSession(@RequestBody Session session, @RequestParam Long userId) { // <-- CHANGED RETURN TYPE
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