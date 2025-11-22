package com.appdev.academeet.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import java.time.LocalTime;
import java.time.LocalDateTime;

@Entity
@Table(name = "sessions")
public class Session {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    @ManyToOne(fetch = FetchType.LAZY)
    // User entity's primary key column is mapped to "user_id"; make the FK reference that column
    @JoinColumn(name = "host_id_fk", referencedColumnName = "user_id")
    private User host;  // this is important

    private String month;
    private String day;
    private String year;

    @JsonFormat(pattern = "HH:mm")
    private LocalTime startTime;

    @JsonFormat(pattern = "HH:mm")
    private LocalTime endTime;

    private String location;

    @Column(columnDefinition = "TEXT")
    private String description;

    // Session Privacy & Status
    @Enumerated(EnumType.STRING)
    @Column(name = "session_type")
    private SessionType sessionType = SessionType.PUBLIC;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private SessionStatus status = SessionStatus.ACTIVE;

    @Column(name = "password")
    private String password; // nullable - only for PRIVATE sessions

    // Participant Management
    @Column(name = "max_participants")
    private Integer maxParticipants;

    @Column(name = "current_participants")
    private Integer currentParticipants = 0;

    // Images
    @Column(name = "profile_image_url")
    private String profileImageUrl;

    @Column(name = "cover_image_url")
    private String coverImageUrl;

    // Timestamps
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // Lifecycle Methods
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    // Getters & setters
    public Long getId() { return id; }
    public String getTitle() { return title; }
    public User getHost() { return host; }
    public String getMonth() { return month; }
    public String getDay() { return day; }
    public String getYear() { return year; }
    public LocalTime getStartTime() { return startTime; }
    public LocalTime getEndTime() { return endTime; }
    public String getLocation() { return location; }
    public String getDescription() { return description; }

    public void setId(Long id) { this.id = id; }
    public void setTitle(String title) { this.title = title; }
    public void setHost(User host) { this.host = host; }
    public void setMonth(String month) { this.month = month; }
    public void setDay(String day) { this.day = day; }
    public void setYear(String year) { this.year = year; }
    public void setStartTime(LocalTime startTime) { this.startTime = startTime; }
    public void setEndTime(LocalTime endTime) { this.endTime = endTime; }
    public void setLocation(String location) { this.location = location; }
    public void setDescription(String description) { this.description = description; }

    // New field getters
    public SessionType getSessionType() { return sessionType; }
    public SessionStatus getStatus() { return status; }
    public String getPassword() { return password; }
    public Integer getMaxParticipants() { return maxParticipants; }
    public Integer getCurrentParticipants() { return currentParticipants; }
    public String getProfileImageUrl() { return profileImageUrl; }
    public String getCoverImageUrl() { return coverImageUrl; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }

    // New field setters
    public void setSessionType(SessionType sessionType) { this.sessionType = sessionType; }
    public void setStatus(SessionStatus status) { this.status = status; }
    public void setPassword(String password) { this.password = password; }
    public void setMaxParticipants(Integer maxParticipants) { this.maxParticipants = maxParticipants; }
    public void setCurrentParticipants(Integer currentParticipants) { this.currentParticipants = currentParticipants; }
    public void setProfileImageUrl(String profileImageUrl) { this.profileImageUrl = profileImageUrl; }
    public void setCoverImageUrl(String coverImageUrl) { this.coverImageUrl = coverImageUrl; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
