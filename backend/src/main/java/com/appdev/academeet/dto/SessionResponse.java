package com.appdev.academeet.dto;

// We will expand this class later.
// It will contain all the data for a single session.
public class SessionResponse {

    private Long id;
    private String title;
    private String message; // For success/error messages

    // Constructor
    public SessionResponse(Long id, String title, String message) {
        this.id = id;
        this.title = title;
        this.message = message;
    }

    // ======================
    // Getters
    // ======================
    public Long getId() { return id; }
    public String getTitle() { return title; }
    public String getMessage() { return message; }

    // ======================
    // Setters
    // ======================
    public void setId(Long id) { this.id = id; }
    public void setTitle(String title) { this.title = title; }
    public void setMessage(String message) { this.message = message; }
}
