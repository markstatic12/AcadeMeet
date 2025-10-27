package com.appdev.academeet.service;

import com.appdev.academeet.model.Note;
import com.appdev.academeet.model.Session;
import com.appdev.academeet.repository.NoteRepository;
import com.appdev.academeet.repository.SessionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class NoteService {
    
    @Autowired
    private NoteRepository noteRepository;
    
    @Autowired
    private SessionRepository sessionRepository;
    
    // Create
    public Note createNote(Note note) {
        // Validate session exists
        if (note.getSession() != null && note.getSession().getSessionId() != null) {
            Session session = sessionRepository.findById(note.getSession().getSessionId())
                .orElseThrow(() -> new RuntimeException("Session not found with id: " + note.getSession().getSessionId()));
            note.setSession(session);
        }
        
        return noteRepository.save(note);
    }
    
    // Read
    public List<Note> getAllNotes() {
        return noteRepository.findAll();
    }
    
    public Optional<Note> getNoteById(Integer id) {
        return noteRepository.findById(id);
    }
    
    public List<Note> getNotesBySession(Session session) {
        return noteRepository.findBySession(session);
    }
    
    public List<Note> getNotesBySessionId(Integer sessionId) {
        return noteRepository.findBySessionIdOrderByUploadedDateDesc(sessionId);
    }
    
    public List<Note> searchNotesByTitle(String title) {
        return noteRepository.findByTitleContainingIgnoreCase(title);
    }
    
    public List<Note> getNotesByFileType(String fileType) {
        return noteRepository.findByFileType(fileType);
    }
    
    public List<Note> getPromotedNotes() {
        return noteRepository.findPromotedNotes();
    }
    
    public List<Note> getNotesByPromotionStatus(Boolean hasPromotion) {
        return noteRepository.findByHasPromotion(hasPromotion);
    }
    
    // Update
    public Note updateNote(Integer id, Note noteDetails) {
        Note note = noteRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Note not found with id: " + id));
        
        note.setTitle(noteDetails.getTitle());
        note.setContent(noteDetails.getContent());
        note.setFileType(noteDetails.getFileType());
        note.setUploadedDate(noteDetails.getUploadedDate());
        note.setHasPromotion(noteDetails.getHasPromotion());
        
        // Update session if provided
        if (noteDetails.getSession() != null && noteDetails.getSession().getSessionId() != null) {
            Session session = sessionRepository.findById(noteDetails.getSession().getSessionId())
                .orElseThrow(() -> new RuntimeException("Session not found with id: " + noteDetails.getSession().getSessionId()));
            note.setSession(session);
        }
        
        return noteRepository.save(note);
    }
    
    // Delete
    public void deleteNote(Integer id) {
        Note note = noteRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Note not found with id: " + id));
        noteRepository.delete(note);
    }
    
    // Promote/Unpromote note
    public Note promoteNote(Integer id) {
        Note note = noteRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Note not found with id: " + id));
        note.setHasPromotion(true);
        return noteRepository.save(note);
    }
    
    public Note unpromoteNote(Integer id) {
        Note note = noteRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Note not found with id: " + id));
        note.setHasPromotion(false);
        return noteRepository.save(note);
    }
    
    // Delete all notes by session
    public void deleteNotesBySessionId(Integer sessionId) {
        List<Note> notes = noteRepository.findBySessionSessionId(sessionId);
        noteRepository.deleteAll(notes);
    }
}
