package com.appdev.academeet.dto;

import java.time.LocalDateTime;

import com.appdev.academeet.model.ReminderType;

/**
 * DTO for reminder response with generated message
 */
public class ReminderDTO {
    private Long id;
    private Long sessionId;
    private String sessionTitle;
    private String message;
    private ReminderType type;
    private LocalDateTime scheduledTime;
    private boolean isRead;
    private LocalDateTime readAt;
    private boolean isOwner;

    // Constructors
    public ReminderDTO() {}

    public ReminderDTO(Long id, Long sessionId, String sessionTitle, String message, 
                      ReminderType type, LocalDateTime scheduledTime, boolean isRead, 
                      LocalDateTime readAt, boolean isOwner) {
        this.id = id;
        this.sessionId = sessionId;
        this.sessionTitle = sessionTitle;
        this.message = message;
        this.type = type;
        this.scheduledTime = scheduledTime;
        this.isRead = isRead;
        this.readAt = readAt;
        this.isOwner = isOwner;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getSessionId() {
        return sessionId;
    }

    public void setSessionId(Long sessionId) {
        this.sessionId = sessionId;
    }

    public String getSessionTitle() {
        return sessionTitle;
    }

    public void setSessionTitle(String sessionTitle) {
        this.sessionTitle = sessionTitle;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public ReminderType getType() {
        return type;
    }

    public void setType(ReminderType type) {
        this.type = type;
    }

    public LocalDateTime getScheduledTime() {
        return scheduledTime;
    }

    public void setScheduledTime(LocalDateTime scheduledTime) {
        this.scheduledTime = scheduledTime;
    }

    public boolean isRead() {
        return isRead;
    }

    public void setRead(boolean read) {
        isRead = read;
    }

    public LocalDateTime getReadAt() {
        return readAt;
    }

    public void setReadAt(LocalDateTime readAt) {
        this.readAt = readAt;
    }

    public boolean isOwner() {
        return isOwner;
    }

    public void setOwner(boolean owner) {
        isOwner = owner;
    }
}
