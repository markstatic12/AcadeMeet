package com.appdev.academeet.service;

import java.io.IOException;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.appdev.academeet.dto.NoteDetailsDTO;
import com.appdev.academeet.dto.NoteUploadResponse;
import com.appdev.academeet.model.Session;
import com.appdev.academeet.model.SessionNote;
import com.appdev.academeet.model.User;
import com.appdev.academeet.repository.SessionNoteRepository;
import com.appdev.academeet.repository.SessionRepository;
import com.appdev.academeet.repository.UserRepository;

@Service
public class SessionNoteService {

    private static final int MAX_NOTES_PER_SESSION = 3;

    @Autowired
    private SessionNoteRepository sessionNoteRepository;

    @Autowired
    private SessionRepository sessionRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private com.appdev.academeet.repository.SessionParticipantRepository sessionParticipantRepository;
    
    @Autowired
    private NotificationService notificationService;
    
    @Autowired
    private FileUploadService fileUploadService;

    // ========================================
    // Private Mapping Helper Methods
    // ========================================
    
    /**
     * Maps SessionNote to NoteDetailsDTO with session information.
     */
    private NoteDetailsDTO toDetailsDTO(SessionNote sessionNote, Session session) {
        String linkedAtStr = sessionNote.getLinkedAt() != null ? sessionNote.getLinkedAt().toString() : null;
        String createdAtStr = sessionNote.getLinkedAt() != null ? sessionNote.getLinkedAt().toString() : null;
        String title = fileUploadService.extractFilename(sessionNote.getFilepath());
        
        return new NoteDetailsDTO(
            sessionNote.getNoteId(),
            sessionNote.getFilepath(),
            title,
            linkedAtStr,
            createdAtStr,
            session.getId(),
            session.getTitle()
        );
    }

    /**
     * Maps list of SessionNotes to NoteDetailsDTOs.
     */
    private List<NoteDetailsDTO> toDetailsDTOList(List<SessionNote> notes, Session session) {
        return notes.stream()
            .map(note -> toDetailsDTO(note, session))
            .collect(Collectors.toList());
    }

    /**
     * Creates NoteUploadResponse for linked note.
     */
    private NoteUploadResponse toUploadResponse(SessionNote sessionNote, Long sessionId, String originalFilename) {
        String linkedAtStr = sessionNote.getLinkedAt() != null ? sessionNote.getLinkedAt().toString() : null;
        
        return new NoteUploadResponse(
            sessionNote.getNoteId(),
            originalFilename,
            sessionNote.getFilepath(),
            linkedAtStr,
            sessionId,
            "File uploaded and linked to session successfully"
        );
    }

    /**
     * Creates NoteUploadResponse for unlinked note.
     */
    private NoteUploadResponse toUploadResponseUnlinked(String filepath, String originalFilename) {
        return new NoteUploadResponse(
            UUID.randomUUID().toString(),
            originalFilename,
            filepath,
            null,
            null,
            "File uploaded successfully (not linked to session yet)"
        );
    }

    /**
     * Creates NoteUploadResponse for note linking.
     */
    private NoteUploadResponse toLinkResponse(SessionNote sessionNote, Long sessionId) {
        String linkedAtStr = sessionNote.getLinkedAt() != null ? sessionNote.getLinkedAt().toString() : null;
        
        return new NoteUploadResponse(
            sessionNote.getNoteId(),
            null,
            sessionNote.getFilepath(),
            linkedAtStr,
            sessionId,
            "Note linked to session successfully"
        );
    }

    // ========================================
    // Business Logic Methods
    // ========================================

