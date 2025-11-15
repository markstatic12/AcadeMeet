package com.appdev.academeet.dto;

import java.util.List;

public class CreateSessionRequest {

    private String title;
    private String host;
    private String month;
    private String day;
    private String year;
    private String startTime;
    private String endTime;
    private String location;
    private List<String> tags;
    private String additionalNotes;
    private String description;

    // NOTE: In a real app with token-based auth, you wouldn't pass the 'host'.
    // You would get the host's User ID from the security context (e.g., the JWT token).

    // ======================
    // Getters
    // ======================
    public String getTitle() { return title; }
    public String getHost() { return host; }
    public String getMonth() { return month; }
    public String getDay() { return day; }
    public String getYear() { return year; }
    public String getStartTime() { return startTime; }
    public String getEndTime() { return endTime; }
    public String getLocation() { return location; }
    public List<String> getTags() { return tags; }
    public String getAdditionalNotes() { return additionalNotes; }
    public String getDescription() { return description; }

    // ======================
    // Setters
    // ======================
    public void setTitle(String title) { this.title = title; }
    public void setHost(String host) { this.host = host; }
    public void setMonth(String month) { this.month = month; }
    public void setDay(String day) { this.day = day; }
    public void setYear(String year) { this.year = year; }
    public void setStartTime(String startTime) { this.startTime = startTime; }
    public void setEndTime(String endTime) { this.endTime = endTime; }
    public void setLocation(String location) { this.location = location; }
    public void setTags(List<String> tags) { this.tags = tags; }
    public void setAdditionalNotes(String additionalNotes) { this.additionalNotes = additionalNotes; }
    public void setDescription(String description) { this.description = description; }
}
