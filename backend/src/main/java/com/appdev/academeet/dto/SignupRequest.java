package com.appdev.academeet.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class SignupRequest {
    @NotBlank(message = "Name is required")
    @Size(min = 2, max = 100, message = "Name must be between 2 and 100 characters")
    private String name;
    
    @NotBlank(message = "Email is required")
    @Email(message = "Email must be valid")
    private String email;
    
    @NotBlank(message = "Password is required")
    @Size(min = 6, message = "Password must be at least 6 characters")
    private String password;
    
    @NotBlank(message = "Program is required")
    private String program;
    
    @NotNull(message = "Year level is required")
    private Integer yearLevel;
    private String profilePic;
    
    public SignupRequest() {
    }
    
    public SignupRequest(String name, String email, String password, String program, Integer yearLevel, String profilePic) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.program = program;
        this.yearLevel = yearLevel;
        this.profilePic = profilePic;
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
    
    public String getProfilePic() {
        return profilePic;
    }
    
    public void setProfilePic(String profilePic) {
        this.profilePic = profilePic;
    }
}
