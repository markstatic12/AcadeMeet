package com.appdev.academeet.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.appdev.academeet.model.Session;
import com.appdev.academeet.model.SessionNote;
import com.appdev.academeet.repository.SessionNoteRepository;
import com.appdev.academeet.repository.SessionRepository;

/**
 * Service for managing session notes (file attachments).
 * Enforces the critical business rule: maximum of 3 notes per session.
 */
@Service
public class SessionNoteService {

    private static final int MAX_NOTES_PER_SESSION = 3;

    @Autowired
    private SessionNoteRepository sessionNoteRepository;
    
    @Autowired
    private SessionRepository sessionRepository;
    
    @Autowired
    private SessionParticipantService sessionParticipantService;

    /**
     * Add a note to a session.
     * 
     * Business Rules:
     * 1. Maximum of 3 notes per session
     * 2. Only the host or a participant can add notes
     * 
     * @param sessionId The session ID
     * @param filepath The file path of the note
     * @param userId The user attempting to add the note (for authorization)
     * @return The created SessionNote
     */
    @Transactional
    public SessionNote addNote(Long sessionId, String filepath, Long userId) {
        // Find the session
        Session session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new RuntimeException("Session not found with id: " + sessionId));
        
        // Business Rule 1: Check note limit
        long currentNoteCount = sessionNoteRepository.countBySession_SessionId(sessionId);
        if (currentNoteCount >= MAX_NOTES_PER_SESSION) {
            throw new IllegalStateException("Cannot add more than " + MAX_NOTES_PER_SESSION + " notes to a session");
        }
        
        // Business Rule 2: Authorization check
        boolean isHost = session.getHost().getId().equals(userId);
        boolean isParticipant = sessionParticipantService.isParticipant(sessionId, userId);
        
        if (!isHost && !isParticipant) {
            throw new SecurityException("Only the host or participants can add notes to this session");
        }
        
        // Validation: filepath cannot be empty
        if (filepath == null || filepath.trim().isEmpty()) {
            throw new IllegalArgumentException("Filepath cannot be empty");
        }
        
        // Create and save the note
        SessionNote note = new SessionNote();
        note.setSession(session);
        note.setFilepath(filepath);
        
        return sessionNoteRepository.save(note);
    }

    /**
     * Get all notes for a specific session.
     * 
     * @param sessionId The session ID
     * @param userId The user requesting the notes (for authorization)
     * @return List of notes
     */
    @Transactional(readOnly = true)
    public List<SessionNote> getNotesForSession(Long sessionId, Long userId) {
        // Find the session
        Session session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new RuntimeException("Session not found with id: " + sessionId));
        
        // Authorization check: only host, participants, or public sessions
        boolean isHost = session.getHost().getId().equals(userId);
        boolean isParticipant = sessionParticipantService.isParticipant(sessionId, userId);
        
        if (!isHost && !isParticipant) {
            throw new SecurityException("Only the host or participants can view notes for this session");
        }
        
        return sessionNoteRepository.findBySession_SessionId(sessionId);
    }

    /**
     * Delete a note from a session.
     * Only the host can delete notes.
     * 
     * @param noteId The note ID
     * @param userId The user attempting to delete (must be host)
     */
    @Transactional
    public void deleteNote(String noteId, Long userId) {
        SessionNote note = sessionNoteRepository.findById(noteId)
                .orElseThrow(() -> new RuntimeException("Note not found with id: " + noteId));
        
        Session session = note.getSession();
        
        // Authorization: Only host can delete notes
        if (!session.getHost().getId().equals(userId)) {
            throw new SecurityException("Only the session host can delete notes");
        }
        
        sessionNoteRepository.delete(note);
    }

    /**
     * Get the count of notes for a session.
     */
    public long getNoteCount(Long sessionId) {
        return sessionNoteRepository.countBySession_SessionId(sessionId);
    }

    /**
     * Delete all notes for a session (used when deleting a session).
     */
    @Transactional
    public void deleteAllNotesForSession(Long sessionId) {
        sessionNoteRepository.deleteBySession_SessionId(sessionId);
    }
}
