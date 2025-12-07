package com.appdev.academeet.model;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;

@Entity
@Table(name = "session")
public class Session {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "host_id_fk", referencedColumnName = "user_id")
    private User host; 

    @Column(name = "start_time", nullable = false)
    private LocalDateTime startTime;

    @Column(name = "end_time")
    private LocalDateTime endTime;

    private String location;

    @Column(columnDefinition = "TEXT")
    private String description;

    
    @OneToMany(mappedBy = "session", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<SessionTag> sessionTags = new ArrayList<>();

    @OneToMany(mappedBy = "session", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<SessionNote> sessionNotes = new ArrayList<>();

    // Participants relationship
    @OneToMany(mappedBy = "session", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<SessionParticipant> participants = new ArrayList<>();

    // Session Privacy & Status
    @Enumerated(EnumType.STRING)
    @Column(name = "session_privacy")
    private SessionType sessionPrivacy = SessionType.PUBLIC;

    @Enumerated(EnumType.STRING)
    @Column(name = "session_status")
    private SessionStatus sessionStatus = SessionStatus.ACTIVE;

    @Column(name = "session_password")
    private String sessionPassword; 

    // Participant Management
    @Column(name = "max_participants")
    private Integer maxParticipants;

    @Column(name = "current_participants")
    private Integer currentParticipants = 0;

    // Images
    @Column(name = "profile_image_url")
    private String profileImageUrl;

    // Timestamps
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @PrePersist
    protected void onCreate() {
        if(createdAt == null)
            createdAt = LocalDateTime.now();
        if(updatedAt == null)
            updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    // Getters
    public Long getId() { return id; }
    public String getTitle() { return title; }
    public User getHost() { return host; }
    public LocalDateTime getStartTime() { return startTime; }
    public LocalDateTime getEndTime() { return endTime; }
    public String getLocation() { return location; }
    public String getDescription() { return description; }
    public List<SessionTag> getSessionTags() { return sessionTags; }
    public List<SessionParticipant> getParticipants() { return participants; }
    public List<SessionNote> getSessionNotes() { return sessionNotes; }
    public SessionType getSessionPrivacy() { return sessionPrivacy; }
    public SessionStatus getSessionStatus() { return sessionStatus; }
    public String getSessionPassword() { return sessionPassword; }
    public Integer getMaxParticipants() { return maxParticipants; }
    public Integer getCurrentParticipants() { return currentParticipants; }
    public String getProfileImageUrl() { return profileImageUrl; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }

    //setters
    public void setId(Long id) { this.id = id; }
    public void setTitle(String title) { this.title = title; }
    public void setHost(User host) { this.host = host; }
    public void setStartTime(LocalDateTime startTime) { this.startTime = startTime; }
    public void setEndTime(LocalDateTime endTime) { this.endTime = endTime; }
    public void setLocation(String location) { this.location = location; }
    public void setDescription(String description) { this.description = description; }
    public void setSessionTags(List<SessionTag> sessionTags) { this.sessionTags = sessionTags; }
    public void setParticipants(List<SessionParticipant> participants) { this.participants = participants; }
    public void setSessionNotes(List<SessionNote> sessionNotes) { this.sessionNotes = sessionNotes; }
    public void setSessionPrivacy(SessionType sessionPrivacy) { this.sessionPrivacy = sessionPrivacy; }
    public void setSessionStatus(SessionStatus sessionStatus) { this.sessionStatus = sessionStatus; }
    public void setSessionPassword(String sessionPassword) { this.sessionPassword = sessionPassword; }
    public void setMaxParticipants(Integer maxParticipants) { this.maxParticipants = maxParticipants; }
    public void setCurrentParticipants(Integer currentParticipants) { this.currentParticipants = currentParticipants; }
    public void setProfileImageUrl(String profileImageUrl) { this.profileImageUrl = profileImageUrl; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    
    // Convenience methods for working with tags (backwards compatibility)
    public List<String> getTags() {
        return sessionTags.stream()
                .map(SessionTag::getTagName)
                .toList();
    }

    public void setTags(List<String> tagNames) {
        // Update tags idempotently: remove tags not present in the incoming list,
        // and add only new tags. This avoids deleting and re-inserting identical
        // tag rows in a single flush which can cause unique constraint violations
        // on (session_id, tag_name).
        if (tagNames == null) {
            this.sessionTags.clear();
            return;
        }

        // Use a set for quick lookup of desired tag names
        java.util.Set<String> desired = new java.util.HashSet<>(tagNames);

        // Remove existing tags that are not desired
        this.sessionTags.removeIf(existing -> !desired.contains(existing.getTagName()));

        // Build a set of existing names to avoid duplicates when adding
        java.util.Set<String> existingNames = this.sessionTags.stream()
                .map(SessionTag::getTagName)
                .collect(java.util.stream.Collectors.toSet());

        // Add only tags that don't already exist
        for (String tagName : tagNames) {
            if (!existingNames.contains(tagName)) {
                SessionTag tag = new SessionTag(this, tagName);
                this.sessionTags.add(tag);
            }
        }
    }

    public void addTag(String tagName) {
        SessionTag tag = new SessionTag(this, tagName);
        this.sessionTags.add(tag);
    }

    public void removeTag(String tagName) {
        this.sessionTags.removeIf(tag -> tag.getTagName().equals(tagName));
    }

    @Deprecated
    public List<String> getNotes() {
        return sessionNotes.stream()
                .map(SessionNote::getFilepath)
                .toList();
    }

    @Deprecated
    public void setNotes(List<String> notePaths) {
        this.sessionNotes.clear();
        if (notePaths != null) {
            for (String path : notePaths) {
                SessionNote note = new SessionNote(this, path);
                this.sessionNotes.add(note);
            }
        }
    }

    // Convenience methods for working with participants
    public void addParticipant(User user) {
        SessionParticipant participant = new SessionParticipant(this, user);
        this.participants.add(participant);
    }

    public void removeParticipant(User user) {
        this.participants.removeIf(p -> p.getUser().equals(user));
    }

    public boolean hasParticipant(User user) {
        return this.participants.stream()
                .anyMatch(p -> p.getUser().equals(user));
    }

    public int getParticipantCount() {
        return this.participants.size();
    }

}
