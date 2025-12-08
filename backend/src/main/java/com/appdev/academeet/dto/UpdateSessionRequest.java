package com.appdev.academeet.dto;

import java.time.LocalDateTime;
import java.time.Month;
import java.util.List;

import com.appdev.academeet.model.Session;
import com.appdev.academeet.model.SessionType;
import com.fasterxml.jackson.annotation.JsonInclude;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class UpdateSessionRequest {
    // All fields nullable to support partial updates (PATCH semantics)
    private String title;
    private String description;
    
    // Frontend sends separate date/time fields
    private String month;  // e.g., "January", "February"
    private String day;    // e.g., "15"
    private String year;   // e.g., "2025"
    private String startTime;  // e.g., "14:30"
    private String endTime;    // e.g., "16:00"
    
    private String location;
    private Integer maxParticipants;
    private SessionType sessionType;
    private List<String> tags;
    private String password;

    public UpdateSessionRequest() {}

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title == null ? null : title.trim(); }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description == null ? null : description.trim(); }

    public String getMonth() { return month; }
    public void setMonth(String month) { this.month = month; }

    public String getDay() { return day; }
    public void setDay(String day) { this.day = day; }

    public String getYear() { return year; }
    public void setYear(String year) { this.year = year; }

    public String getStartTime() { return startTime; }
    public void setStartTime(String startTime) { this.startTime = startTime; }

    public String getEndTime() { return endTime; }
    public void setEndTime(String endTime) { this.endTime = endTime; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location == null ? null : location.trim(); }

    public Integer getMaxParticipants() { return maxParticipants; }
    public void setMaxParticipants(Integer maxParticipants) { this.maxParticipants = maxParticipants; }

    public SessionType getSessionType() { return sessionType; }
    public void setSessionType(SessionType sessionType) { this.sessionType = sessionType; }

    public List<String> getTags() { return tags; }
    public void setTags(List<String> tags) { this.tags = tags; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password == null ? null : password.trim(); }

    /**
     * Converts month name to Month enum.
     * Supports both full names (January) and uppercase (JANUARY).
     */
    private Month parseMonth(String monthStr) {
        if (monthStr == null) {
            return null;
        }
        
        try {
            // Try parsing as numeric month first (1-12)
            int monthNum = Integer.parseInt(monthStr);
            return Month.of(monthNum);
        } catch (NumberFormatException e) {
            // Parse as month name (case-insensitive)
            return Month.valueOf(monthStr.toUpperCase());
        }
    }

    /**
     * Converts separate date/time fields to LocalDateTime.
     * Returns null if any required field is missing (for partial updates).
     */
    private LocalDateTime parseDateTime(String timeStr) {
        if (month == null || day == null || year == null || timeStr == null) {
            return null;
        }

        try {
            Month monthEnum = parseMonth(month);
            if (monthEnum == null) return null;
            
            int dayInt = Integer.parseInt(day);
            int yearInt = Integer.parseInt(year);
            
            // Parse time (HH:mm format)
            String[] timeParts = timeStr.split(":");
            int hour = Integer.parseInt(timeParts[0]);
            int minute = Integer.parseInt(timeParts[1]);
            
            return LocalDateTime.of(yearInt, monthEnum, dayInt, hour, minute);
        } catch (Exception e) {
            throw new IllegalArgumentException("Invalid date/time format: " + e.getMessage(), e);
        }
    }

    /**
     * Convert update request into a Session instance.
     * Note: fields may be null to indicate no change.
     */
    public Session toEntity() {
        Session s = new Session();
        s.setTitle(this.title);
        s.setDescription(this.description);
        
        // Convert separate date/time fields to LocalDateTime (only if provided)
        LocalDateTime parsedStartTime = parseDateTime(this.startTime);
        LocalDateTime parsedEndTime = parseDateTime(this.endTime);
        s.setStartTime(parsedStartTime);
        s.setEndTime(parsedEndTime);
        
        s.setLocation(this.location);
        s.setMaxParticipants(this.maxParticipants);
        if (this.sessionType != null) {
            s.setSessionPrivacy(this.sessionType);
        }
        s.setTags(this.tags);
        if (this.password != null && !this.password.isEmpty()) {
            s.setSessionPassword(this.password);
        }
        return s;
    }
}
