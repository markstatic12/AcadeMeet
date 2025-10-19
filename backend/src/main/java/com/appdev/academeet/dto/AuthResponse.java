package com.appdev.academeet.dto;

public class AuthResponse {
    private Long userId;
    private String name;
    private String email;
    private String message;
    
    // Constructors
    public AuthResponse() {
    }
    
    public AuthResponse(Long userId, String name, String email, String message) {
        this.userId = userId;
        this.name = name;
        this.email = email;
        this.message = message;
    }
    
    // Getters and Setters
    public Long getUserId() {
        return userId;
    }
    
    public void setUserId(Long userId) {
        this.userId = userId;
    }
    
    public String getName() {
        return name;
    }
    
    public void setName(String name) {
        this.name = name;
    }
    
    public String getEmail() {
        return email;
    }
    
    public void setEmail(String email) {
        this.email = email;
    }
    
    public String getMessage() {
        return message;
    }
    
    public void setMessage(String message) {
        this.message = message;
    }
}
