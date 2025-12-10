package com.appdev.academeet.dto;

public class NoteUploadResponse {
    private final String noteId;
    private final String title;
    private final String filepath;
    private final String linkedAt;
    private final Long sessionId;
    private final String message;

    public NoteUploadResponse(String noteId, String title, String filepath, String linkedAt, 
                             Long sessionId, String message) {
        this.noteId = noteId;
        this.title = title;
        this.filepath = filepath;
        this.linkedAt = linkedAt;
        this.sessionId = sessionId;
        this.message = message;
    }

    // Getters only 
    public String getNoteId() { return noteId; }
    public String getTitle() { return title; }
    public String getFilepath() { return filepath; }
    public String getLinkedAt() { return linkedAt; }
    public Long getSessionId() { return sessionId; }
    public String getMessage() { return message; }
}
