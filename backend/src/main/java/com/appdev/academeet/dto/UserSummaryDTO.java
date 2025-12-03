package com.appdev.academeet.dto;

/**
 * DTO for lightweight user summary.
 * Used when user profile is nested inside another resource (e.g., session host, comment author).
 */
public class UserSummaryDTO {
    private Long userId;
    private String fullname;
    private String profileImageUrl;
    private String program;
    private String bio;
    
    // Constructors
    public UserSummaryDTO() {
    }
    
    public UserSummaryDTO(Long userId, String fullname, String profileImageUrl, String program, String bio) {
        this.userId = userId;
        this.fullname = fullname;
        this.profileImageUrl = profileImageUrl;
        this.program = program;
        this.bio = bio;
    }
    
    // Getters and Setters
    public Long getUserId() {
        return userId;
    }
    
    public void setUserId(Long userId) {
        this.userId = userId;
    }
    
    public String getFullname() {
        return fullname;
    }
    
    public void setFullname(String fullname) {
        this.fullname = fullname;
    }
    
    public String getProfileImageUrl() {
        return profileImageUrl;
    }
    
    public void setProfileImageUrl(String profileImageUrl) {
        this.profileImageUrl = profileImageUrl;
    }
    
    public String getProgram() {
        return program;
    }
    
    public void setProgram(String program) {
        this.program = program;
    }
    
    public String getBio() {
        return bio;
    }
    
    public void setBio(String bio) {
        this.bio = bio;
    }
}
