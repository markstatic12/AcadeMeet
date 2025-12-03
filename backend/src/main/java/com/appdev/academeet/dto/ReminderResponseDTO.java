package com.appdev.academeet.dto;

import java.time.LocalDateTime;

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
    private Boolean isRead;
    private LocalDateTime createdAt;
    
    // Constructors
    public ReminderResponseDTO() {
    }
    
    public ReminderResponseDTO(Reminder reminder) {
        this.reminderId = reminder.getReminderId();
        this.header = reminder.getHeader();
        this.message = reminder.getMessage();
        this.reminderTime = reminder.getReminderTime();
        this.isRead = reminder.isRead();
        this.createdAt = reminder.getCreatedAt();
    }
    
    public ReminderResponseDTO(Long reminderId, String header, String message, 
                              LocalDateTime reminderTime, Boolean isRead) {
        this.reminderId = reminderId;
        this.header = header;
        this.message = message;
        this.reminderTime = reminderTime;
        this.isRead = isRead;
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
    
    public Boolean getIsRead() {
        return isRead;
    }
    
    public void setIsRead(Boolean isRead) {
        this.isRead = isRead;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
