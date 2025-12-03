package com.appdev.academeet.dto;

import java.time.LocalDateTime;

/**
 * DTO for creating a reminder.
 * Schedules a notification for the user.
 */
public class ReminderCreationDTO {
    private String header;
    private String message;
    private LocalDateTime reminderTime;
    private Long sessionId; // Optional: link to a session
    
    // Constructors
    public ReminderCreationDTO() {
    }
    
    public ReminderCreationDTO(String header, String message, LocalDateTime reminderTime) {
        this.header = header;
        this.message = message;
        this.reminderTime = reminderTime;
    }
    
    // Getters and Setters
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
    
    public Long getSessionId() {
        return sessionId;
    }
    
    public void setSessionId(Long sessionId) {
        this.sessionId = sessionId;
    }
}
