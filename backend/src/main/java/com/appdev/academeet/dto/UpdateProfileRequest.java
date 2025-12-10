package com.appdev.academeet.dto;

import jakarta.validation.constraints.Size;

public class UpdateProfileRequest {
    @Size(min = 2, max = 100, message = "Name must be between 2 and 100 characters")
    private String name;
    
    private String school;
    
    @Size(min = 2, max = 200, message = "Program must be between 2 and 200 characters")
    private String program;
    private String studentId;
    private String bio;
    private Integer yearLevel;
    private String profilePic; // allow updating avatar as data URL or URL
    private String coverImage; // allow updating cover image
    
    // Constructors
    public UpdateProfileRequest() {
    }
    
    public UpdateProfileRequest(String name, String school, String program, String studentId, String bio, Integer yearLevel) {
        this.name = name;
        this.school = school;
        this.program = program;
        this.studentId = studentId;
        this.bio = bio;
        this.yearLevel = yearLevel;
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
    
    public String getProgram() {
        return program;
    }
    
    public void setProgram(String program) {
        this.program = program;
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

    public String getCoverImage() {
        return coverImage;
    }

    public void setCoverImage(String coverImage) {
        this.coverImage = coverImage;
    }
}
