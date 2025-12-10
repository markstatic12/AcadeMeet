package com.appdev.academeet.dto;

public class NoteDetailsDTO {
    private final String noteId;
    private final String filepath;
    private final String title;
    private final String linkedAt;
    private final String createdAt;
    private final Long sessionId;
    private final String sessionTitle;

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

    // Getters only 
    public String getNoteId() { return noteId; }
    public String getFilepath() { return filepath; }
    public String getTitle() { return title; }
    public String getLinkedAt() { return linkedAt; }
    public String getCreatedAt() { return createdAt; }
    public Long getSessionId() { return sessionId; }
    public String getSessionTitle() { return sessionTitle; }
}
