package com.appdev.academeet.model;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;

@Entity
@Table(name = "reminder", indexes = {
    @Index(name = "idx_reminder_user_scheduled", columnList = "user_id, scheduled_time"),
    @Index(name = "idx_reminder_user_read", columnList = "user_id, is_read")
})
public class Reminder {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "reminder_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "session_id", nullable = false)
    private Session session;

    @Enumerated(EnumType.STRING)
    @Column(name = "type", nullable = false)
    private ReminderType type;

    @Column(name = "scheduled_time", nullable = false)
    private LocalDateTime scheduledTime;
    
    @Column(name = "header", nullable = false)
    private String header;

    @Column(name = "is_read", nullable = false)
    private boolean isRead = false;

    @Column(name = "read_at")
    private LocalDateTime readAt;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    // Lifecycle Methods
    @PrePersist
    protected void onCreate() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
    }

    // Constructors
    public Reminder() {}

    public Reminder(User user, Session session, ReminderType type, LocalDateTime scheduledTime) {
        this.user = user;
        this.session = session;
        this.type = type;
        this.scheduledTime = scheduledTime;
        this.isRead = false;
        this.header = generateHeader(type, session);
    }
    
    // Helper method to generate header based on type
    private String generateHeader(ReminderType type, Session session) {
        if (session == null) return "Session Reminder";
        
        switch (type) {
            case DAY_BEFORE:
                return "Session Tomorrow: " + session.getTitle();
            case ONE_HOUR_BEFORE:
                return "Session Starting Soon: " + session.getTitle();
            default:
                return "Session Reminder: " + session.getTitle();
        }
    }

    // Getters
    public Long getId() {
        return id;
    }

    public User getUser() {
        return user;
    }

    public Session getSession() {
        return session;
    }

    public ReminderType getType() {
        return type;
    }

    public LocalDateTime getScheduledTime() {
        return scheduledTime;
    }

    public boolean isRead() {
        return isRead;
    }

    public LocalDateTime getReadAt() {
        return readAt;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public String getHeader() {
        return header;
    }

    // Setters
    public void setId(Long id) {
        this.id = id;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public void setSession(Session session) {
        this.session = session;
    }

    public void setType(ReminderType type) {
        this.type = type;
    }

    public void setScheduledTime(LocalDateTime scheduledTime) {
        this.scheduledTime = scheduledTime;
    }

    public void setRead(boolean read) {
        this.isRead = read;
    }

    public void setReadAt(LocalDateTime readAt) {
        this.readAt = readAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    public void setHeader(String header) {
        this.header = header;
    }

    // Helper method
    public void markAsRead() {
        this.isRead = true;
        this.readAt = LocalDateTime.now();
    }
}
