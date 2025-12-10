package com.appdev.academeet.controller;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
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
import com.appdev.academeet.service.SessionService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/sessions")
public class SessionController extends BaseController {

    private final SessionService sessionService;

    public SessionController(SessionService sessionService) {
        this.sessionService = sessionService;
    }

    /**
     * Creates a new session with the authenticated user as host.
     */
    @PostMapping
    public ResponseEntity<SessionDTO> createSession(@Valid @RequestBody CreateSessionRequest request) {
        User host = getAuthenticatedUser();
        Session savedSession = sessionService.createSessionFromDTO(request, host.getId());
        return ResponseEntity.status(HttpStatus.CREATED).body(new SessionDTO(savedSession));
    }

    /**
     * Gets all sessions for the authenticated user.
     */
    @GetMapping("/user/me")
    public ResponseEntity<List<SessionDTO>> getMySessionsByUser() {
        User user = getAuthenticatedUser();
        List<SessionDTO> sessions = sessionService.getSessionsByUserId(user.getId());
        return ResponseEntity.ok(sessions);
    }

    /**
     * Gets completed sessions (history) for the authenticated user.
     */
    @GetMapping("/user/me/history")
    public ResponseEntity<List<SessionDTO>> getMyCompletedSessions() {
        User user = getAuthenticatedUser();
        List<SessionDTO> sessions = sessionService.getCompletedSessionsByUserId(user.getId());
        return ResponseEntity.ok(sessions);
    }

    /**
     * Gets trashed sessions for the authenticated user.
     */
    @GetMapping("/user/me/trash")
    public ResponseEntity<List<SessionDTO>> getMyTrashedSessions() {
        User user = getAuthenticatedUser();
        List<SessionDTO> sessions = sessionService.getTrashedSessionsByUserId(user.getId());
        return ResponseEntity.ok(sessions);
    }

    /**
     * Gets all sessions that the authenticated user has joined (as participant).
     */
    @GetMapping("/user/me/joined")
    public ResponseEntity<List<SessionDTO>> getMyJoinedSessions() {
        User user = getAuthenticatedUser();
        List<SessionDTO> sessions = sessionService.getJoinedSessionsByUserId(user.getId());
        return ResponseEntity.ok(sessions);
    }

    /**
     * Gets all sessions hosted by a specific user (for viewing other users' profiles).
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<SessionDTO>> getSessionsByUserId(@PathVariable Long userId) {
        List<SessionDTO> sessions = sessionService.getSessionsByUserId(userId);
        return ResponseEntity.ok(sessions);
    }

    /**
     * Gets all sessions in the system.
     */
    @GetMapping("/all-sessions")
    public ResponseEntity<List<SessionDTO>> getAllSessions() {
        return ResponseEntity.ok(sessionService.getAllSessions());
    }

    /**
     * Gets trending sessions based on tag popularity.
     */
    @GetMapping("/trending")
    public ResponseEntity<List<SessionDTO>> getTrendingSessions() {
        return ResponseEntity.ok(sessionService.getTrendingSessions());
    }

    /**
     * Validates session password without joining (for private session access).
     */
    @PostMapping("/{id}/validate-password")
    public ResponseEntity<Map<String, String>> validateSessionPassword(@PathVariable Long id, @Valid @RequestBody JoinSessionRequest request) {
        sessionService.validateSessionPassword(id, request.getPassword());
        return ResponseEntity.ok(Map.of("message", "Password is valid"));
    }

    /**
     * Joins a session with password validation and participant limit checks.
     */
    @PostMapping("/{sessionId}/join")
    public ResponseEntity<Map<String, String>> joinSession(@PathVariable Long sessionId, @Valid @RequestBody(required = false) JoinSessionRequest request) {
        User user = getAuthenticatedUser();
        String password = (request != null) ? request.getPassword() : null;
        sessionService.joinSession(sessionId, user, password);
        return ResponseEntity.ok(Map.of("message", "Successfully joined session"));
    }

    /**
     * Cancel participation in a session.
     */
    @PostMapping("/{id}/cancel-join")
    public ResponseEntity<Map<String, String>> cancelJoinSession(@PathVariable Long id) {
        User user = getAuthenticatedUser();
        sessionService.cancelJoinSession(id, user);
        return ResponseEntity.ok(Map.of("message", "Successfully canceled participation"));
    }

