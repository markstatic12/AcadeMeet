package com.appdev.academeet.dto;

import java.time.LocalDateTime;

public class UserProfileResponse {
    private final Long id;
    private final String name;
    private final String email;
    private final String program;
    private final Integer yearLevel;
    private final String bio;
    private final String profilePic;
    private final String coverImage;
    private final LocalDateTime createdAt;
    private final Long followers;
    private final Long following;

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

    // Getters only 
    public Long getId() { return id; }
    public String getName() { return name; }
    public String getEmail() { return email; }
    public String getProgram() { return program; }
    public Integer getYearLevel() { return yearLevel; }
    public String getBio() { return bio; }
    public String getProfilePic() { return profilePic; }
    public String getCoverImage() { return coverImage; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public Long getFollowers() { return followers; }
    public Long getFollowing() { return following; }
}
