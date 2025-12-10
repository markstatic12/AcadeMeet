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

    private final SessionNoteRepository sessionNoteRepository;
    private final SessionRepository sessionRepository;
    private final UserRepository userRepository;
    private final com.appdev.academeet.repository.SessionParticipantRepository sessionParticipantRepository;
    private final NotificationService notificationService;
    private final FileUploadService fileUploadService;
    
    @Autowired
    public SessionNoteService(SessionNoteRepository sessionNoteRepository,
                             SessionRepository sessionRepository,
                             UserRepository userRepository,
                             com.appdev.academeet.repository.SessionParticipantRepository sessionParticipantRepository,
                             NotificationService notificationService,
                             FileUploadService fileUploadService) {
        this.sessionNoteRepository = sessionNoteRepository;
        this.sessionRepository = sessionRepository;
        this.userRepository = userRepository;
        this.sessionParticipantRepository = sessionParticipantRepository;
        this.notificationService = notificationService;
        this.fileUploadService = fileUploadService;
    }

    
    
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

    @Transactional
    public SessionNote addNote(Long sessionId, String filepath, Long userId) {
        Session session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new RuntimeException("Session not found with id: " + sessionId));

        
        long currentNoteCount = sessionNoteRepository.countBySession_Id(sessionId);
        if (currentNoteCount >= MAX_NOTES_PER_SESSION) {
            throw new IllegalStateException("Cannot add more than " + MAX_NOTES_PER_SESSION + " notes to a session");
        }

        boolean isHost = session.getHost().getId().equals(userId);
        
        if (!isHost ) {
            throw new SecurityException("Only the host  can add notes to this session");
        }

        if (filepath == null || filepath.trim().isEmpty()) {
            throw new IllegalArgumentException("Filepath cannot be empty");
        }

        SessionNote note = new SessionNote();
        note.setSession(session);
        note.setFilepath(filepath);

        SessionNote savedNote = sessionNoteRepository.save(note);
        
        List<com.appdev.academeet.model.User> participants = sessionParticipantRepository.findBySessionId(sessionId).stream()
                .map(com.appdev.academeet.model.SessionParticipant::getUser)
                .collect(java.util.stream.Collectors.toList());
        notificationService.notifyNotesUploaded(session, participants);
        
        return savedNote;
    }

    @Transactional(readOnly = true)
    public List<SessionNote> getNotesForSession(Long sessionId, Long userId) {
        Session session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new RuntimeException("Session not found with id: " + sessionId));

        boolean isHost = session.getHost().getId().equals(userId);
        boolean isParticipant = sessionParticipantRepository.existsBySessionIdAndUserId(sessionId, userId);

        if (!isHost && !isParticipant) {
            throw new SecurityException("Only the host and participants can view notes for this session");
        }

        return sessionNoteRepository.findBySession_Id(sessionId);
    }

    @Transactional
    public void deleteNote(String noteId, Long userId) {
        SessionNote note = sessionNoteRepository.findById(noteId)
                .orElseThrow(() -> new RuntimeException("Note not found with id: " + noteId));

        Session session = note.getSession();

        if (!session.getHost().getId().equals(userId)) {
            throw new SecurityException("Only the session host can delete notes");
        }

        sessionNoteRepository.delete(note);
    }

    public long getNoteCount(Long sessionId) {
        return sessionNoteRepository.countBySession_Id(sessionId);
    }

    @Transactional
    public void deleteAllNotesForSession(Long sessionId) {
        sessionNoteRepository.deleteBySession_Id(sessionId);
    }
    
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
    
    @Transactional(readOnly = true)
    public List<NoteDetailsDTO> getNotesForSessionDTO(Long sessionId, Long userId) {
        List<SessionNote> notes = getNotesForSession(sessionId, userId);
        Session session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new RuntimeException("Session not found"));
        return toDetailsDTOList(notes, session);
    }
    
    @Transactional
    public NoteUploadResponse addNoteAndGetDTO(Long sessionId, MultipartFile file, String title, Long userId) throws IOException {
        String relativePath = fileUploadService.uploadNoteFile(file);
        
        try {
            SessionNote savedNote = addNote(sessionId, relativePath, userId);
            return toUploadResponse(savedNote, sessionId, title);
        } catch (RuntimeException e) {
            fileUploadService.deleteFile(relativePath);
            throw e;
        }
    }
    
    public NoteUploadResponse createUnlinkedDTO(MultipartFile file, String title) throws IOException {
        String relativePath = fileUploadService.uploadNoteFile(file);
        return toUploadResponseUnlinked(relativePath, title);
    }
    
    @Transactional
    public NoteUploadResponse createLinkDTO(Long sessionId, String filepath, Long userId) {
        SessionNote sessionNote = addNote(sessionId, filepath, userId);
        return toLinkResponse(sessionNote, sessionId);
    }
}