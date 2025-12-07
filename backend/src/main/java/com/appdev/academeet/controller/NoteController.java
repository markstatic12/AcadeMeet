package com.appdev.academeet.controller;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.appdev.academeet.model.Session;
import com.appdev.academeet.model.SessionNote;
import com.appdev.academeet.model.User;
import com.appdev.academeet.repository.SessionRepository;
import com.appdev.academeet.repository.UserRepository;

@RestController
@RequestMapping("/api/notes")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174"})
public class NoteController {

    private final UserRepository userRepository;
    private final SessionRepository sessionRepository;

    @Autowired
    public NoteController(UserRepository userRepository, SessionRepository sessionRepository) {
        this.userRepository = userRepository;
        this.sessionRepository = sessionRepository;
    }

    /**
     * Upload a file note and optionally link it to a session.
     * Frontend sends: file, title, sessionId (optional)
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

            // If sessionId provided, link the note to the session
            if (sessionId != null) {
                Optional<Session> sessionOpt = sessionRepository.findById(sessionId);
                if (sessionOpt.isEmpty()) {
                    // Clean up uploaded file if session not found
                    Files.deleteIfExists(filePath);
                    return ResponseEntity.badRequest().body(Map.of("error", "Session not found"));
                }

                Session session = sessionOpt.get();
                
                // Verify user is the session host
                if (!session.getHost().getId().equals(authenticatedUser.getId())) {
                    // Clean up uploaded file if unauthorized
                    Files.deleteIfExists(filePath);
                    return ResponseEntity.status(403)
                            .body(Map.of("error", "Only the session host can upload notes"));
                }

                // Create SessionNote and add to session
                SessionNote sessionNote = new SessionNote(session, relativePath);
                session.getSessionNotes().add(sessionNote);
                sessionRepository.save(session);
            }

            // Return response
            Map<String, Object> response = new HashMap<>();
            response.put("noteId", UUID.randomUUID().toString()); // Generate note ID for frontend
            response.put("title", title != null ? title : originalFilename);
            response.put("filepath", relativePath);
            response.put("message", "File uploaded successfully");

            return ResponseEntity.ok(response);

        } catch (IOException e) {
            return ResponseEntity.status(500)
                    .body(Map.of("error", "Failed to upload file: " + e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        }
    }

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
