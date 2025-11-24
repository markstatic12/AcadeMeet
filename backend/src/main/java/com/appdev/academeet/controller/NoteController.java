package com.appdev.academeet.controller;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.appdev.academeet.dto.NoteRequest;
import com.appdev.academeet.model.Note;
import com.appdev.academeet.model.Note.NoteStatus;
import com.appdev.academeet.service.NoteService;

@RestController
@RequestMapping("/api/notes")
public class NoteController {

    @Autowired
    private NoteService noteService;

    // Get user ID from request header
    private Long getCurrentUserId(org.springframework.web.context.request.WebRequest request) {
        String userIdHeader = request.getHeader("X-User-Id");
        if (userIdHeader != null) {
            try {
                return Long.parseLong(userIdHeader);
            } catch (NumberFormatException e) {
                throw new RuntimeException("Invalid user ID in header");
            }
        }
        throw new RuntimeException("User ID not provided in request");
    }

    // ----------------------------------------------------------------------------------
    // CRUD Endpoints (Create/Update/Delete - Soft Delete)
    // ----------------------------------------------------------------------------------
    
    @PostMapping
    public ResponseEntity<?> createNote(@RequestBody NoteRequest request, org.springframework.web.context.request.WebRequest webRequest) {
        try {
            Note newNote = noteService.createNote(request, getCurrentUserId(webRequest));
            return ResponseEntity.status(HttpStatus.CREATED).body(newNote);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                 .body(Map.of("error", "Failed to create note: " + e.getMessage()));
        }
    }
    
