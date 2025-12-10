package com.appdev.academeet.dto;

/**
 * DTO for note upload response
 */
public class NoteUploadResponse {
    private String noteId;
    private String title;
    private String filepath;
    private String linkedAt;
    private Long sessionId;
    private String message;

    public NoteUploadResponse() {}

    public NoteUploadResponse(String noteId, String title, String filepath, String linkedAt, 
                             Long sessionId, String message) {
        this.noteId = noteId;
        this.title = title;
        this.filepath = filepath;
        this.linkedAt = linkedAt;
        this.sessionId = sessionId;
        this.message = message;
    }

    // Getters and Setters
    public String getNoteId() { return noteId; }
    public void setNoteId(String noteId) { this.noteId = noteId; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getFilepath() { return filepath; }
    public void setFilepath(String filepath) { this.filepath = filepath; }

    public String getLinkedAt() { return linkedAt; }
    public void setLinkedAt(String linkedAt) { this.linkedAt = linkedAt; }

    public Long getSessionId() { return sessionId; }
    public void setSessionId(Long sessionId) { this.sessionId = sessionId; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
}
