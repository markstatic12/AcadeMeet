package com.appdev.academeet.dto;

public class ReminderMinutesRequest {
    private Long studentId;
    private Integer sessionId;
    private int minutesBefore;
    
    // Constructors
    public ReminderMinutesRequest() {}
    
    public ReminderMinutesRequest(Long studentId, Integer sessionId, int minutesBefore) {
        this.studentId = studentId;
        this.sessionId = sessionId;
        this.minutesBefore = minutesBefore;
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
    
    public int getMinutesBefore() {
        return minutesBefore;
    }
    
    public void setMinutesBefore(int minutesBefore) {
        this.minutesBefore = minutesBefore;
    }
}
