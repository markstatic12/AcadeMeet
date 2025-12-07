package com.appdev.academeet.controller;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.appdev.academeet.model.Session;
import com.appdev.academeet.model.SessionNote;
import com.appdev.academeet.model.User;
import com.appdev.academeet.repository.SessionNoteRepository;
import com.appdev.academeet.repository.SessionRepository;
import com.appdev.academeet.repository.UserRepository;
import com.appdev.academeet.service.SessionNoteService;

@RestController
@RequestMapping("/api/notes")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174"})
public class SessionNoteController {

    private final UserRepository userRepository;
    private final SessionRepository sessionRepository;
    private final SessionNoteRepository sessionNoteRepository;
    private final SessionNoteService sessionNoteService;

    @Autowired
    public SessionNoteController(
            UserRepository userRepository, 
            SessionRepository sessionRepository,
            SessionNoteRepository sessionNoteRepository,
            SessionNoteService sessionNoteService) {
        this.userRepository = userRepository;
        this.sessionRepository = sessionRepository;
        this.sessionNoteRepository = sessionNoteRepository;
        this.sessionNoteService = sessionNoteService;
    }

    /**
     * Get all notes for the authenticated user (from all their hosted sessions).
     * Secured endpoint using /me pattern - no user ID in URL.
     * Returns list of note objects with filepath and metadata.
     */
    @GetMapping("/me/active")
    public ResponseEntity<?> getMyNotes() {
        try {
            User authenticatedUser = getAuthenticatedUser();

            // Get all sessions hosted by the authenticated user
            List<Session> userSessions = sessionRepository.findByHost(authenticatedUser);

            // Collect all notes from all user's sessions
            List<Map<String, Object>> allNotes = userSessions.stream()
                    .flatMap(session -> session.getSessionNotes().stream()
                            .map(sessionNote -> buildNoteResponse(sessionNote, session)))
                    .collect(Collectors.toList());

            return ResponseEntity.ok(allNotes);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Failed to fetch user notes: " + e.getMessage()));
        }
    }

    /**
     * Get notes for a specific session.
     * Returns list of note objects with filepath and metadata.
     */
    @GetMapping("/session/{sessionId}")
    public ResponseEntity<?> getSessionNotes(@PathVariable Long sessionId) {
        try {
            User authenticatedUser = getAuthenticatedUser();
            
            // Use service layer for authorization and business logic
            List<SessionNote> notes = sessionNoteService.getNotesForSession(sessionId, authenticatedUser.getId());
            
            Optional<Session> sessionOpt = sessionRepository.findById(sessionId);
            if (sessionOpt.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Session not found"));
            }
            
            Session session = sessionOpt.get();
            
            // Build response with metadata
            List<Map<String, Object>> response = notes.stream()
                    .map(note -> buildNoteResponse(note, session))
                    .collect(Collectors.toList());

            return ResponseEntity.ok(response);
        } catch (SecurityException e) {
            return ResponseEntity.status(403)
                    .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Failed to fetch session notes: " + e.getMessage()));
        }
    }

    /**
     * Upload a file note and link it to a session.
     * Uses SessionNoteService for business logic and validation.
     * Frontend sends: file, title (optional), sessionId
     */
    @PostMapping("/upload")
    public ResponseEntity<?> uploadFileNote(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "title", required = false) String title,
            @RequestParam(value = "sessionId", required = false) Long sessionId) {
        
        try {
            User authenticatedUser = getAuthenticatedUser();
            
            // Validate file
            if (file.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "File is empty"));
            }

            // sessionId is required for upload
            if (sessionId == null) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Session ID is required for note upload"));
            }

            // Create uploads directory if it doesn't exist
            Path uploadPath = Paths.get("uploads/notes");
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            // Generate unique filename
            String originalFilename = file.getOriginalFilename();
            String fileExtension = "";
            if (originalFilename != null && originalFilename.contains(".")) {
                fileExtension = originalFilename.substring(originalFilename.lastIndexOf("."));
            }
            String uniqueFilename = UUID.randomUUID().toString() + fileExtension;
            Path filePath = uploadPath.resolve(uniqueFilename);

            // Save file to disk
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            // Generate relative path for storage
            String relativePath = "/uploads/notes/" + uniqueFilename;

            try {
                // Use service layer to add note (includes authorization and business rule checks)
                SessionNote sessionNote = sessionNoteService.addNote(
                        sessionId, 
                        relativePath, 
                        authenticatedUser.getId()
                );

                // Build response
                Map<String, Object> response = new HashMap<>();
                response.put("noteId", sessionNote.getNoteId());
                response.put("title", title != null ? title : originalFilename);
                response.put("filepath", sessionNote.getFilepath());
                response.put("linkedAt", sessionNote.getLinkedAt() != null 
                        ? sessionNote.getLinkedAt().toString() : null);
                response.put("sessionId", sessionId);
                response.put("message", "File uploaded successfully");

                return ResponseEntity.ok(response);
                
            } catch (IllegalStateException | SecurityException e) {
                // Clean up uploaded file if business rules fail
                Files.deleteIfExists(filePath);
                return ResponseEntity.status(403)
                        .body(Map.of("error", e.getMessage()));
            } catch (RuntimeException e) {
                // Clean up uploaded file if session not found
                Files.deleteIfExists(filePath);
                return ResponseEntity.badRequest()
                        .body(Map.of("error", e.getMessage()));
            }

        } catch (IOException e) {
            return ResponseEntity.status(500)
                    .body(Map.of("error", "Failed to upload file: " + e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Delete a note.
     * Uses SessionNoteService for authorization.
     */
    @DeleteMapping("/{noteId}")
    public ResponseEntity<?> deleteNote(@PathVariable String noteId) {
        try {
            User authenticatedUser = getAuthenticatedUser();
            
            // Use service layer for authorization
            sessionNoteService.deleteNote(noteId, authenticatedUser.getId());
            
            return ResponseEntity.ok(Map.of("message", "Note deleted successfully"));
        } catch (SecurityException e) {
            return ResponseEntity.status(403)
                    .body(Map.of("error", e.getMessage()));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Get note count for a session.
     */
    @GetMapping("/session/{sessionId}/count")
    public ResponseEntity<?> getNoteCount(@PathVariable Long sessionId) {
        try {
            long count = sessionNoteService.getNoteCount(sessionId);
            return ResponseEntity.ok(Map.of("count", count));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Failed to get note count: " + e.getMessage()));
        }
    }

    /**
     * Helper method to build note response map with session information.
     */
    private Map<String, Object> buildNoteResponse(SessionNote sessionNote, Session session) {
        Map<String, Object> noteData = new HashMap<>();
        noteData.put("noteId", sessionNote.getNoteId());
        noteData.put("filepath", sessionNote.getFilepath());
        noteData.put("title", extractFilename(sessionNote.getFilepath()));
        noteData.put("linkedAt", sessionNote.getLinkedAt() != null 
                ? sessionNote.getLinkedAt().toString() : null);
        noteData.put("createdAt", sessionNote.getLinkedAt() != null 
                ? sessionNote.getLinkedAt().toString() : null);
        // Include session info
        noteData.put("sessionId", session.getId());
        noteData.put("sessionTitle", session.getTitle());
        return noteData;
    }

    /**
     * Extract filename from filepath.
     */
    private String extractFilename(String filepath) {
        if (filepath == null) return "Unknown";
        int lastSlash = filepath.lastIndexOf('/');
        return lastSlash >= 0 ? filepath.substring(lastSlash + 1) : filepath;
    }

    /**
     * Get authenticated user from security context.
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
}
