package com.appdev.academeet.model;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;

@Entity
@Table(name = "followers", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"follower_id", "following_id"})
})
public class Follower {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "follow_id")
    private Long followId;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "follower_id", nullable = false)
    private Student follower;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "following_id", nullable = false)
    private Student following;
    
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
    
    public Follower() {
    }
    
    public Follower(Student follower, Student following) {
        this.follower = follower;
        this.following = following;
    }
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
    
    public Long getFollowId() {
        return followId;
    }
    
    public void setFollowId(Long followId) {
        this.followId = followId;
    }
    
    public Student getFollower() {
        return follower;
    }
    
    public void setFollower(Student follower) {
        this.follower = follower;
    }
    
    public Student getFollowing() {
        return following;
    }
    
    public void setFollowing(Student following) {
        this.following = following;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    @Override
    public String toString() {
        return "Follower{" +
                "followId=" + followId +
                ", createdAt=" + createdAt +
                '}';
    }
}
