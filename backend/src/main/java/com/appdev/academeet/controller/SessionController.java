package com.appdev.academeet.controller;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.appdev.academeet.dto.CreateSessionRequest;
import com.appdev.academeet.dto.JoinSessionRequest;
import com.appdev.academeet.dto.SessionDTO;
import com.appdev.academeet.dto.UpdateSessionRequest;
import com.appdev.academeet.dto.UpdateStatusRequest;
import com.appdev.academeet.model.Session;
import com.appdev.academeet.model.SessionStatus;
import com.appdev.academeet.model.User;
import com.appdev.academeet.repository.UserRepository;
import com.appdev.academeet.service.SessionService;

import jakarta.validation.Valid;

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
     * Global exception handler for validation errors
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<?> handleValidationExceptions(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new java.util.HashMap<>();
        ex.getBindingResult().getAllErrors().forEach((error) -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });
        return ResponseEntity.badRequest().body(Map.of("errors", errors));
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
     * Helper method to get authenticated user from JWT token
     */
    private User getAuthenticatedUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("User not authenticated");
        }
        
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        String email = userDetails.getUsername();
        
        return userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));
    }

    /**
     * Creates a new session with the authenticated user as host.
     */
    @PostMapping
    public ResponseEntity<?> createSession(@Valid @RequestBody CreateSessionRequest request) {
        try {
            User host = getAuthenticatedUser();
            Session toCreate = request.toEntity();
            Session savedSession = sessionService.createSession(toCreate, host.getId());
            return ResponseEntity.status(HttpStatus.CREATED).body(new SessionDTO(savedSession));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Gets all sessions for the authenticated user.
     */
    @GetMapping("/user/me")
    public ResponseEntity<?> getMySessionsByUser() {
        try {
            User user = getAuthenticatedUser();
            List<SessionDTO> sessions = sessionService.getSessionsByUserId(user.getId());
            return ResponseEntity.ok(sessions);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Gets completed sessions (history) for the authenticated user.
     */
    @GetMapping("/user/me/history")
    public ResponseEntity<?> getMyCompletedSessions() {
        try {
            User user = getAuthenticatedUser();
            List<SessionDTO> sessions = sessionService.getCompletedSessionsByUserId(user.getId());
            return ResponseEntity.ok(sessions);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Gets trashed sessions for the authenticated user.
     */
    @GetMapping("/user/me/trash")
    public ResponseEntity<?> getMyTrashedSessions() {
        try {
            User user = getAuthenticatedUser();
            List<SessionDTO> sessions = sessionService.getTrashedSessionsByUserId(user.getId());
            return ResponseEntity.ok(sessions);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Gets all sessions that the authenticated user has joined (as participant).
     */
    @GetMapping("/user/me/joined")
    public ResponseEntity<?> getMyJoinedSessions() {
        try {
            User user = getAuthenticatedUser();
            List<SessionDTO> sessions = sessionService.getJoinedSessionsByUserId(user.getId());
            return ResponseEntity.ok(sessions);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Gets all sessions hosted by a specific user (for viewing other users' profiles).
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getSessionsByUserId(@PathVariable Long userId) {
        try {
            List<SessionDTO> sessions = sessionService.getSessionsByUserId(userId);
            return ResponseEntity.ok(sessions);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Gets all sessions in the system.
     */
    @GetMapping("/all-sessions")
    public List<SessionDTO> getAllSessions() {
        return sessionService.getAllSessions();
    }

    /**
     * Gets trending sessions based on tag popularity.
     */
    @GetMapping("/trending")
    public List<SessionDTO> getTrendingSessions() {
        return sessionService.getTrendingSessions();
    }

    /**
     * Validates session password without joining (for private session access).
     */
    @PostMapping("/{id}/validate-password")
    public ResponseEntity<?> validateSessionPassword(@PathVariable Long id, @Valid @RequestBody JoinSessionRequest request) {
        return handleSessionOperation(() -> {
            if (!sessionService.validateSessionPassword(id, request.getPassword())) {
                throw new RuntimeException("Invalid password or session not found");
            }
            return "Password is valid";
        });
    }

    /**
     * Joins a session with password validation and participant limit checks.
     * Uses the new business logic in SessionService.joinSession()
     */
    @PostMapping("/{sessionId}/join")
    public ResponseEntity<?> joinSession(@PathVariable Long sessionId, @Valid @RequestBody(required = false) JoinSessionRequest request) {
        try {
            User user = getAuthenticatedUser();
            String password = (request != null) ? request.getPassword() : null;
            sessionService.joinSession(sessionId, user, password);
            return ResponseEntity.ok(Map.of("message", "Successfully joined session"));
        } catch (IllegalStateException | SecurityException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Failed to join session: " + e.getMessage()));
        }
    }

    /**
     * Cancel participation in a session.
     */
    @PostMapping("/{id}/cancel-join")
    public ResponseEntity<?> cancelJoinSession(@PathVariable Long id) {
        try {
            User user = getAuthenticatedUser();
            sessionService.cancelJoinSession(id, user);
            return ResponseEntity.ok(Map.of("message", "Successfully canceled participation"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Leave a session.
     * DELETE /api/sessions/{sessionId}/leave
     */
    @org.springframework.web.bind.annotation.DeleteMapping("/{sessionId}/leave")
    public ResponseEntity<?> leaveSession(@PathVariable Long sessionId) {
        try {
            User user = getAuthenticatedUser();
            sessionService.leaveSession(sessionId, user.getId());
            return ResponseEntity.noContent().build();
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Failed to leave session: " + e.getMessage()));
        }
    }

    /**
     * Check if user is a participant of a session.
     */
    @GetMapping("/{id}/is-participant")
    public ResponseEntity<?> isUserParticipant(@PathVariable Long id) {
        try {
            User user = getAuthenticatedUser();
            boolean isParticipant = sessionService.isUserParticipant(id, user.getId());
            return ResponseEntity.ok(Map.of("isParticipant", isParticipant));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Updates session status (ACTIVE, SCHEDULED, COMPLETED, etc.).
     */
    @PatchMapping("/{id}/status")
    public ResponseEntity<?> updateSessionStatus(@PathVariable Long id, @Valid @RequestBody UpdateStatusRequest request) {
        return handleSessionOperation(() -> {
            sessionService.updateSessionStatus(id, request.getStatus());
            return "Session status updated successfully";
        });
    }

    /**
     * Close a session (only host can close).
     * PUT /api/sessions/{sessionId}/close
     */
    @org.springframework.web.bind.annotation.PutMapping("/{sessionId}/close")
    public ResponseEntity<?> closeSession(@PathVariable Long sessionId) {
        try {
            User user = getAuthenticatedUser();
            sessionService.closeSession(sessionId, user.getId());
            return ResponseEntity.ok(Map.of("message", "Session closed successfully"));
        } catch (SecurityException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Failed to close session: " + e.getMessage()));
        }
    }

    /**
     * Update session details.
     */
    @PutMapping("/{id}")
    public ResponseEntity<?> updateSession(@PathVariable Long id, @Valid @RequestBody UpdateSessionRequest request) {
        try {
            User authenticatedUser = getAuthenticatedUser();
            Session updated = request.toEntity();
            Session updatedSession = sessionService.updateSession(id, updated, authenticatedUser.getId());
            return ResponseEntity.ok(new SessionDTO(updatedSession));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (RuntimeException e) {
            // Check if it's an authorization error
            if (e.getMessage() != null && e.getMessage().contains("Unauthorized")) {
                return ResponseEntity.status(403).body(Map.of("error", e.getMessage()));
            }
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Gets a single session by ID.
     */
    @GetMapping("/{id}")
    public ResponseEntity<SessionDTO> getSessionById(@PathVariable Long id) {
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
        System.out.println("========================================");
        System.out.println("CONTROLLER: getSessionsByDate called");
        System.out.println("Parameters: year=" + year + ", month=" + month + ", day=" + day);
        List<SessionDTO> result = sessionService.getSessionsByDate(year, month, day);
        System.out.println("CONTROLLER: Returning " + result.size() + " sessions");
        System.out.println("========================================");
        return result;
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

    /**
     * Gets the list of participants for a specific session.
     */
    @GetMapping("/{sessionId}/participants")
    public ResponseEntity<?> getSessionParticipants(@PathVariable Long sessionId) {
        try {
            List<Map<String, Object>> participants = sessionService.getSessionParticipants(sessionId);
            return ResponseEntity.ok(participants);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Removes a participant from a session (host only).
     */
    @DeleteMapping("/{sessionId}/participants/{userId}")
    public ResponseEntity<?> removeParticipant(@PathVariable Long sessionId, 
                                              @PathVariable Long userId,
                                              @RequestHeader("Authorization") String token) {
        try {
            Map<String, String> result = sessionService.removeParticipant(sessionId, userId, token);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("error", e.getMessage()));
        }
    }
}