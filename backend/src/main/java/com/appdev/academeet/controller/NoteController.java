package com.appdev.academeet.controller;

import com.appdev.academeet.model.Note;
import com.appdev.academeet.service.NoteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/notes")
@CrossOrigin(origins = "http://localhost:5173")
public class NoteController {
    
    @Autowired
    private NoteService noteService;
    
    // Create note
    @PostMapping
    public ResponseEntity<?> createNote(@RequestBody Note note) {
        try {
            Note createdNote = noteService.createNote(note);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdNote);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    // Get all notes
    @GetMapping
    public ResponseEntity<List<Note>> getAllNotes() {
        List<Note> notes = noteService.getAllNotes();
        return ResponseEntity.ok(notes);
    }
    
    // Get by ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getNoteById(@PathVariable Integer id) {
        Optional<Note> note = noteService.getNoteById(id);
        if (note.isPresent()) {
            return ResponseEntity.ok(note.get());
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Note not found");
    }
    
    // Get by session ID
    // UPDATED: Parameter is Long
    @GetMapping("/session/{sessionId}")
    public ResponseEntity<List<Note>> getNotesBySessionId(@PathVariable Long sessionId) {
        List<Note> notes = noteService.getNotesBySessionId(sessionId);
        return ResponseEntity.ok(notes);
    }
    
    // Search by title
    @GetMapping("/search")
    public ResponseEntity<List<Note>> searchNotesByTitle(@RequestParam String title) {
        List<Note> notes = noteService.searchNotesByTitle(title);
        return ResponseEntity.ok(notes);
    }
    
    // Get by file type
    @GetMapping("/type/{fileType}")
    public ResponseEntity<List<Note>> getNotesByFileType(@PathVariable String fileType) {
        List<Note> notes = noteService.getNotesByFileType(fileType);
        return ResponseEntity.ok(notes);
    }
    
    // Get promoted notes
    @GetMapping("/promoted")
    public ResponseEntity<List<Note>> getPromotedNotes() {
        List<Note> notes = noteService.getPromotedNotes();
        return ResponseEntity.ok(notes);
    }
    
    // Update note
    @PutMapping("/{id}")
    public ResponseEntity<?> updateNote(@PathVariable Integer id, @RequestBody Note note) {
        try {
            Note updatedNote = noteService.updateNote(id, note);
            return ResponseEntity.ok(updatedNote);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
    
    // Delete note
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteNote(@PathVariable Integer id) {
        try {
            noteService.deleteNote(id);
            return ResponseEntity.ok("Note deleted successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
    
    // Promote note
    @PatchMapping("/{id}/promote")
    public ResponseEntity<?> promoteNote(@PathVariable Integer id) {
        try {
            Note note = noteService.promoteNote(id);
            return ResponseEntity.ok(note);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());.
        }
    }
    
    // Unpromote note
    @PatchMapping("/{id}/unpromote")
    public ResponseEntity<?> unpromoteNote(@PathVariable Integer id) {
        try {
            Note note = noteService.unpromoteNote(id);
            return ResponseEntity.ok(note);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
    
    // Delete all notes by session
    // UPDATED: Parameter is Long
    @DeleteMapping("/session/{sessionId}")
    public ResponseEntity<?> deleteNotesBySessionId(@PathVariable Long sessionId) {
        try {
            noteService.deleteNotesBySessionId(sessionId);
            return ResponseEntity.ok("All notes for session deleted successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}