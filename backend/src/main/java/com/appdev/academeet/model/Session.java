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

    @ManyToOne(fetch = FetchType.LAZY)
    // User entity's primary key column is mapped to "user_id"; make the FK reference that column
    @JoinColumn(name = "host_id_fk", referencedColumnName = "user_id")
    private User host;  // this is important

    private String month;
    private String day;
    private String year;

    @JsonFormat(pattern = "HH:mm")
    private LocalTime startTime;

    @JsonFormat(pattern = "HH:mm")
    private LocalTime endTime;

    private String location;

    @Column(columnDefinition = "TEXT")
    private String description;

    // Getters & setters
    public Long getId() { return id; }
    public String getTitle() { return title; }
    public User getHost() { return host; }
    public String getMonth() { return month; }
    public String getDay() { return day; }
    public String getYear() { return year; }
    public LocalTime getStartTime() { return startTime; }
    public LocalTime getEndTime() { return endTime; }
    public String getLocation() { return location; }
    public String getDescription() { return description; }

    public void setId(Long id) { this.id = id; }
    public void setTitle(String title) { this.title = title; }
    public void setHost(User host) { this.host = host; }
    public void setMonth(String month) { this.month = month; }
    public void setDay(String day) { this.day = day; }
    public void setYear(String year) { this.year = year; }
    public void setStartTime(LocalTime startTime) { this.startTime = startTime; }
    public void setEndTime(LocalTime endTime) { this.endTime = endTime; }
    public void setLocation(String location) { this.location = location; }
    public void setDescription(String description) { this.description = description; }
}
