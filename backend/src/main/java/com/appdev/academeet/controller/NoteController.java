package com.appdev.academeet.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
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
        List<Note> notes = noteService.getNotesByStatus(getCurrentUserId(webRequest), NoteStatus.ACTIVE);
        return ResponseEntity.ok(notes);
    }

    @GetMapping("/all/active")
    public ResponseEntity<List<Note>> getAllActiveNotes() {
        // Get active notes from all users for public notes page
        List<Note> notes = noteService.getAllNotesByStatus(NoteStatus.ACTIVE);
        return ResponseEntity.ok(notes);
    }

    @GetMapping("/user/{userId}/active")
    public ResponseEntity<List<Note>> getUserActiveNotes(@PathVariable Long userId) {
        // Get active notes for a specific user
        List<Note> notes = noteService.getNotesByStatus(userId, NoteStatus.ACTIVE);
        return ResponseEntity.ok(notes);
    }

    @GetMapping("/archive")
    public ResponseEntity<List<Note>> getArchivedNotes(org.springframework.web.context.request.WebRequest webRequest) {
        List<Note> notes = noteService.getNotesByStatus(getCurrentUserId(webRequest), NoteStatus.ARCHIVED);
        return ResponseEntity.ok(notes);
    }
    
    @GetMapping("/trash")
    public ResponseEntity<List<Note>> getTrashNotes(org.springframework.web.context.request.WebRequest webRequest) {
        List<Note> notes = noteService.getNotesByStatus(getCurrentUserId(webRequest), NoteStatus.TRASH);
        return ResponseEntity.ok(notes);
    }
    
    @GetMapping("/saved")
    public ResponseEntity<List<Note>> getSavedNotes(org.springframework.web.context.request.WebRequest webRequest) {
        // No try/catch needed here as the service doesn't throw on empty results
        List<Note> notes = noteService.getSavedNotes(getCurrentUserId(webRequest));
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
}