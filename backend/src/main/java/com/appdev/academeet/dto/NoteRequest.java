package com.appdev.academeet.dto;

import java.util.List;

import com.appdev.academeet.model.Note;

public class NoteRequest {
    
    private String title;
    private Note.NoteType type;
    private String filePath;
    private String content;  
    private List<Long> tagIds; 
    private List<Long> sessionIds;
    private String notePreviewImageUrl;
    
    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public Note.NoteType getType() {
        return type;
    }

    public void setType(Note.NoteType type) {
        this.type = type;
    }

    public String getFilePath() {
        return filePath;
    }

    public void setFilePath(String filePath) {
        this.filePath = filePath;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public List<Long> getTagIds() {
        return tagIds;
    }

    public void setTagIds(List<Long> tagIds) {
        this.tagIds = tagIds;
    }

    public List<Long> getSessionIds() {
        return sessionIds;
    }

    public void setSessionIds(List<Long> sessionIds) {
        this.sessionIds = sessionIds;
    }

    public String getNotePreviewImageUrl() {
        return notePreviewImageUrl;
    }

    public void setNotePreviewImageUrl(String notePreviewImageUrl) {
        this.notePreviewImageUrl = notePreviewImageUrl;
    }
}