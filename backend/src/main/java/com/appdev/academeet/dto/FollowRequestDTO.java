package com.appdev.academeet.dto;

public class FollowRequestDTO {
    private Long followingId;

    public FollowRequestDTO() {
    }
    
    public FollowRequestDTO(Long followingId) {
        this.followingId = followingId;
    }
    
    public Long getFollowingId() {
        return followingId;
    }
    
    public void setFollowingId(Long followingId) {
        this.followingId = followingId;
    }
}