    @PutMapping("/{noteId}")
    public ResponseEntity<?> updateNote(@PathVariable Long noteId, @RequestBody NoteRequest request, org.springframework.web.context.request.WebRequest webRequest) {
        try {
            Note updatedNote = noteService.updateNote(noteId, getCurrentUserId(webRequest), request);
            return ResponseEntity.ok(updatedNote);
        } catch (Exception e) {
            // Note: This needs the service layer to throw a specific message on not found
            if (e.getMessage().contains("not found")) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", e.getMessage()));
            }
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                 .body(Map.of("error", "Failed to update note: " + e.getMessage()));
        }
    }

    @DeleteMapping("/{noteId}")
    public ResponseEntity<?> trashNote(@PathVariable Long noteId, org.springframework.web.context.request.WebRequest webRequest) {
        try {
            noteService.setNoteStatus(noteId, getCurrentUserId(webRequest), NoteStatus.TRASH);
            return ResponseEntity.ok().build(); 
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", e.getMessage()));
        }
    }
    
    // ----------------------------------------------------------------------------------
    // Lifecycle Operations
    // ----------------------------------------------------------------------------------
    
    @PutMapping("/{noteId}/archive")
    public ResponseEntity<?> archiveNote(@PathVariable Long noteId, org.springframework.web.context.request.WebRequest webRequest) {
        try {
            noteService.setNoteStatus(noteId, getCurrentUserId(webRequest), NoteStatus.ARCHIVED);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", e.getMessage()));
        }
    }
    
    @PutMapping("/{noteId}/unarchive")
    public ResponseEntity<?> unarchiveNote(@PathVariable Long noteId, org.springframework.web.context.request.WebRequest webRequest) {
        try {
            noteService.setNoteStatus(noteId, getCurrentUserId(webRequest), NoteStatus.ACTIVE);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", e.getMessage()));
        }
    }
    
    // ----------------------------------------------------------------------------------
    // Retrieval Endpoints
    // ----------------------------------------------------------------------------------

    @GetMapping("/active")
    public ResponseEntity<List<Note>> getActiveNotes(org.springframework.web.context.request.WebRequest webRequest) {
        List<Note> notes = noteService.getUserNotes(getCurrentUserId(webRequest), NoteStatus.ACTIVE);
        return ResponseEntity.ok(notes);
    }

    @GetMapping("/all/active")
    public ResponseEntity<List<Note>> getAllActiveNotes() {
        // Get active notes from all users (excludes TRASH)
        List<Note> notes = noteService.getGlobalNotes(NoteStatus.TRASH);
        return ResponseEntity.ok(notes);
    }

    @GetMapping("/user/{userId}/active")
    public ResponseEntity<List<Note>> getUserActiveNotes(@PathVariable Long userId) {
        // Get active notes for a specific user
        List<Note> notes = noteService.getUserNotes(userId, NoteStatus.ACTIVE);
        return ResponseEntity.ok(notes);
    }

    @GetMapping("/archive")
    public ResponseEntity<List<Note>> getArchivedNotes(org.springframework.web.context.request.WebRequest webRequest) {
        List<Note> notes = noteService.getUserNotes(getCurrentUserId(webRequest), NoteStatus.ARCHIVED);
        return ResponseEntity.ok(notes);
    }
    
    @GetMapping("/trash")
    public ResponseEntity<List<Note>> getTrashNotes(org.springframework.web.context.request.WebRequest webRequest) {
        List<Note> notes = noteService.getUserNotes(getCurrentUserId(webRequest), NoteStatus.TRASH);
        return ResponseEntity.ok(notes);
    }
    
    @GetMapping("/saved")
    public ResponseEntity<List<Note>> getSavedNotes(org.springframework.web.context.request.WebRequest webRequest) {
        List<Note> notes = noteService.getSavedNotes(getCurrentUserId(webRequest));
        return ResponseEntity.ok(notes);
    }

    @GetMapping("/saved/from-others")
    public ResponseEntity<List<Note>> getSavedNotesFromOthers(org.springframework.web.context.request.WebRequest webRequest) {
        // Get notes saved/favorited by user from other users only
        List<Note> notes = noteService.getSavedNotesFromOtherUsers(getCurrentUserId(webRequest));
        return ResponseEntity.ok(notes);
    }

    // ----------------------------------------------------------------------------------
    // Search & Filter Endpoints
    // ----------------------------------------------------------------------------------

    @GetMapping("/search/by-date")
    public ResponseEntity<List<Note>> searchNotesByDate(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime end,
            @RequestParam(required = false) Long userId,
            org.springframework.web.context.request.WebRequest webRequest) {
        // If userId not provided, use current user; if userId=-1, search globally
        Long searchUserId = (userId != null && userId == -1) ? null : 
                           (userId != null ? userId : getCurrentUserId(webRequest));
        List<Note> notes = noteService.getNotesByDateRange(searchUserId, start, end);
        return ResponseEntity.ok(notes);
    }

    @GetMapping("/search/by-tags")
    public ResponseEntity<List<Note>> searchNotesByTags(
            @RequestParam List<Long> tagIds,
            @RequestParam(required = false) Long userId,
            org.springframework.web.context.request.WebRequest webRequest) {
        // If userId not provided, use current user; if userId=-1, search globally
        Long searchUserId = (userId != null && userId == -1) ? null : 
                           (userId != null ? userId : getCurrentUserId(webRequest));
        List<Note> notes = noteService.getNotesByTags(searchUserId, tagIds, NoteStatus.TRASH);
        return ResponseEntity.ok(notes);
    }

    @GetMapping("/search/by-type")
    public ResponseEntity<List<Note>> searchNotesByType(
            @RequestParam Note.NoteType type,
            @RequestParam(required = false) Long userId,
            org.springframework.web.context.request.WebRequest webRequest) {
        // If userId not provided, use current user; if userId=-1, search globally
        Long searchUserId = (userId != null && userId == -1) ? null : 
                           (userId != null ? userId : getCurrentUserId(webRequest));
        List<Note> notes = noteService.getNotesByType(searchUserId, type, NoteStatus.TRASH);
        return ResponseEntity.ok(notes);
    }

    // ----------------------------------------------------------------------------------
    // Saved Notes Actions
    // ----------------------------------------------------------------------------------
    
    @PostMapping("/{noteId}/save")
    public ResponseEntity<?> saveNote(@PathVariable Long noteId, org.springframework.web.context.request.WebRequest webRequest) {
        try {
            noteService.saveNote(noteId, getCurrentUserId(webRequest));
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", e.getMessage()));
        }
    }
    
    @DeleteMapping("/{noteId}/unsave")
    public ResponseEntity<?> unsaveNote(@PathVariable Long noteId, org.springframework.web.context.request.WebRequest webRequest) {
        try {
            noteService.unsaveNote(noteId, getCurrentUserId(webRequest));
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", e.getMessage()));
        }
    }

    // ----------------------------------------------------------------------------------
    // File Upload Endpoint
    // ----------------------------------------------------------------------------------
    
    @PostMapping("/upload")
    public ResponseEntity<?> uploadFile(
            @org.springframework.web.bind.annotation.RequestParam("file") org.springframework.web.multipart.MultipartFile file,
            @org.springframework.web.bind.annotation.RequestParam(value = "title", required = false) String title,
            @org.springframework.web.bind.annotation.RequestParam(value = "tagIds", required = false) List<Long> tagIds,
            org.springframework.web.context.request.WebRequest webRequest) {
        
        try {
            if (file.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "File is empty"));
            }

            Long userId = getCurrentUserId(webRequest);
            
            // Use absolute path from user.dir (project root)
            String projectRoot = System.getProperty("user.dir");
            String uploadDirRelative = "uploads/notes/";
            java.nio.file.Path uploadPath = java.nio.file.Paths.get(projectRoot, uploadDirRelative);
            
            // Create uploads directory if it doesn't exist
            if (!java.nio.file.Files.exists(uploadPath)) {
                java.nio.file.Files.createDirectories(uploadPath);
            }
            
            // Generate unique filename
            String originalFilename = file.getOriginalFilename();
            String extension = "";
            if (originalFilename != null && originalFilename.contains(".")) {
                extension = originalFilename.substring(originalFilename.lastIndexOf("."));
            }
            String filename = java.util.UUID.randomUUID().toString() + extension;
            java.nio.file.Path filePath = uploadPath.resolve(filename);
            
            // Save file to disk
            file.transferTo(filePath.toFile());
            
            // Create note with file reference
            String noteTitle = (title != null && !title.trim().isEmpty()) ? title : originalFilename;
            String filePathStr = uploadDirRelative + filename;
            
            Note createdNote = noteService.uploadFileNote(
                noteTitle,
                filePathStr,
                null, // preview image URL - can be generated later
                userId,
                tagIds
            );
            
            return ResponseEntity.status(HttpStatus.CREATED).body(createdNote);
            
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                 .body(Map.of("error", "Failed to upload file: " + e.getMessage()));
        }
    }
}