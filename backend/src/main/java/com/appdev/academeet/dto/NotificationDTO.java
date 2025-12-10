package com.appdev.academeet.dto;

import java.time.LocalDateTime;

import com.appdev.academeet.model.Notification;
import com.appdev.academeet.model.NotificationType;

public class NotificationDTO {
    private final Long id;
    private final Long sessionId;
    private final String sessionTitle;
    private final NotificationType type;
    private final String message;
    private final Boolean read;
    private final LocalDateTime createdAt;
    
    public NotificationDTO(Notification notification) {
        this.id = notification.getId();
        this.sessionId = notification.getSession() != null ? notification.getSession().getId() : null;
        this.sessionTitle = notification.getSession() != null ? notification.getSession().getTitle() : null;
        this.type = notification.getType();
        this.message = notification.getMessage();
        this.read = notification.isRead();
        this.createdAt = notification.getCreatedAt();
    }
    
    // Getters only 
    public Long getId() { return id; }
    public Long getSessionId() { return sessionId; }
    public String getSessionTitle() { return sessionTitle; }
    public NotificationType getType() { return type; }
    public String getMessage() { return message; }
    public Boolean getRead() { return read; }
    public LocalDateTime getCreatedAt() { return createdAt; }
}
