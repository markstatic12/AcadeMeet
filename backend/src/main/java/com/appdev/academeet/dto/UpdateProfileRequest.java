package com.appdev.academeet.dto;

public class UpdateProfileRequest {
    private String name;
    private String school;
    private String studentId;
    private String bio;
    
    // Constructors
    public UpdateProfileRequest() {
    }
    
    public UpdateProfileRequest(String name, String school, String studentId, String bio) {
        this.name = name;
        this.school = school;
        this.studentId = studentId;
        this.bio = bio;
    }
    
    // Getters and Setters
    public String getName() {
        return name;
    }
    
    public void setName(String name) {
        this.name = name;
    }
    
    public String getSchool() {
        return school;
    }
    
    public void setSchool(String school) {
        this.school = school;
    }
    
    public String getStudentId() {
        return studentId;
    }
    
    public void setStudentId(String studentId) {
        this.studentId = studentId;
    }
    
    public String getBio() {
        return bio;
    }
    
    public void setBio(String bio) {
        this.bio = bio;
    }
}
