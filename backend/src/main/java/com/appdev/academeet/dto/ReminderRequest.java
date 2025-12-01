package com.appdev.academeet.dto;

import com.appdev.academeet.model.NotificationType;
import java.time.LocalDateTime;

public class ReminderRequest {
    private Long userId;
    private Long sessionId;
    private LocalDateTime reminderTime;
    private String reminderMessage;
    private NotificationType notificationType;

    public ReminderRequest() {}

    public ReminderRequest(Long userId, Long sessionId, LocalDateTime reminderTime) {
        this.userId = userId;
        this.sessionId = sessionId;
        this.reminderTime = reminderTime;
        this.notificationType = NotificationType.IN_APP;
    }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    
    public Long getSessionId() { return sessionId; }
    public void setSessionId(Long sessionId) { this.sessionId = sessionId; }
    
    public LocalDateTime getReminderTime() { return reminderTime; }
    public void setReminderTime(LocalDateTime reminderTime) { this.reminderTime = reminderTime; }
    
    public String getReminderMessage() { return reminderMessage; }
    public void setReminderMessage(String reminderMessage) { this.reminderMessage = reminderMessage; }
    
    public NotificationType getNotificationType() { return notificationType; }
    public void setNotificationType(NotificationType notificationType) { this.notificationType = notificationType; }
}