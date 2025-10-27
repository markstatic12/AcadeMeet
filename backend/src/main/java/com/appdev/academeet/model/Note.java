package com.appdev.academeet.model;

import jakarta.persistence.*;

@Entity
@Table(name = "notes")
public class Note {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "note_id")
    private Integer noteId;

    @Column(length = 2000)
    private String content;

    @Column
    private String title;

    @Column(name = "file_type")
    private String fileType;

    @Column(name = "upload_date")
    private java.time.LocalDate uploadDate;

    @Column(name = "has_pomodoro")
    private Boolean hasPomodoro;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "session_id")
    private Session session;

    public Note() {}

    public Note(Integer noteId, String content) {
        this.noteId = noteId;
        this.content = content;
    }

    public void startPomodoro(int duration) {
        // placeholder implementation
    }
    public void stopPomodoro() {
        // placeholder implementation
    }

    public Integer getNoteId() { return noteId; }
    public void setNoteId(Integer noteId) { this.noteId = noteId; }
    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
    public Session getSession() { return session; }
    public void setSession(Session session) { this.session = session; }
}
