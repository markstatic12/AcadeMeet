package com.appdev.academeet.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.appdev.academeet.service.SessionService;
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

    @PostMapping("/create")
    public Session createSession(@RequestBody Session session, @RequestParam Long userId) {
        User host = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        session.setHost(host); // attach host
        return sessionService.createSession(session);
    }

    // Get sessions by user
    @GetMapping("/user/{userId}")
    public List<Session> getSessionsByUser(@PathVariable Long userId) {
        return sessionService.getSessionsByUserId(userId);
    }
}


    // @Autowired
    // private SessionService sessionService;

    // @PostMapping
    // public ResponseEntity<SessionResponse> createSession(
    //     @RequestBody CreateSessionRequest request
    // ) {
    //     SessionResponse response = sessionService.createSession(request);

    //     // UPDATED: Check if the response message indicates an error
    //     if (response.getMessage().startsWith("Error:")) {
    //         // If it's an error, return a 400 Bad Request
    //         return ResponseEntity.badRequest().body(response);
    //     }
        
    //     // Otherwise, return 200 OK
    //     return ResponseEntity.ok(response);
    // }
    // @GetMapping
    // public ResponseEntity<List<SessionDetailsDto>> getAllSessions() {
    //     List<SessionDetailsDto> sessions = sessionService.getAllSessions();
    //     return ResponseEntity.ok(sessions);
    // }
