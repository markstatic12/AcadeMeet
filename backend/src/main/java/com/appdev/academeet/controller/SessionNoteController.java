package com.appdev.academeet.controller;

import java.io.IOException;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.appdev.academeet.dto.NoteDetailsDTO;
import com.appdev.academeet.dto.NoteUploadResponse;
import com.appdev.academeet.model.User;
import com.appdev.academeet.service.SessionNoteService;

@RestController
@RequestMapping("/api/notes")
public class SessionNoteController extends BaseController {

    private final SessionNoteService sessionNoteService;

    @Autowired
    public SessionNoteController(SessionNoteService sessionNoteService) {
        this.sessionNoteService = sessionNoteService;
    }

    /**
     * Get all notes for the authenticated user (from all their hosted sessions).
     */
    @GetMapping("/me/active")
    public ResponseEntity<List<NoteDetailsDTO>> getMyNotes() {
        User authenticatedUser = getAuthenticatedUser();
        List<NoteDetailsDTO> allNotes = sessionNoteService.getAllNotesForUser(authenticatedUser.getId());
        return ResponseEntity.ok(allNotes);
    }

    /**
     * Get notes for a specific session.
     */
    @GetMapping("/session/{sessionId}")
    public ResponseEntity<List<NoteDetailsDTO>> getSessionNotes(@PathVariable Long sessionId) {
        User authenticatedUser = getAuthenticatedUser();
        List<NoteDetailsDTO> response = sessionNoteService.getNotesForSessionDTO(sessionId, authenticatedUser.getId());
        return ResponseEntity.ok(response);
    }

    /**
     * Upload a file note and optionally link it to a session.
     */
    @PostMapping("/upload")
    public ResponseEntity<NoteUploadResponse> uploadFileNote(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "title", required = false) String title,
            @RequestParam(value = "sessionId", required = false) Long sessionId) throws IOException {
        
        User authenticatedUser = getAuthenticatedUser();
        String originalFilename = file.getOriginalFilename();
        String effectiveTitle = title != null ? title : originalFilename;

        // If sessionId is provided, link the note to the session
        if (sessionId != null) {
            NoteUploadResponse response = sessionNoteService.addNoteAndGetDTO(
                    sessionId, file, effectiveTitle, authenticatedUser.getId());
            return ResponseEntity.ok(response);
        } else {
            // No sessionId provided - return file info for later linking
            NoteUploadResponse response = sessionNoteService.createUnlinkedDTO(file, effectiveTitle);
            return ResponseEntity.ok(response);
        }
    }

    /**
     * Link an uploaded file to a session.
     */
    @PostMapping("/link")
    public ResponseEntity<NoteUploadResponse> linkNoteToSession(
            @RequestParam("filepath") String filepath,
            @RequestParam("sessionId") Long sessionId) {
        
        User authenticatedUser = getAuthenticatedUser();
        NoteUploadResponse response = sessionNoteService.createLinkDTO(sessionId, filepath, authenticatedUser.getId());
        return ResponseEntity.ok(response);
    }

    /**
     * Delete a note.
     */
    @DeleteMapping("/{noteId}")
    public ResponseEntity<Map<String, String>> deleteNote(@PathVariable String noteId) {
        User authenticatedUser = getAuthenticatedUser();
        sessionNoteService.deleteNote(noteId, authenticatedUser.getId());
        return ResponseEntity.ok(Map.of("message", "Note deleted successfully"));
    }

    /**
     * Get note count for a session.
     */
    @GetMapping("/session/{sessionId}/count")
    public ResponseEntity<Map<String, Long>> getNoteCount(@PathVariable Long sessionId) {
        long count = sessionNoteService.getNoteCount(sessionId);
        return ResponseEntity.ok(Map.of("count", count));
    }
}
