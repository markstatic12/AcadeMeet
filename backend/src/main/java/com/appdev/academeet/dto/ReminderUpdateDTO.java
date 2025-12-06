package com.appdev.academeet.dto;

import java.time.LocalDateTime;

import com.appdev.academeet.model.NotificationType;

/**
 * DTO for updating reminder fields. All fields optional.
 */
public class ReminderUpdateDTO {
    private LocalDateTime reminderTime;
    private String message;
    private NotificationType notificationType;
    private Long sessionId;

    public ReminderUpdateDTO() {}

    public LocalDateTime getReminderTime() { return reminderTime; }
    public void setReminderTime(LocalDateTime reminderTime) { this.reminderTime = reminderTime; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public NotificationType getNotificationType() { return notificationType; }
    public void setNotificationType(NotificationType notificationType) { this.notificationType = notificationType; }

    public Long getSessionId() { return sessionId; }
    public void setSessionId(Long sessionId) { this.sessionId = sessionId; }
}
