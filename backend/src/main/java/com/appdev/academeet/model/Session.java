package com.appdev.academeet.model;
 
import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
 
@Entity
@Table(name = "sessions")
public class Session {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "session_id")
    private Integer sessionId;
    @Column(name = "time")
    private String time;
    @Column
    private String title;
    @Column(nullable = false)
    private String subject;
    @Column(nullable = false)
    private LocalDateTime schedule;
    @Column(length = 2000)
    private String description;
    @Column(nullable = false)
    private String status = "PENDING";
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "host_id")
    @JsonIgnoreProperties({"hostedSessions", "enrolledSessions"})
    private Host host;
    @OneToMany(mappedBy = "session", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnoreProperties("session")
    private List<File> files = new ArrayList<>();
    @OneToMany(mappedBy = "session", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnoreProperties("session")
    private List<Note> notes = new ArrayList<>();
    @ManyToMany(mappedBy = "enrolledSessions")
    @JsonIgnoreProperties({"enrolledSessions", "password"})
    private List<Participant> participants = new ArrayList<>();
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    // Constructors
    public Session() {
    }
    public Session(Integer sessionId, String time, String subject, LocalDateTime schedule, String description, String status) {
        this.sessionId = sessionId;
        this.time = time;
        this.title = subject;
        this.subject = subject;
        this.schedule = schedule;
        this.description = description;
        this.status = status;
    }
    // Lifecycle callbacks
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
    // Getters and Setters
    public Integer getSessionId() {
        return sessionId;
    }
    public void setSessionId(Integer sessionId) {
        this.sessionId = sessionId;
    }
    public String getTime() {
        return time;
    }
    public void setTime(String time) {
        this.time = time;
    }
    public String getSubject() {
        return subject;
    }
    public void setSubject(String subject) {
        this.subject = subject;
    }
    public LocalDateTime getSchedule() {
        return schedule;
    }
    public void setSchedule(LocalDateTime schedule) {
        this.schedule = schedule;
    }
    public String getDescription() {
        return description;
    }
    public void setDescription(String description) {
        this.description = description;
    }
    public String getStatus() {
        return status;
    }
    public void setStatus(String status) {
        this.status = status;
    }
    public Host getHost() {
        return host;
    }
    public void setHost(Host host) {
        this.host = host;
    }
    public List<File> getFiles() {
        return files;
    }
    public void setFiles(List<File> files) {
        this.files = files;
    }
    public List<Note> getNotes() {
        return notes;
    }
    public void setNotes(List<Note> notes) {
        this.notes = notes;
    }
    public List<Participant> getParticipants() {
        return participants;
    }
    public void setParticipants(List<Participant> participants) {
        this.participants = participants;
    }
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
    // Helper methods
    public void addFile(File file) {
        this.files.add(file);
        file.setSession(this);
    }
    public void removeFile(File file) {
        this.files.remove(file);
        file.setSession(null);
    }
    public void addNote(Note note) {
        this.notes.add(note);
        note.setSession(this);
    }
    public void removeNote(Note note) {
        this.notes.remove(note);
        note.setSession(null);
    }
    public void addParticipant(Participant participant) {
        this.participants.add(participant);
        participant.getEnrolledSessions().add(this);
    }
    public void removeParticipant(Participant participant) {
        this.participants.remove(participant);
        participant.getEnrolledSessions().remove(this);
    }
    public void attachFile(File file) { addFile(file); }
    public void attachNote(Note note) { addNote(note); }
    @Override
    public String toString() {
        return "Session{" +
                "sessionId=" + sessionId +
                ", subject='" + subject + '\'' +
                ", schedule=" + schedule +
                ", status='" + status + '\'' +
                '}';
    }
}