package com.appdev.academeet.dto;

import java.time.LocalDateTime;

import com.appdev.academeet.model.NotificationType;
import com.appdev.academeet.model.Reminder;

/**
 * DTO for reminder response.
 * Contains user's reminder/notification data.
 */
public class ReminderResponseDTO {
    private Long reminderId;
    private String header;
    private String message;
    private LocalDateTime reminderTime;
    private boolean read;
    private LocalDateTime readAt;
    private LocalDateTime sentAt;
    private NotificationType notificationType;
    private Long sessionId;
    private LocalDateTime createdAt;
    
    // Constructors
    public ReminderResponseDTO() {
    }
    
    public ReminderResponseDTO(Reminder reminder) {
        this.reminderId = reminder.getReminderId();
        this.header = reminder.getHeader();
        this.message = reminder.getMessage();
        this.reminderTime = reminder.getReminderTime();
        this.read = reminder.isRead();
        this.readAt = reminder.getReadAt();
        this.sentAt = reminder.getSentAt();
        this.notificationType = reminder.getNotificationType();
        this.sessionId = reminder.getSession() != null ? reminder.getSession().getId() : null;
        this.createdAt = reminder.getCreatedAt();
    }
    
    public ReminderResponseDTO(Long reminderId, String header, String message, 
                              LocalDateTime reminderTime, boolean read) {
        this.reminderId = reminderId;
        this.header = header;
        this.message = message;
        this.reminderTime = reminderTime;
        this.read = read;
    }
    
    // Getters and Setters
    public Long getReminderId() {
        return reminderId;
    }
    
    public void setReminderId(Long reminderId) {
        this.reminderId = reminderId;
    }
    
    public String getHeader() {
        return header;
    }
    
    public void setHeader(String header) {
        this.header = header;
    }
    
    public String getMessage() {
        return message;
    }
    
    public void setMessage(String message) {
        this.message = message;
    }
    
    public LocalDateTime getReminderTime() {
        return reminderTime;
    }
    
    public void setReminderTime(LocalDateTime reminderTime) {
        this.reminderTime = reminderTime;
    }
    
    public boolean isRead() {
        return read;
    }
    
    public void setRead(boolean read) {
        this.read = read;
    }
    
    public LocalDateTime getReadAt() {
        return readAt;
    }
    
    public void setReadAt(LocalDateTime readAt) {
        this.readAt = readAt;
    }
    
    public LocalDateTime getSentAt() {
        return sentAt;
    }
    
    public void setSentAt(LocalDateTime sentAt) {
        this.sentAt = sentAt;
    }
    
    public NotificationType getNotificationType() {
        return notificationType;
    }
    
    public void setNotificationType(NotificationType notificationType) {
        this.notificationType = notificationType;
    }
    
    public Long getSessionId() {
        return sessionId;
    }
    
    public void setSessionId(Long sessionId) {
        this.sessionId = sessionId;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
