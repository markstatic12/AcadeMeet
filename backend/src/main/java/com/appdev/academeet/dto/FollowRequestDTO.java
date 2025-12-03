package com.appdev.academeet.dto;

/**
 * DTO for follow requests.
 * Used when a user wants to follow another user.
 */
public class FollowRequestDTO {
    private Long followingId; // The ID of the user to be followed
    
    // Constructors
    public FollowRequestDTO() {
    }
    
    public FollowRequestDTO(Long followingId) {
        this.followingId = followingId;
    }
    
    // Getters and Setters
    public Long getFollowingId() {
        return followingId;
    }
    
    public void setFollowingId(Long followingId) {
        this.followingId = followingId;
    }
}
