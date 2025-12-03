package com.appdev.academeet.dto;

/**
 * DTO for user registration.
 * Contains all data needed to create a new user account.
 */
public class UserRegistrationDTO {
    private String fullname;
    private String email;
    private String studentId;
    private String password; // Raw text password (will be hashed by service)
    private String program;
    private Integer yrLevel;
    
    // Constructors
    public UserRegistrationDTO() {
    }
    
    public UserRegistrationDTO(String fullname, String email, String studentId, String password, 
                              String program, Integer yrLevel) {
        this.fullname = fullname;
        this.email = email;
        this.studentId = studentId;
        this.password = password;
        this.program = program;
        this.yrLevel = yrLevel;
    }
    
    // Getters and Setters
    public String getFullname() {
        return fullname;
    }
    
    public void setFullname(String fullname) {
        this.fullname = fullname;
    }
    
    public String getEmail() {
        return email;
    }
    
    public void setEmail(String email) {
        this.email = email;
    }
    
    public String getStudentId() {
        return studentId;
    }
    
    public void setStudentId(String studentId) {
        this.studentId = studentId;
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
    
    public Integer getYrLevel() {
        return yrLevel;
    }
    
    public void setYrLevel(Integer yrLevel) {
        this.yrLevel = yrLevel;
    }
}
