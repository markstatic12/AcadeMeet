package com.appdev.academeet.dto;

import java.util.List;

import com.appdev.academeet.model.SessionPrivacy;
import com.fasterxml.jackson.annotation.JsonInclude;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class CreateSessionRequest {
    @NotBlank(message = "Title is required")
    @Size(min = 3, max = 100, message = "Title must be between 3 and 100 characters")
    private String title;
    
    @Size(max = 5000, message = "Description must not exceed 5000 characters")
    private String description;
    
    // Frontend sends separate date/time fields
    @NotBlank(message = "Month is required")
    private String month;  // e.g., "January", "February"
    
    @NotBlank(message = "Day is required")
    private String day;    // e.g., "15"
    
    @NotBlank(message = "Year is required")
    private String year;   // e.g., "2025"
    
    @NotBlank(message = "Start time is required")
    private String startTime;  // e.g., "14:30"
    
    @NotBlank(message = "End time is required")
    private String endTime;    // e.g., "16:00"
    
    @NotBlank(message = "Location is required")
    @Size(min = 3, message = "Location must be at least 3 characters")
    private String location;
    
    @Min(value = 1, message = "Must have at least 1 participant")
    @Max(value = 1000, message = "Cannot exceed 1000 participants")
    private Integer maxParticipants;
    
    @NotNull(message = "Session privacy is required")
    private SessionPrivacy sessionPrivacy;
    
    @Size(max = 5, message = "Maximum 5 tags allowed")
    private List<String> tags;
    
    @Size(min = 6, message = "Password must be at least 6 characters")
    private String password;

    public CreateSessionRequest() {}

    public CreateSessionRequest(String title, String description, String month, String day, String year,
            String startTime, String endTime, String location, Integer maxParticipants, 
            SessionPrivacy sessionPrivacy, List<String> tags) {
        this.title = title;
        this.description = description;
        this.month = month;
        this.day = day;
        this.year = year;
        this.startTime = startTime;
        this.endTime = endTime;
        this.location = location;
        this.maxParticipants = maxParticipants;
        this.sessionPrivacy = sessionPrivacy;
        this.tags = tags;
    }

    // Getters and Setters
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

    public SessionPrivacy getSessionPrivacy() { return sessionPrivacy; }
    public void setSessionPrivacy(SessionPrivacy sessionPrivacy) { this.sessionPrivacy = sessionPrivacy; }

    public List<String> getTags() { return tags; }
    public void setTags(List<String> tags) { this.tags = tags; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password == null ? null : password.trim(); }
}
