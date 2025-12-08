package com.appdev.academeet.dto;

import java.time.LocalDateTime;
import java.time.Month;
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
    private final List<String> notes; // File paths for session notes
    
    /**
     * Calculates the current status of a session based on its start and end times.
     * 
     * @param session The session entity
     * @return The calculated session status
     */
    private static SessionStatus calculateSessionStatus(Session session) {
        // If session is manually set to DELETED, CANCELLED, or TRASH, keep that status
        SessionStatus currentStatus = session.getSessionStatus();
        if (currentStatus == SessionStatus.DELETED || 
            currentStatus == SessionStatus.CANCELLED || 
            currentStatus == SessionStatus.TRASH) {
            return currentStatus;
        }
        
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime startTime = session.getStartTime();
        LocalDateTime endTime = session.getEndTime();
        
        if (startTime == null || endTime == null) {
            return SessionStatus.SCHEDULED; // Default for sessions without time
        }
        
        // Before start time -> SCHEDULED
        if (now.isBefore(startTime)) {
            return SessionStatus.SCHEDULED;
        }
        
        // Between start and end time -> ACTIVE
        if (now.isAfter(startTime) && now.isBefore(endTime)) {
            return SessionStatus.ACTIVE;
        }
        
        // After end time -> COMPLETED
        return SessionStatus.COMPLETED;
    }
    
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
            // Convert month to proper case (January instead of JANUARY)
            Month monthEnum = session.getStartTime().getMonth();
            String monthName = monthEnum.toString(); // Returns "JANUARY"
            this.month = monthName.charAt(0) + monthName.substring(1).toLowerCase(); // Converts to "January"
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
        this.status = calculateSessionStatus(session); // Dynamically calculate status
        this.maxParticipants = session.getMaxParticipants();
        this.currentParticipants = session.getCurrentParticipants();
        this.createdAt = session.getCreatedAt() != null ? session.getCreatedAt().toString() : null;
        this.tags = session.getTags();
        
        // Extract note file paths from SessionNote entities
        this.notes = session.getSessionNotes().stream()
                .map(sessionNote -> sessionNote.getFilepath())
                .toList();

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
    public List<String> getNotes() { return notes; }
}