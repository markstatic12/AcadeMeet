package com.appdev.academeet.dto;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import com.appdev.academeet.model.Session;
import com.appdev.academeet.model.SessionStatus;

/**
 * DTO for full session details response.
 * Includes host information, tags, and participant count.
 */
public class SessionResponseDTO {
    private Long sessionId;
    private String topicTitle;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private SessionStatus status;
    private Boolean isPrivate;
    private Integer currentParticipants;
    private Integer maxParticipants;
    private UserSummaryDTO host;
    private List<String> tags;
    private String location;
    private String description;
    private LocalDateTime createdAt;
    
    // Constructors
    public SessionResponseDTO() {
    }
    
    public SessionResponseDTO(Session session) {
        this.sessionId = session.getId();
        this.topicTitle = session.getTitle();
        this.startTime = session.getStartTime();
        this.endTime = session.getEndTime();
        this.status = session.getStatus();
        this.isPrivate = session.getSessionType().equals(com.appdev.academeet.model.SessionType.PRIVATE);
        this.currentParticipants = session.getCurrentParticipants();
        this.maxParticipants = session.getMaxParticipants();
        this.location = session.getLocation();
        this.description = session.getDescription();
        this.createdAt = session.getCreatedAt();
        
        // Map host to UserSummaryDTO
        if (session.getHost() != null) {
            this.host = new UserSummaryDTO(
                session.getHost().getId(),
                session.getHost().getName(),
                session.getHost().getProfileImageUrl(),
                session.getHost().getProgram(),
                session.getHost().getBio()
            );
        }
        
        // Extract tag names
        if (session.getSessionTags() != null) {
            this.tags = session.getSessionTags().stream()
                .map(tag -> tag.getTagName())
                .collect(Collectors.toList());
        }
    }
    
    // Getters and Setters
    public Long getSessionId() {
        return sessionId;
    }
    
    public void setSessionId(Long sessionId) {
        this.sessionId = sessionId;
    }
    
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
    
    public SessionStatus getStatus() {
        return status;
    }
    
    public void setStatus(SessionStatus status) {
        this.status = status;
    }
    
    public Boolean getIsPrivate() {
        return isPrivate;
    }
    
    public void setIsPrivate(Boolean isPrivate) {
        this.isPrivate = isPrivate;
    }
    
    public Integer getCurrentParticipants() {
        return currentParticipants;
    }
    
    public void setCurrentParticipants(Integer currentParticipants) {
        this.currentParticipants = currentParticipants;
    }
    
    public Integer getMaxParticipants() {
        return maxParticipants;
    }
    
    public void setMaxParticipants(Integer maxParticipants) {
        this.maxParticipants = maxParticipants;
    }
    
    public UserSummaryDTO getHost() {
        return host;
    }
    
    public void setHost(UserSummaryDTO host) {
        this.host = host;
    }
    
    public List<String> getTags() {
        return tags;
    }
    
    public void setTags(List<String> tags) {
        this.tags = tags;
    }
    
    public String getLocation() {
        return location;
    }
    
    public void setLocation(String location) {
        this.location = location;
    }
    
    public String getDescription() {
        return description;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
