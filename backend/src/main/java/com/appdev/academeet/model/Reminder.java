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
    @Index(name = "idx_reminder_user_read", columnList = "user_id, is_read")
})
public class Reminder {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "reminder_id")
    private Long reminderId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "session_id", nullable = false)
    private Session session;

    @Column(name = "header", nullable = false, length = 255)
    private String header;

    @Column(name = "message", columnDefinition = "TEXT")
    private String message;

    @Column(name = "reminder_time", nullable = false)
    private LocalDateTime reminderTime;

    @Column(name = "reminder_message")
    private String reminderMessage;

    @Enumerated(EnumType.STRING)
    @Column(name = "notification_type")
    private NotificationType notificationType = NotificationType.IN_APP;

    @Column(name = "is_sent")
    private boolean isSent = false;

    @Column(name = "sent_at")
    private LocalDateTime sentAt;

    @Column(name = "is_read")
    private boolean isRead = false;

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

    public Reminder(User user, Session session, LocalDateTime reminderTime) {
        this.user = user;
        this.session = session;
        this.reminderTime = reminderTime;
    }

    // Getters
    public Long getReminderId() { return reminderId; }
    public User getUser() { return user; }
    public Session getSession() { return session; }
    public String getHeader() { return header; }
    public String getMessage() { return message; }
    public LocalDateTime getReminderTime() { return reminderTime; }
    public String getReminderMessage() { return reminderMessage; }
    public NotificationType getNotificationType() { return notificationType; }
    public boolean isSent() { return isSent; }
    public LocalDateTime getSentAt() { return sentAt; }
    public boolean isRead() { return isRead; }
    public LocalDateTime getCreatedAt() { return createdAt; }

    // Setters
    public void setReminderId(Long reminderId) { this.reminderId = reminderId; }
    public void setUser(User user) { this.user = user; }
    public void setSession(Session session) { this.session = session; }
    public void setHeader(String header) { this.header = header; }
    public void setMessage(String message) { this.message = message; }
    public void setReminderTime(LocalDateTime reminderTime) { this.reminderTime = reminderTime; }
    public void setReminderMessage(String reminderMessage) { this.reminderMessage = reminderMessage; }
    public void setNotificationType(NotificationType notificationType) { this.notificationType = notificationType; }
    public void setSent(boolean sent) { this.isSent = sent; }
    public void setSentAt(LocalDateTime sentAt) { this.sentAt = sentAt; }
    public void setRead(boolean read) { this.isRead = read; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    // Helper methods
    public boolean isPending() {
        return !isSent && reminderTime.isAfter(LocalDateTime.now());
    }

    public boolean isDue() {
        return !isSent && reminderTime.isBefore(LocalDateTime.now());
    }

    public void markAsSent() {
        this.isSent = true;
        this.sentAt = LocalDateTime.now();
    }
}