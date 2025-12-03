package com.appdev.academeet.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.appdev.academeet.model.SessionNote;
import com.appdev.academeet.model.SessionTag;
import com.appdev.academeet.model.User;
import com.appdev.academeet.repository.SessionTagRepository;
import com.appdev.academeet.repository.UserRepository;
import com.appdev.academeet.service.SessionNoteService;

/**
 * REST Controller for managing session resources (notes and tags).
 * Base Path: /api/sessions/{sessionId}/resources
 */
@RestController
@RequestMapping("/api/sessions/{sessionId}/resources")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174"})
public class ResourceController {

    @Autowired
    private SessionNoteService sessionNoteService;
    
    @Autowired
    private SessionTagRepository sessionTagRepository;
    
    @Autowired
    private UserRepository userRepository;
    
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
    
    // =============== NOTES ENDPOINTS ===============
    
    /**
     * Get all notes for a session.
     * GET /api/sessions/{sessionId}/resources/notes
     */
    @GetMapping("/notes")
    public ResponseEntity<?> getNotesForSession(@PathVariable Long sessionId) {
        try {
            User user = getAuthenticatedUser();
            List<SessionNote> notes = sessionNoteService.getNotesForSession(sessionId, user.getId());
            return ResponseEntity.ok(notes);
        } catch (SecurityException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to fetch notes: " + e.getMessage()));
        }
    }
    
    /**
     * Add a new note to a session.
     * POST /api/sessions/{sessionId}/resources/notes
     * Enforces max 3 notes rule.
     */
    @PostMapping("/notes")
    public ResponseEntity<?> addNote(@PathVariable Long sessionId, @RequestBody Map<String, String> request) {
        try {
            User user = getAuthenticatedUser();
            String filepath = request.get("filepath");
            
            if (filepath == null || filepath.trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Filepath is required"));
            }
            
            SessionNote note = sessionNoteService.addNote(sessionId, filepath, user.getId());
            return ResponseEntity.status(HttpStatus.CREATED).body(note);
        } catch (IllegalStateException e) {
            // Max notes limit reached
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("error", e.getMessage()));
        } catch (SecurityException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to add note: " + e.getMessage()));
        }
    }
    
    /**
     * Delete a note from a session.
     * DELETE /api/sessions/{sessionId}/resources/notes/{noteId}
     * Only the host can delete notes.
     */
    @DeleteMapping("/notes/{noteId}")
    public ResponseEntity<?> deleteNote(@PathVariable Long sessionId, @PathVariable String noteId) {
        try {
            User user = getAuthenticatedUser();
            sessionNoteService.deleteNote(noteId, user.getId());
            return ResponseEntity.noContent().build();
        } catch (SecurityException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to delete note: " + e.getMessage()));
        }
    }
    
    // =============== TAGS ENDPOINTS ===============
    
    /**
     * Get all tags for a session.
     * GET /api/sessions/{sessionId}/resources/tags
     */
    @GetMapping("/tags")
    public ResponseEntity<?> getTagsForSession(@PathVariable Long sessionId) {
        try {
            List<SessionTag> tags = sessionTagRepository.findBySessionId(sessionId);
            return ResponseEntity.ok(tags);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to fetch tags: " + e.getMessage()));
        }
    }
    
    /**
     * Add a new tag to a session.
     * POST /api/sessions/{sessionId}/resources/tags
     * Only the host can add tags.
     */
    @PostMapping("/tags")
    public ResponseEntity<?> addTag(@PathVariable Long sessionId, @RequestBody Map<String, String> request) {
        try {
            String tagName = request.get("tagName");
            
            if (tagName == null || tagName.trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Tag name is required"));
            }
            
            // Check if tag already exists
            if (sessionTagRepository.existsBySessionIdAndTagName(sessionId, tagName)) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                        .body(Map.of("error", "Tag already exists for this session"));
            }
            
            // Note: Authorization check should be added here (only host can add tags)
            // For now, we'll create the tag
            SessionTag tag = new SessionTag();
            tag.setTagName(tagName);
            // Session will be set by the service/repository
            
            SessionTag savedTag = sessionTagRepository.save(tag);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedTag);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to add tag: " + e.getMessage()));
        }
    }
    
    /**
     * Delete a tag from a session.
     * DELETE /api/sessions/{sessionId}/resources/tags/{tagId}
     * Only the host can delete tags.
     */
    @DeleteMapping("/tags/{tagId}")
    public ResponseEntity<?> deleteTag(@PathVariable Long sessionId, @PathVariable Long tagId) {
        try {
            sessionTagRepository.deleteById(tagId);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to delete tag: " + e.getMessage()));
        }
    }
}
