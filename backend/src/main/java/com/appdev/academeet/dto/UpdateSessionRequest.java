package com.appdev.academeet.dto;

import java.time.LocalDateTime;
import java.util.List;

import com.appdev.academeet.model.Session;
import com.appdev.academeet.model.SessionType;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonInclude;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class UpdateSessionRequest {
    // All fields nullable to support partial updates (PATCH semantics)
    private String title;
    private String description;
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime startTime;
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime endTime;
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

    public LocalDateTime getStartTime() { return startTime; }
    public void setStartTime(LocalDateTime startTime) { this.startTime = startTime; }

    public LocalDateTime getEndTime() { return endTime; }
    public void setEndTime(LocalDateTime endTime) { this.endTime = endTime; }

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
     * Convert update request into a Session instance.
     * Note: fields may be null to indicate no change.
     */
    public Session toEntity() {
        Session s = new Session();
        s.setTitle(this.title);
        s.setDescription(this.description);
        s.setStartTime(this.startTime);
        s.setEndTime(this.endTime);
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
