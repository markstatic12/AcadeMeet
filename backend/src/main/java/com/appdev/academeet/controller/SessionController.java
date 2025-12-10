package com.appdev.academeet.controller;

import java.util.List;
import java.util.Map;

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

    @PostMapping
    public ResponseEntity<SessionDTO> createSession(@Valid @RequestBody CreateSessionRequest request) {
        User host = getAuthenticatedUser();
        Session savedSession = sessionService.createSessionFromDTO(request, host.getId());
        return ResponseEntity.status(HttpStatus.CREATED).body(new SessionDTO(savedSession));
    }

    @GetMapping("/user/me")
    public ResponseEntity<List<SessionDTO>> getMySessionsByUser() {
        User user = getAuthenticatedUser();
        List<SessionDTO> sessions = sessionService.getSessionsByUserId(user.getId());
        return ResponseEntity.ok(sessions);
    }

    @GetMapping("/user/me/history")
    public ResponseEntity<List<SessionDTO>> getMyCompletedSessions() {
        User user = getAuthenticatedUser();
        List<SessionDTO> sessions = sessionService.getCompletedSessionsByUserId(user.getId());
        return ResponseEntity.ok(sessions);
    }

    @GetMapping("/user/me/trash")
    public ResponseEntity<List<SessionDTO>> getMyTrashedSessions() {
        User user = getAuthenticatedUser();
        List<SessionDTO> sessions = sessionService.getTrashedSessionsByUserId(user.getId());
        return ResponseEntity.ok(sessions);
    }

    @GetMapping("/user/me/joined")
    public ResponseEntity<List<SessionDTO>> getMyJoinedSessions() {
        User user = getAuthenticatedUser();
        List<SessionDTO> sessions = sessionService.getJoinedSessionsByUserId(user.getId());
        return ResponseEntity.ok(sessions);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<SessionDTO>> getSessionsByUserId(@PathVariable Long userId) {
        User currentUser = getAuthenticatedUser();
        List<SessionDTO> sessions;
        
        // If viewing own profile, show all sessions
        if (currentUser.getId().equals(userId)) {
            sessions = sessionService.getSessionsByUserId(userId);
        } else {
            // Viewing another user - only show public sessions
            sessions = sessionService.getPublicSessionsByUserId(userId);
        }
        
        return ResponseEntity.ok(sessions);
    }

    @GetMapping("/all-sessions")
    public ResponseEntity<List<SessionDTO>> getAllSessions() {
        return ResponseEntity.ok(sessionService.getAllSessions());
    }

    @GetMapping("/trending")
    public ResponseEntity<List<SessionDTO>> getTrendingSessions() {
        return ResponseEntity.ok(sessionService.getTrendingSessions());
    }

    @PostMapping("/{id}/validate-password")
    public ResponseEntity<Map<String, String>> validateSessionPassword(@PathVariable Long id, @Valid @RequestBody JoinSessionRequest request) {
        sessionService.validateSessionPassword(id, request.getPassword());
        return ResponseEntity.ok(Map.of("message", "Password is valid"));
    }

    @PostMapping("/{sessionId}/join")
    public ResponseEntity<Map<String, String>> joinSession(@PathVariable Long sessionId, @Valid @RequestBody(required = false) JoinSessionRequest request) {
        User user = getAuthenticatedUser();
        String password = (request != null) ? request.getPassword() : null;
        sessionService.joinSession(sessionId, user, password);
        return ResponseEntity.ok(Map.of("message", "Successfully joined session"));
    }

    @PostMapping("/{id}/cancel-join")
    public ResponseEntity<Map<String, String>> cancelJoinSession(@PathVariable Long id) {
        User user = getAuthenticatedUser();
        sessionService.cancelJoinSession(id, user);
        return ResponseEntity.ok(Map.of("message", "Successfully canceled participation"));
    }

    @DeleteMapping("/{sessionId}/leave")
    public ResponseEntity<Void> leaveSession(@PathVariable Long sessionId) {
        User user = getAuthenticatedUser();
        sessionService.leaveSession(sessionId, user.getId());
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/is-participant")
    public ResponseEntity<Map<String, Boolean>> isUserParticipant(@PathVariable Long id) {
        User user = getAuthenticatedUser();
        boolean isParticipant = sessionService.isUserParticipant(id, user.getId());
        return ResponseEntity.ok(Map.of("isParticipant", isParticipant));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<Map<String, String>> updateSessionStatus(@PathVariable Long id, @Valid @RequestBody UpdateStatusRequest request) {
        User user = getAuthenticatedUser();
        sessionService.updateSessionStatus(id, request.getStatus(), user.getId());
        return ResponseEntity.ok(Map.of("message", "Session status updated successfully"));
    }

    @PutMapping("/{sessionId}/close")
    public ResponseEntity<Map<String, String>> closeSession(@PathVariable Long sessionId) {
        User user = getAuthenticatedUser();
        sessionService.closeSession(sessionId, user.getId());
        return ResponseEntity.ok(Map.of("message", "Session closed successfully"));
    }

    @PutMapping("/{id}")
    public ResponseEntity<SessionDTO> updateSession(@PathVariable Long id, @Valid @RequestBody UpdateSessionRequest request) {
        User authenticatedUser = getAuthenticatedUser();
        Session updatedSession = sessionService.updateSessionFromDTO(id, request, authenticatedUser.getId());
        return ResponseEntity.ok(new SessionDTO(updatedSession));
    }

    @GetMapping("/{id}")
    public ResponseEntity<SessionDTO> getSessionById(@PathVariable Long id) {
        User user = getAuthenticatedUser();
        Session session = sessionService.findById(id)
            .orElseThrow(() -> new RuntimeException("Session not found"));
        
        if (session.getSessionPrivacy() == com.appdev.academeet.model.SessionPrivacy.PRIVATE) {
            boolean isOwner = session.getHost().getId().equals(user.getId());
            boolean isParticipant = sessionService.isUserParticipant(id, user.getId());
            
            if (!isOwner && !isParticipant) {
                throw new SecurityException("You do not have permission to view this private session");
            }
        }
        
        return ResponseEntity.ok(new SessionDTO(session));
    }

    @GetMapping
    public ResponseEntity<List<SessionDTO>> getSessionsByStatus(@RequestParam(required = false) SessionStatus status) {
        List<SessionDTO> sessions = status != null ? sessionService.getSessionsByStatus(status) : sessionService.getAllSessions();
        return ResponseEntity.ok(sessions);
    }

    @GetMapping("/by-date")
    public ResponseEntity<List<SessionDTO>> getSessionsByDate(@RequestParam String year, 
                                                               @RequestParam String month, 
                                                               @RequestParam String day) {
        List<SessionDTO> result = sessionService.getSessionsByDate(year, month, day);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/{sessionId}/participants")
    public ResponseEntity<List<Map<String, Object>>> getSessionParticipants(@PathVariable Long sessionId) {
        List<Map<String, Object>> participants = sessionService.getSessionParticipants(sessionId);
        return ResponseEntity.ok(participants);
    }

    @DeleteMapping("/{sessionId}/participants/{userId}")
    public ResponseEntity<Map<String, String>> removeParticipant(@PathVariable Long sessionId, 
                                                                  @PathVariable Long userId,
                                                                  @RequestHeader("Authorization") String token) {
        Map<String, String> result = sessionService.removeParticipant(sessionId, userId, token);
        return ResponseEntity.ok(result);
    }
}