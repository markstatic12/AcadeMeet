package com.appdev.academeet.dto;

import java.time.LocalDateTime;

import com.appdev.academeet.model.ReminderType;


public class ReminderDTO {
    private final Long id;
    private final Long sessionId;
    private final String sessionTitle;
    private final String message;
    private final ReminderType type;
    private final LocalDateTime scheduledTime;
    private final boolean isRead;
    private final LocalDateTime readAt;
    private final boolean isOwner;

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

    // Getters only
    public Long getId() { return id; }
    public Long getSessionId() { return sessionId; }
    public String getSessionTitle() { return sessionTitle; }
    public String getMessage() { return message; }
    public ReminderType getType() { return type; }
    public LocalDateTime getScheduledTime() { return scheduledTime; }
    public boolean isRead() { return isRead; }
    public LocalDateTime getReadAt() { return readAt; }
    public boolean isOwner() { return isOwner; }
}
