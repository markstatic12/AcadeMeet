package com.appdev.academeet.dto;

import java.time.LocalDateTime;

import com.appdev.academeet.model.NotificationType;

/**
 * DTO for creating a reminder.
 * Schedules a notification for the user.
 */
public class ReminderCreationDTO {
    private String header;
    private String message;
    private LocalDateTime reminderTime;
    private Long sessionId; // Optional: link to a session
    private NotificationType notificationType;

    // Constructors
    public ReminderCreationDTO() {
    }

    public ReminderCreationDTO(String header, String message, LocalDateTime reminderTime) {
        this.header = header;
        this.message = message;
        this.reminderTime = reminderTime;
        this.notificationType = NotificationType.IN_APP;
    }

    // Getters and Setters
    public String getHeader() { return header; }
    public void setHeader(String header) { this.header = header; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public LocalDateTime getReminderTime() { return reminderTime; }
    public void setReminderTime(LocalDateTime reminderTime) { this.reminderTime = reminderTime; }

    public Long getSessionId() { return sessionId; }
    public void setSessionId(Long sessionId) { this.sessionId = sessionId; }

    public NotificationType getNotificationType() { return notificationType; }
    public void setNotificationType(NotificationType notificationType) { this.notificationType = notificationType; }
}
