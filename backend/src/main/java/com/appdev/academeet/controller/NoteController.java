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

    // --- Placeholder for current authenticated user ---
    private Long getCurrentUserId() {
        // TODO: Replace with logic to retrieve User ID from JWT/Security Context
        return 1L; 
    }

    // ----------------------------------------------------------------------------------
    // CRUD Endpoints (Create/Update/Delete - Soft Delete)
    // ----------------------------------------------------------------------------------
    
    @PostMapping
    public ResponseEntity<?> createNote(@RequestBody NoteRequest request) {
        try {
            Note newNote = noteService.createNote(request, getCurrentUserId());
            return ResponseEntity.status(HttpStatus.CREATED).body(newNote);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                 .body(Map.of("error", "Failed to create note: " + e.getMessage()));
        }
    }
    
    @PutMapping("/{noteId}")
    public ResponseEntity<?> updateNote(@PathVariable Long noteId, @RequestBody NoteRequest request) {
        try {
            Note updatedNote = noteService.updateNote(noteId, getCurrentUserId(), request);
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
    public ResponseEntity<?> trashNote(@PathVariable Long noteId) {
        try {
            noteService.setNoteStatus(noteId, getCurrentUserId(), NoteStatus.TRASH);
            return ResponseEntity.ok().build(); 
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", e.getMessage()));
        }
    }
    
    // ----------------------------------------------------------------------------------
    // Lifecycle Operations
    // ----------------------------------------------------------------------------------
    
    @PutMapping("/{noteId}/archive")
    public ResponseEntity<?> archiveNote(@PathVariable Long noteId) {
        try {
            noteService.setNoteStatus(noteId, getCurrentUserId(), NoteStatus.ARCHIVED);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", e.getMessage()));
        }
    }
    
    @PutMapping("/{noteId}/unarchive")
    public ResponseEntity<?> unarchiveNote(@PathVariable Long noteId) {
        try {
            noteService.setNoteStatus(noteId, getCurrentUserId(), NoteStatus.ACTIVE);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", e.getMessage()));
        }
    }
    
    // ----------------------------------------------------------------------------------
    // Retrieval Endpoints
    // ----------------------------------------------------------------------------------

    @GetMapping("/active")
    public ResponseEntity<List<Note>> getActiveNotes() {
        List<Note> notes = noteService.getNotesByStatus(getCurrentUserId(), NoteStatus.ACTIVE);
        return ResponseEntity.ok(notes);
    }

    @GetMapping("/archive")
    public ResponseEntity<List<Note>> getArchivedNotes() {
        List<Note> notes = noteService.getNotesByStatus(getCurrentUserId(), NoteStatus.ARCHIVED);
        return ResponseEntity.ok(notes);
    }
    
    @GetMapping("/trash")
    public ResponseEntity<List<Note>> getTrashNotes() {
        List<Note> notes = noteService.getNotesByStatus(getCurrentUserId(), NoteStatus.TRASH);
        return ResponseEntity.ok(notes);
    }
    
    @GetMapping("/saved")
    public ResponseEntity<List<Note>> getSavedNotes() {
        // No try/catch needed here as the service doesn't throw on empty results
        List<Note> notes = noteService.getSavedNotes(getCurrentUserId());
        return ResponseEntity.ok(notes);
    }

    // Public feed: notes across all users (only active notes)
    @GetMapping("/public")
    public ResponseEntity<List<Note>> getPublicNotes() {
        List<Note> notes = noteService.getPublicNotes();
        return ResponseEntity.ok(notes);
    }

    // ----------------------------------------------------------------------------------
    // Saved Notes Actions
    // ----------------------------------------------------------------------------------
    
    @PostMapping("/{noteId}/save")
    public ResponseEntity<?> saveNote(@PathVariable Long noteId) {
        try {
            noteService.saveNote(noteId, getCurrentUserId());
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", e.getMessage()));
        }
    }
    
    @DeleteMapping("/{noteId}/unsave")
    public ResponseEntity<?> unsaveNote(@PathVariable Long noteId) {
        try {
            noteService.unsaveNote(noteId, getCurrentUserId());
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", e.getMessage()));
        }
    }
}