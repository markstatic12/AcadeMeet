package com.appdev.academeet.dto;

/**
 * DTO for note details with session information
 */
public class NoteDetailsDTO {
    private String noteId;
    private String filepath;
    private String title;
    private String linkedAt;
    private String createdAt;
    private Long sessionId;
    private String sessionTitle;

    public NoteDetailsDTO() {}

    public NoteDetailsDTO(String noteId, String filepath, String title, String linkedAt,
                         String createdAt, Long sessionId, String sessionTitle) {
        this.noteId = noteId;
        this.filepath = filepath;
        this.title = title;
        this.linkedAt = linkedAt;
        this.createdAt = createdAt;
        this.sessionId = sessionId;
        this.sessionTitle = sessionTitle;
    }

    // Getters and Setters
    public String getNoteId() { return noteId; }
    public void setNoteId(String noteId) { this.noteId = noteId; }

    public String getFilepath() { return filepath; }
    public void setFilepath(String filepath) { this.filepath = filepath; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getLinkedAt() { return linkedAt; }
    public void setLinkedAt(String linkedAt) { this.linkedAt = linkedAt; }

    public String getCreatedAt() { return createdAt; }
    public void setCreatedAt(String createdAt) { this.createdAt = createdAt; }

    public Long getSessionId() { return sessionId; }
    public void setSessionId(Long sessionId) { this.sessionId = sessionId; }

    public String getSessionTitle() { return sessionTitle; }
    public void setSessionTitle(String sessionTitle) { this.sessionTitle = sessionTitle; }
}
