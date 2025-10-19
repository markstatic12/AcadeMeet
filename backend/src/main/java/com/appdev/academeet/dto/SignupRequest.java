package com.appdev.academeet.dto;

public class SignupRequest {
    private String name;
    private String email;
    private String password;
    private String program;
    private Integer yearLevel;
    
    // Constructors
    public SignupRequest() {
    }
    
    public SignupRequest(String name, String email, String password, String program, Integer yearLevel) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.program = program;
        this.yearLevel = yearLevel;
    }
    
    // Getters and Setters
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
    
    public String getPassword() {
        return password;
    }
    
    public void setPassword(String password) {
        this.password = password;
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
}
