package com.appdev.academeet.dto;

public class ReminderMinutesRequest {
    private Long studentId;
    private Long sessionId; // UPDATED: Was Integer
    private int minutesBefore;
   
    // Constructors
    public ReminderMinutesRequest() {}
   
    // UPDATED: Was Integer
    public ReminderMinutesRequest(Long studentId, Long sessionId, int minutesBefore) {
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
   
    public Long getSessionId() { // UPDATED: Was Integer
        return sessionId;
    }
   
    public void setSessionId(Long sessionId) { // UPDATED: Was Integer
        this.sessionId = sessionId;
    }
   
    public int getMinutesBefore() {
        return minutesBefore;
    }
   
    public void setMinutesBefore(int minutesBefore) {
        this.minutesBefore = minutesBefore;
    }
}