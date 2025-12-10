package com.appdev.academeet.model;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.MapsId;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;

@Entity
@Table(name = "user_follow", indexes = {
    @Index(name = "idx_user_follow_followers", columnList = "following_id"),
    @Index(name = "idx_user_follow_following", columnList = "follower_id")
})
public class UserFollow {

    @EmbeddedId
    private UserFollowId id;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("followerId")
    @JoinColumn(name = "follower_id", referencedColumnName = "user_id", nullable = false)
    private User follower;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("followingId")
    @JoinColumn(name = "following_id", referencedColumnName = "user_id", nullable = false)
    private User following;

    @Column(name = "followed_at")
    private LocalDateTime followedAt;

    @PrePersist
    protected void onCreate() {
        if (followedAt == null) {
            followedAt = LocalDateTime.now();
        }
    }

    public UserFollow() {
    }

    public UserFollow(User follower, User following) {
        this.id = new UserFollowId(follower.getId(), following.getId());
        this.follower = follower;
        this.following = following;
    }

    public UserFollowId getId() {
        return id;
    }

    public void setId(UserFollowId id) {
        this.id = id;
    }

    public User getFollower() {
        return follower;
    }

    public void setFollower(User follower) {
        this.follower = follower;
    }

    public User getFollowing() {
        return following;
    }

    public void setFollowing(User following) {
        this.following = following;
    }

    public LocalDateTime getFollowedAt() {
        return followedAt;
    }

    public void setFollowedAt(LocalDateTime followedAt) {
        this.followedAt = followedAt;
    }

    @Override
    public String toString() {
        return "UserFollow{" +
                "id=" + id +
                ", followerId=" + (follower != null ? follower.getId() : null) +
                ", followingId=" + (following != null ? following.getId() : null) +
                ", followedAt=" + followedAt +
                '}';
    }
}