package com.appdev.academeet.model;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;

@Entity
@Table(name = "sessions") // All sessions related are Zander Aligato's Work
public class Session {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "session_id")
    private Integer sessionId;
    
    @Column(name = "time")
    private String time;
    
    @Column(nullable = false)
    private String subject;
    
    // Alias for subject - used by services
    public String getTitle() {
        return subject;
    }
    
    public void setTitle(String title) {
        this.subject = title;
    }
    
    @Column(nullable = false)
    private LocalDateTime schedule;
    
    // Alias for schedule - used by services
    public LocalDateTime getStartTime() {
        return schedule;
    }
    
    public void setStartTime(LocalDateTime startTime) {
        this.schedule = startTime;
    }
    
    @Column(length = 2000)
    private String description;
    
    @Column(nullable = false)
    private String status = "PENDING";
    
    // New fields from SessionEnhanced
    @Column(name = "privacy_type", length = 20)
    private String privacyType = "PUBLIC"; // PUBLIC or PRIVATE
    
    @Column(name = "session_type", length = 20)
    private String sessionType = "ONLINE"; // ONLINE or FACE_TO_FACE
    
    @Column(name = "join_code", length = 20, unique = true)
    private String joinCode;
    
    @Column(name = "location", length = 500)
    private String location; // For FACE_TO_FACE sessions
    
    @Column(name = "meeting_link", length = 500)
    private String meetingLink; // For ONLINE sessions
    
    @Column(name = "max_participants")
    private Integer maxParticipants;
    
    @Column(name = "is_active")
    private Boolean isActive = true;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "host_id")
    @JsonIgnoreProperties({"hostedSessions", "participatingSessions", "password"})
    private User host;
    
    @OneToMany(mappedBy = "session", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnoreProperties("session")
    private List<File> files = new ArrayList<>();
    
    @OneToMany(mappedBy = "session", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnoreProperties("session")
    private List<Note> notes = new ArrayList<>();
    
    @ManyToMany
    @JoinTable(
        name = "session_participants",
        joinColumns = @JoinColumn(name = "session_id"),
        inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    @JsonIgnoreProperties({"participatingSessions", "hostedSessions", "password"})
    private List<User> participants = new ArrayList<>();
    
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
    
    public User getHost() {
        return host;
    }
    
    public void setHost(User host) {
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
    
    public List<User> getParticipants() {
        return participants;
    }
    
    public void setParticipants(List<User> participants) {
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
    
    // New fields getters and setters
    public String getPrivacyType() {
        return privacyType;
    }
    
    public void setPrivacyType(String privacyType) {
        this.privacyType = privacyType;
    }
    
    public String getSessionType() {
        return sessionType;
    }
    
    public void setSessionType(String sessionType) {
        this.sessionType = sessionType;
    }
    
    public String getJoinCode() {
        return joinCode;
    }
    
    public void setJoinCode(String joinCode) {
        this.joinCode = joinCode;
    }
    
    public String getLocation() {
        return location;
    }
    
    public void setLocation(String location) {
        this.location = location;
    }
    
    public String getMeetingLink() {
        return meetingLink;
    }
    
    public void setMeetingLink(String meetingLink) {
        this.meetingLink = meetingLink;
    }
    
    public Integer getMaxParticipants() {
        return maxParticipants;
    }
    
    public void setMaxParticipants(Integer maxParticipants) {
        this.maxParticipants = maxParticipants;
    }
    
    public Boolean getIsActive() {
        return isActive;
    }
    
    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
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
