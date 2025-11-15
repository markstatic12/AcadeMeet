package com.appdev.academeet.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import java.time.LocalTime;

@Entity
@Table(name = "sessions")
public class Session {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String host;

    @Column(name = "creator_user_id")
    private Long creatorId;

    private String month;
    private String day;
    private String year;

    @JsonFormat(pattern = "HH:mm")
    private LocalTime startTime;
    @JsonFormat(pattern = "HH:mm")
    private LocalTime endTime;

    private String location;

    @Column(columnDefinition = "TEXT")
    private String additionalNotes;

    @Column(columnDefinition = "TEXT")
    private String description;

    // --- GETTERS & SETTERS ---

    public Long getId() { return id; }

    public void setId(Long id) { this.id = id; }
    
    public Long getCreatorId() { return creatorId; }
    
    public void setCreatorId(Long creatorId) { this.creatorId = creatorId; }

    public String getTitle() { return title; }

    public void setTitle(String title) { this.title = title; }

    public String getHost() { return host; }

    public void setHost(String host) { this.host = host; }

    public String getMonth() { return month; }

    public void setMonth(String month) { this.month = month; }

    public String getDay() { return day; }

    public void setDay(String day) { this.day = day; }

    public String getYear() { return year; }

    public void setYear(String year) { this.year = year; }

    public LocalTime getStartTime() { return startTime; }

    public void setStartTime(LocalTime startTime) { this.startTime = startTime; }

    public LocalTime getEndTime() { return endTime; }

    public void setEndTime(LocalTime endTime) { this.endTime = endTime; }

    public String getLocation() { return location; }

    public void setLocation(String location) { this.location = location; }

    public String getAdditionalNotes() { return additionalNotes; }

    public void setAdditionalNotes(String additionalNotes) { this.additionalNotes = additionalNotes; }

    public String getDescription() { return description; }

    public void setDescription(String description) { this.description = description; }
}
