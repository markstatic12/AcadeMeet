package com.appdev.academeet.dto;

// We will expand this class later.
// It will contain all the data for a single session.
public class SessionResponse {

    private Long id;
    private String title;
    private String message; // For success/error messages

    // Constructors, Getters, and Setters
    
    public SessionResponse(Long id, String title, String message) {
        this.id = id;
        this.title = title;
        this.message = message;
    }
    
    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }
    public String getTitle() {
        return title;
    }
    public void setTitle(String title) {
        this.title = title;
    }
    public String getMessage() {
        return message;
    }
    public void setMessage(String message) {
        this.message = message;
    }
}