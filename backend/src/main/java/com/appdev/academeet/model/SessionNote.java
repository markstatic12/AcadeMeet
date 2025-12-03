package com.appdev.academeet.model;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;

@Entity
@Table(name = "session_note")
public class SessionNote {

    @Id
    @Column(name = "note_id", length = 36, nullable = false)
    private String noteId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "linked_session_id", nullable = false)
    private Session session;

    @Column(name = "filepath", nullable = false, length = 255)
    private String filepath;

    @Column(name = "linked_at")
    private LocalDateTime linkedAt;

    // Lifecycle Methods
    @PrePersist
    protected void onCreate() {
        if (linkedAt == null) {
            linkedAt = LocalDateTime.now();
        }
        if (noteId == null) {
            noteId = java.util.UUID.randomUUID().toString();
        }
    }

    // Constructors
    public SessionNote() {}

    public SessionNote(Session session, String filepath) {
        this.session = session;
        this.filepath = filepath;
    }

    // Getters and Setters
    public String getNoteId() {
        return noteId;
    }

    public void setNoteId(String noteId) {
        this.noteId = noteId;
    }

    public Session getSession() {
        return session;
    }

    public void setSession(Session session) {
        this.session = session;
    }

    public String getFilepath() {
        return filepath;
    }

    public void setFilepath(String filepath) {
        this.filepath = filepath;
    }

    public LocalDateTime getLinkedAt() {
        return linkedAt;
    }

    public void setLinkedAt(LocalDateTime linkedAt) {
        this.linkedAt = linkedAt;
    }

    @Override
    public String toString() {
        return "SessionNote{" +
                "noteId='" + noteId + '\'' +
                ", sessionId=" + (session != null ? session.getId() : null) +
                ", filepath='" + filepath + '\'' +
                ", linkedAt=" + linkedAt +
                '}';
    }
}
