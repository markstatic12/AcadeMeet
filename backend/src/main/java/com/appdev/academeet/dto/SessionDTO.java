package com.appdev.academeet.dto;

import java.time.format.DateTimeFormatter;
import java.util.List;

import com.appdev.academeet.model.Session;
import com.appdev.academeet.model.SessionStatus;
import com.appdev.academeet.model.SessionType;

/**
 * Data Transfer Object for Session entities.
 * Provides a clean interface for API responses with formatted data.
 */
public class SessionDTO {
    private static final DateTimeFormatter TIME_FORMATTER = DateTimeFormatter.ofPattern("HH:mm");

    // Basic session info
    private final Long id;
    private final String title;
    private final String description;
    
    // Host information
    private final String hostName;
    private final HostInfo createdBy; // Frontend expects this structure for ownership checks
    
    // Date and time fields
    private final String month;
    private final String day;
    private final String year;
    private final String startTime;
    private final String endTime;
    private final String location;
    
    // Session configuration
    private final SessionType sessionType;
    private final SessionStatus status;
    private final Integer maxParticipants;
    private final Integer currentParticipants;
    private final String createdAt;
    private final List<String> tags;
    
    /**
     * Host information structure for frontend compatibility.
     */
    public static class HostInfo {
        private final Long id;
        private final String name;
        
        public HostInfo(Long id, String name) {
            this.id = id;
            this.name = name;
        }
        
        public Long getId() { return id; }
        public String getName() { return name; }
    }

    /**
     * Converts a Session entity to a SessionDTO.
     * Handles null safety and formats time fields for JSON serialization.
     */
    public SessionDTO(Session session) {
        this.id = session.getId();
        this.title = session.getTitle();
        this.description = session.getDescription();
        
        // Host info - handle potential null host
        if (session.getHost() != null) {
            this.hostName = session.getHost().getName();
            this.createdBy = new HostInfo(session.getHost().getId(), session.getHost().getName());
        } else {
            this.hostName = "Unknown Host";
            this.createdBy = null;
        }
        
        // Date and location
        if (session.getStartTime() != null) {
            this.month = session.getStartTime().getMonth().toString();
            this.day = String.valueOf(session.getStartTime().getDayOfMonth());
            this.year = String.valueOf(session.getStartTime().getYear());
        } else {
            this.month = null;
            this.day = null;
            this.year = null;
        }
        this.location = session.getLocation();
        
        // Session settings
        this.sessionType = session.getSessionPrivacy();
        this.status = session.getSessionStatus();
        this.maxParticipants = session.getMaxParticipants();
        this.currentParticipants = session.getCurrentParticipants();
        this.createdAt = session.getCreatedAt() != null ? session.getCreatedAt().toString() : null;
        this.tags = session.getTags();

        // Format time fields for JSON - handle nulls gracefully
        this.startTime = session.getStartTime() != null ? session.getStartTime().format(TIME_FORMATTER) : null;
        this.endTime = session.getEndTime() != null ? session.getEndTime().format(TIME_FORMATTER) : null;
    }

    // Getters for Jackson JSON serialization
    public Long getId() { return id; }
    public String getTitle() { return title; }
    public String getDescription() { return description; }
    public String getHostName() { return hostName; }
    public HostInfo getCreatedBy() { return createdBy; }
    public String getMonth() { return month; }
    public String getDay() { return day; }
    public String getYear() { return year; }
    public String getStartTime() { return startTime; }
    public String getEndTime() { return endTime; }
    public String getLocation() { return location; }
    public SessionType getSessionType() { return sessionType; }
    public SessionStatus getStatus() { return status; }
    public Integer getMaxParticipants() { return maxParticipants; }
    public Integer getCurrentParticipants() { return currentParticipants; }
    public String getCreatedAt() { return createdAt; }
    public List<String> getTags() { return tags; }
}