    /**
     * Leave a session.
     */
    @DeleteMapping("/{sessionId}/leave")
    public ResponseEntity<Void> leaveSession(@PathVariable Long sessionId) {
        User user = getAuthenticatedUser();
        sessionService.leaveSession(sessionId, user.getId());
        return ResponseEntity.noContent().build();
    }

    /**
     * Check if user is a participant of a session.
     */
    @GetMapping("/{id}/is-participant")
    public ResponseEntity<Map<String, Boolean>> isUserParticipant(@PathVariable Long id) {
        User user = getAuthenticatedUser();
        boolean isParticipant = sessionService.isUserParticipant(id, user.getId());
        return ResponseEntity.ok(Map.of("isParticipant", isParticipant));
    }

    /**
     * Updates session status (ACTIVE, SCHEDULED, COMPLETED, etc.).
     */
    @PatchMapping("/{id}/status")
    public ResponseEntity<Map<String, String>> updateSessionStatus(@PathVariable Long id, @Valid @RequestBody UpdateStatusRequest request) {
        sessionService.updateSessionStatus(id, request.getStatus());
        return ResponseEntity.ok(Map.of("message", "Session status updated successfully"));
    }

    /**
     * Close a session (only host can close).
     */
    @PutMapping("/{sessionId}/close")
    public ResponseEntity<Map<String, String>> closeSession(@PathVariable Long sessionId) {
        User user = getAuthenticatedUser();
        sessionService.closeSession(sessionId, user.getId());
        return ResponseEntity.ok(Map.of("message", "Session closed successfully"));
    }

    /**
     * Update session details.
     */
    @PutMapping("/{id}")
    public ResponseEntity<SessionDTO> updateSession(@PathVariable Long id, @Valid @RequestBody UpdateSessionRequest request) {
        User authenticatedUser = getAuthenticatedUser();
        Session updatedSession = sessionService.updateSessionFromDTO(id, request, authenticatedUser.getId());
        return ResponseEntity.ok(new SessionDTO(updatedSession));
    }

    /**
     * Gets a single session by ID.
     */
    @GetMapping("/{id}")
    public ResponseEntity<SessionDTO> getSessionById(@PathVariable Long id) {
        Optional<Session> sessionOpt = sessionService.findById(id);
        return sessionOpt.map(session -> ResponseEntity.ok(new SessionDTO(session)))
                         .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Gets sessions filtered by status, or all sessions if no status provided.
     */
    @GetMapping
    public ResponseEntity<List<SessionDTO>> getSessionsByStatus(@RequestParam(required = false) SessionStatus status) {
        List<SessionDTO> sessions = status != null ? sessionService.getSessionsByStatus(status) : sessionService.getAllSessions();
        return ResponseEntity.ok(sessions);
    }

    /**
     * Gets sessions scheduled for a specific date.
     */
    @GetMapping("/by-date")
    public ResponseEntity<List<SessionDTO>> getSessionsByDate(@RequestParam String year, 
                                                               @RequestParam String month, 
                                                               @RequestParam String day) {
        List<SessionDTO> result = sessionService.getSessionsByDate(year, month, day);
        return ResponseEntity.ok(result);
    }

    /**
     * Uploads an image for a session (profile or cover).
     */
    @PostMapping("/{id}/upload-image")
    public ResponseEntity<Map<String, String>> uploadSessionImage(@PathVariable Long id, 
                                                                   @RequestParam("file") MultipartFile file, 
                                                                   @RequestParam("type") String type) throws IOException {
        String result = sessionService.uploadSessionImage(id, file, type);
        return ResponseEntity.ok(Map.of("message", result));
    }

    /**
     * Gets the list of participants for a specific session.
     */
    @GetMapping("/{sessionId}/participants")
    public ResponseEntity<List<Map<String, Object>>> getSessionParticipants(@PathVariable Long sessionId) {
        List<Map<String, Object>> participants = sessionService.getSessionParticipants(sessionId);
        return ResponseEntity.ok(participants);
    }

    /**
     * Removes a participant from a session (host only).
     */
    @DeleteMapping("/{sessionId}/participants/{userId}")
    public ResponseEntity<Map<String, String>> removeParticipant(@PathVariable Long sessionId, 
                                                                  @PathVariable Long userId,
                                                                  @RequestHeader("Authorization") String token) {
        Map<String, String> result = sessionService.removeParticipant(sessionId, userId, token);
        return ResponseEntity.ok(result);
    }
}