package com.appdev.academeet.controller;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
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

    /**
     * Helper method to handle common session operation error patterns.
     */
    private ResponseEntity<?> handleSessionOperation(SessionOperation operation) {
        try {
            String message = operation.execute();
            return ResponseEntity.ok(Map.of("message", message));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @FunctionalInterface
    private interface SessionOperation {
        String execute() throws Exception;
    }

    /**
     * Creates a new session with the specified user as host.
     */
    @PostMapping
    public SessionDTO createSession(@RequestBody Session session, @RequestHeader("X-User-Id") Long userId) {
        User host = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        session.setHost(host);
        Session savedSession = sessionService.createSession(session);
        return new SessionDTO(savedSession);
    }

    /**
     * Gets all sessions for a specific user.
     */
    @GetMapping("/user/{userId}")
    public List<SessionDTO> getSessionsByUser(@PathVariable Long userId) { 
        return sessionService.getSessionsByUserId(userId);
    }

    /**
     * Gets all sessions in the system.
     */
    @GetMapping("/all-sessions")
    public List<SessionDTO> getAllSessions() {
        return sessionService.getAllSessions();
    }

    /**
     * Validates session password without joining (for private session access).
     */
    @PostMapping("/{id}/validate-password")
    public ResponseEntity<?> validateSessionPassword(@PathVariable Long id, @RequestBody JoinSessionRequest request) {
        return handleSessionOperation(() -> {
            if (!sessionService.validateSessionPassword(id, request.getPassword())) {
                throw new RuntimeException("Invalid password or session not found");
            }
            return "Password is valid";
        });
    }

    /**
     * Joins a session with password validation and participant limit checks.
     */
    @PostMapping("/{id}/join")
    public ResponseEntity<?> joinSession(@PathVariable Long id, @RequestBody JoinSessionRequest request) {
        return handleSessionOperation(() -> {
            // Validate password for private sessions
            if (!sessionService.validateSessionPassword(id, request.getPassword())) {
                throw new RuntimeException("Invalid password or session not found");
            }
            
            // Check if session has space
            if (!sessionService.checkParticipantLimit(id)) {
                throw new RuntimeException("Session is full");
            }
            
            // Add participant
            sessionService.incrementParticipant(id);
            return "Successfully joined session";
        });
    }

    /**
     * Updates session status (ACTIVE, SCHEDULED, COMPLETED, etc.).
     */
    @PatchMapping("/{id}/status")
    public ResponseEntity<?> updateSessionStatus(@PathVariable Long id, @RequestBody UpdateStatusRequest request) {
        return handleSessionOperation(() -> {
            sessionService.updateSessionStatus(id, request.getStatus());
            return "Session status updated successfully";
        });
    }

    /**
     * Gets a single session by ID.
     */
    @GetMapping("/{id}")
    public ResponseEntity<SessionDTO> getSessionById(@PathVariable Long id, 
                                                   @RequestHeader(value = "X-User-Id", required = false) Long userId) {
        try {
            Optional<Session> sessionOpt = sessionService.findById(id);
            return sessionOpt.map(session -> ResponseEntity.ok(new SessionDTO(session)))
                           .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Gets sessions filtered by status, or all sessions if no status provided.
     */
    @GetMapping
    public List<SessionDTO> getSessionsByStatus(@RequestParam(required = false) SessionStatus status) {
        return status != null ? sessionService.getSessionsByStatus(status) : sessionService.getAllSessions();
    }

    /**
     * Gets sessions scheduled for a specific date.
     */
    @GetMapping("/by-date")
    public List<SessionDTO> getSessionsByDate(@RequestParam String year, 
                                            @RequestParam String month, 
                                            @RequestParam String day) {
        return sessionService.getSessionsByDate(year, month, day);
    }

    /**
     * Uploads an image for a session (profile or cover).
     */
    @PostMapping("/{id}/upload-image")
    public ResponseEntity<?> uploadSessionImage(@PathVariable Long id, 
                                              @RequestParam("file") MultipartFile file, 
                                              @RequestParam("type") String type) {
        return handleSessionOperation(() -> sessionService.uploadSessionImage(id, file, type));
    }
}