package com.appdev.academeet.dto;

/**
 * DTO for joining a session.
 * Includes optional password for private sessions.
 */
public class JoinSessionDTO {
    private Long sessionId;
    private String sessionPassword; // Optional, only for private sessions
    
    // Constructors
    public JoinSessionDTO() {
    }
    
    public JoinSessionDTO(Long sessionId, String sessionPassword) {
        this.sessionId = sessionId;
        this.sessionPassword = sessionPassword;
    }
    
    // Getters and Setters
    public Long getSessionId() {
        return sessionId;
    }
    
    public void setSessionId(Long sessionId) {
        this.sessionId = sessionId;
    }
    
    public String getSessionPassword() {
        return sessionPassword;
    }
    
    public void setSessionPassword(String sessionPassword) {
        this.sessionPassword = sessionPassword;
    }
}
