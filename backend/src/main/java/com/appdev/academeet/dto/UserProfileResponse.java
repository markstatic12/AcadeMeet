package com.appdev.academeet.dto;

import java.time.LocalDateTime;

/**
 * Generic response DTO for user profile information.
 * Used to avoid manual Map creation in controllers.
 */
public class UserProfileResponse {
    private Long id;
    private String name;
    private String email;
    private String program;
    private Integer yearLevel;
    private String bio;
    private String profilePic;
    private String coverImage;
    private LocalDateTime createdAt;
    private Long followers;
    private Long following;

    // Constructors
    public UserProfileResponse() {}

    public UserProfileResponse(Long id, String name, String email, String program, Integer yearLevel,
                               String bio, String profilePic, String coverImage, LocalDateTime createdAt,
                               Long followers, Long following) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.program = program;
        this.yearLevel = yearLevel;
        this.bio = bio;
        this.profilePic = profilePic;
        this.coverImage = coverImage;
        this.createdAt = createdAt;
        this.followers = followers;
        this.following = following;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getProgram() { return program; }
    public void setProgram(String program) { this.program = program; }

    public Integer getYearLevel() { return yearLevel; }
    public void setYearLevel(Integer yearLevel) { this.yearLevel = yearLevel; }

    public String getBio() { return bio; }
    public void setBio(String bio) { this.bio = bio; }

    public String getProfilePic() { return profilePic; }
    public void setProfilePic(String profilePic) { this.profilePic = profilePic; }

    public String getCoverImage() { return coverImage; }
    public void setCoverImage(String coverImage) { this.coverImage = coverImage; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public Long getFollowers() { return followers; }
    public void setFollowers(Long followers) { this.followers = followers; }

    public Long getFollowing() { return following; }
    public void setFollowing(Long following) { this.following = following; }
}
