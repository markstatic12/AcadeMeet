package com.appdev.academeet.dto;

import java.time.LocalDateTime;

public class ReminderRequest {
    private Long studentId;
    private Long sessionId; // UPDATED: Was Integer
    private LocalDateTime reminderTime;
   
    // Constructors
    public ReminderRequest() {}
   
    // UPDATED: Was Integer
    public ReminderRequest(Long studentId, Long sessionId, LocalDateTime reminderTime) {
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
   
    public Long getSessionId() { // UPDATED: Was Integer
        return sessionId;
    }
   
    public void setSessionId(Long sessionId) { // UPDATED: Was Integer
        this.sessionId = sessionId;
    }
   
    public LocalDateTime getReminderTime() {
        return reminderTime;
    }
   
    public void setReminderTime(LocalDateTime reminderTime) {
        this.reminderTime = reminderTime;
    }
}