    /**
     * Add a note to a session.
     * 
     * Business Rules:
     * 1. Maximum of 3 notes per session
     * 2. Only the host can add notes
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
        long currentNoteCount = sessionNoteRepository.countBySession_Id(sessionId);
        if (currentNoteCount >= MAX_NOTES_PER_SESSION) {
            throw new IllegalStateException("Cannot add more than " + MAX_NOTES_PER_SESSION + " notes to a session");
        }

        // Business Rule 2: Authorization check
        boolean isHost = session.getHost().getId().equals(userId);
        //boolean isParticipant = sessionParticipantService.isParticipant(sessionId, userId);

        if (!isHost ) {
            throw new SecurityException("Only the host  can add notes to this session");
        }

        // Validation: filepath cannot be empty
        if (filepath == null || filepath.trim().isEmpty()) {
            throw new IllegalArgumentException("Filepath cannot be empty");
        }

        // Create and save the note
        SessionNote note = new SessionNote();
        note.setSession(session);
        note.setFilepath(filepath);

        SessionNote savedNote = sessionNoteRepository.save(note);
        
        // Notify all participants about new notes
        List<com.appdev.academeet.model.User> participants = sessionParticipantRepository.findBySessionId(sessionId).stream()
                .map(com.appdev.academeet.model.SessionParticipant::getUser)
                .collect(java.util.stream.Collectors.toList());
        notificationService.notifyNotesUploaded(session, participants);
        
        return savedNote;
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

        // Authorization check: only host and participants can view notes
        boolean isHost = session.getHost().getId().equals(userId);
        boolean isParticipant = sessionParticipantRepository.existsBySessionIdAndUserId(sessionId, userId);

        if (!isHost && !isParticipant) {
            throw new SecurityException("Only the host and participants can view notes for this session");
        }

        return sessionNoteRepository.findBySession_Id(sessionId);
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
        return sessionNoteRepository.countBySession_Id(sessionId);
    }

    /**
     * Delete all notes for a session (used when deleting a session).
     */
    @Transactional
    public void deleteAllNotesForSession(Long sessionId) {
        sessionNoteRepository.deleteBySession_Id(sessionId);
    }
    
    // ========================================
    // DTO-Returning Methods for Controllers
    // ========================================
    
    /**
     * Get all notes for a user (from all their hosted sessions).
     */
    @Transactional(readOnly = true)
    public List<NoteDetailsDTO> getAllNotesForUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        List<Session> userSessions = sessionRepository.findByHost(user);

        return userSessions.stream()
                .flatMap(session -> session.getSessionNotes().stream()
                        .map(sessionNote -> toDetailsDTO(sessionNote, session)))
                .collect(Collectors.toList());
    }
    
    /**
     * Get notes for session as DTOs.
     */
    @Transactional(readOnly = true)
    public List<NoteDetailsDTO> getNotesForSessionDTO(Long sessionId, Long userId) {
        List<SessionNote> notes = getNotesForSession(sessionId, userId);
        Session session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new RuntimeException("Session not found"));
        return toDetailsDTOList(notes, session);
    }
    
    /**
     * Add note with file upload and return upload response DTO.
     */
    @Transactional
    public NoteUploadResponse addNoteAndGetDTO(Long sessionId, MultipartFile file, String title, Long userId) throws IOException {
        // Upload file first
        String relativePath = fileUploadService.uploadNoteFile(file);
        
        try {
            SessionNote savedNote = addNote(sessionId, relativePath, userId);
            return toUploadResponse(savedNote, sessionId, title);
        } catch (RuntimeException e) {
            // Clean up uploaded file if business rules fail
            fileUploadService.deleteFile(relativePath);
            throw e;
        }
    }
    
    /**
     * Create unlinked upload response DTO with file upload.
     */
    public NoteUploadResponse createUnlinkedDTO(MultipartFile file, String title) throws IOException {
        String relativePath = fileUploadService.uploadNoteFile(file);
        return toUploadResponseUnlinked(relativePath, title);
    }
    
    /**
     * Create link response DTO.
     */
    @Transactional
    public NoteUploadResponse createLinkDTO(Long sessionId, String filepath, Long userId) {
        SessionNote sessionNote = addNote(sessionId, filepath, userId);
        return toLinkResponse(sessionNote, sessionId);
    }
}