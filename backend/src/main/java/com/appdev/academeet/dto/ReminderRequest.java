package com.appdev.academeet.dto;

import java.time.LocalDateTime;

public class ReminderRequest {
    private Long studentId;
    private Integer sessionId;
    private LocalDateTime reminderTime;
    
    // Constructors
    public ReminderRequest() {}
    
    public ReminderRequest(Long studentId, Integer sessionId, LocalDateTime reminderTime) {
        this.studentId = studentId;
        this.sessionId = sessionId;
        this.reminderTime = reminderTime;
    }
    
    // Getters and Setters
    public Long getStudentId() {
        return studentId;
    }
    
    public void setStudentId(Long studentId) {
        this.studentId = studentId;
    }
    
    public Integer getSessionId() {
        return sessionId;
    }
    
    public void setSessionId(Integer sessionId) {
        this.sessionId = sessionId;
    }
    
    public LocalDateTime getReminderTime() {
        return reminderTime;
    }
    
    public void setReminderTime(LocalDateTime reminderTime) {
        this.reminderTime = reminderTime;
    }
}
