package com.appdev.academeet.dto;

import com.appdev.academeet.model.Session;
import java.time.format.DateTimeFormatter;

public class SessionDTO {

    private Long id;
    private String title;
    private String hostName; // We will send the host's name, not the whole User object
    private String month;
    private String day;
    private String year;
    private String startTime;
    private String endTime;
    private String location;

    // Formatter to convert LocalTime to a string like "09:30"
    private static final DateTimeFormatter TIME_FORMATTER = DateTimeFormatter.ofPattern("HH:mm");

    // Constructor that converts a Session Entity into a SessionDTO
    public SessionDTO(Session session) {
        this.id = session.getId();
        this.title = session.getTitle();
        
        // This is the fix for the LazyInitializationException.
        // It uses getName() from your User.java entity
        this.hostName = session.getHost() != null ? session.getHost().getName() : "Unknown Host";
        
        this.month = session.getMonth();
        this.day = session.getDay();
        this.year = session.getYear();
        this.location = session.getLocation();

        // Convert LocalTime objects to simple strings for the JSON payload
        if (session.getStartTime() != null) {
            this.startTime = session.getStartTime().format(TIME_FORMATTER);
        }
        if (session.getEndTime() != null) {
            this.endTime = session.getEndTime().format(TIME_FORMATTER);
        }
    }

    // Getters are required for Jackson (Spring's JSON converter)
    public Long getId() { return id; }
    public String getTitle() { return title; }
    public String getHostName() { return hostName; }
    public String getMonth() { return month; }
    public String getDay() { return day; }
    public String getYear() { return year; }
    public String getStartTime() { return startTime; }
    public String getEndTime() { return endTime; }
    public String getLocation() { return location; }
}