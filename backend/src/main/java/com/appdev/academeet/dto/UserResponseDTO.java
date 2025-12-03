package com.appdev.academeet.dto;

/**
 * DTO for full user profile response.
 * Returned to authenticated user for their own profile (/api/users/me).
 * Does NOT include password hash for security.
 */
public class UserResponseDTO {
    private Long userId;
    private String fullname;
    private String email;
    private String studentId;
    private String program;
    private Integer yrLevel;
    private String bio;
    private String profileImageUrl;
    
    // Constructors
    public UserResponseDTO() {
    }
    
    public UserResponseDTO(Long userId, String fullname, String email, String studentId, 
                          String program, Integer yrLevel, String bio, String profileImageUrl) {
        this.userId = userId;
        this.fullname = fullname;
        this.email = email;
        this.studentId = studentId;
        this.program = program;
        this.yrLevel = yrLevel;
        this.bio = bio;
        this.profileImageUrl = profileImageUrl;
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
    
    public String getBio() {
        return bio;
    }
    
    public void setBio(String bio) {
        this.bio = bio;
    }
    
    public String getProfileImageUrl() {
        return profileImageUrl;
    }
    
    public void setProfileImageUrl(String profileImageUrl) {
        this.profileImageUrl = profileImageUrl;
    }
}
