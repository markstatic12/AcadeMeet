package com.appdev.academeet.dto;

public class AuthResponse {
    private Long id;
    private String name;
    private String email;
    private String program;
    private Integer yearLevel;
    private String message;
    
    // Constructors
    public AuthResponse() {
    }
    
    public AuthResponse(Long id, String name, String email, String program, Integer yearLevel, String message) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.program = program;
        this.yearLevel = yearLevel;
        this.message = message;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
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
    
    public String getProgram() {
        return program;
    }
    
    public void setProgram(String program) {
        this.program = program;
    }
    
    public Integer getYearLevel() {
        return yearLevel;
    }
    
    public void setYearLevel(Integer yearLevel) {
        this.yearLevel = yearLevel;
    }
    
    public String getMessage() {
        return message;
    }
    
    public void setMessage(String message) {
        this.message = message;
    }
}
