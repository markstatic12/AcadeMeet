package com.appdev.academeet.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "reminders")
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

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    // Lifecycle Methods
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
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
    public LocalDateTime getReminderTime() { return reminderTime; }
    public String getReminderMessage() { return reminderMessage; }
    public NotificationType getNotificationType() { return notificationType; }
    public boolean isSent() { return isSent; }
    public LocalDateTime getSentAt() { return sentAt; }
    public LocalDateTime getCreatedAt() { return createdAt; }

    // Setters
    public void setReminderId(Long reminderId) { this.reminderId = reminderId; }
    public void setUser(User user) { this.user = user; }
    public void setSession(Session session) { this.session = session; }
    public void setReminderTime(LocalDateTime reminderTime) { this.reminderTime = reminderTime; }
    public void setReminderMessage(String reminderMessage) { this.reminderMessage = reminderMessage; }
    public void setNotificationType(NotificationType notificationType) { this.notificationType = notificationType; }
    public void setSent(boolean sent) { this.isSent = sent; }
    public void setSentAt(LocalDateTime sentAt) { this.sentAt = sentAt; }
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