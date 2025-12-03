package com.appdev.academeet.dto;

import java.time.LocalDateTime;
import java.util.List;

/**
 * DTO for creating a new session.
 * Contains all necessary data to initialize a study session.
 */
public class SessionCreationDTO {
    private String topicTitle;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private Boolean isPrivate;
    private String sessionPassword; // Optional, only if private
    private String meetingOverview;
    private String location;
    private Integer maxParticipants;
    private List<String> initialTags;
    
    // Constructors
    public SessionCreationDTO() {
    }
    
    public SessionCreationDTO(String topicTitle, LocalDateTime startTime, Boolean isPrivate, 
                            String meetingOverview, String location, Integer maxParticipants) {
        this.topicTitle = topicTitle;
        this.startTime = startTime;
        this.isPrivate = isPrivate;
        this.meetingOverview = meetingOverview;
        this.location = location;
        this.maxParticipants = maxParticipants;
    }
    
    // Getters and Setters
    public String getTopicTitle() {
        return topicTitle;
    }
    
    public void setTopicTitle(String topicTitle) {
        this.topicTitle = topicTitle;
    }
    
    public LocalDateTime getStartTime() {
        return startTime;
    }
    
    public void setStartTime(LocalDateTime startTime) {
        this.startTime = startTime;
    }
    
    public LocalDateTime getEndTime() {
        return endTime;
    }
    
    public void setEndTime(LocalDateTime endTime) {
        this.endTime = endTime;
    }
    
    public Boolean getIsPrivate() {
        return isPrivate;
    }
    
    public void setIsPrivate(Boolean isPrivate) {
        this.isPrivate = isPrivate;
    }
    
    public String getSessionPassword() {
        return sessionPassword;
    }
    
    public void setSessionPassword(String sessionPassword) {
        this.sessionPassword = sessionPassword;
    }
    
    public String getMeetingOverview() {
        return meetingOverview;
    }
    
    public void setMeetingOverview(String meetingOverview) {
        this.meetingOverview = meetingOverview;
    }
    
    public String getLocation() {
        return location;
    }
    
    public void setLocation(String location) {
        this.location = location;
    }
    
    public Integer getMaxParticipants() {
        return maxParticipants;
    }
    
    public void setMaxParticipants(Integer maxParticipants) {
        this.maxParticipants = maxParticipants;
    }
    
    public List<String> getInitialTags() {
        return initialTags;
    }
    
    public void setInitialTags(List<String> initialTags) {
        this.initialTags = initialTags;
    }
}
