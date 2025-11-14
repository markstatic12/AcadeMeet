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
@Table(name = "comment_reactions", 
       uniqueConstraints = @UniqueConstraint(columnNames = {"comment_id", "user_id", "reaction_type"}))
public class CommentReaction {
    
    // Reaction Type Constants
    public static final String LIKE = "LIKE";
    public static final String LOVE = "LOVE";
    public static final String LAUGH = "LAUGH";
    public static final String HELPFUL = "HELPFUL";
    public static final String CONFUSED = "CONFUSED";
    public static final String CELEBRATE = "CELEBRATE";
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "reaction_id")
    private Long reactionId;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "comment_id", nullable = false)
    private Comment comment;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @Column(name = "reaction_type", nullable = false, length = 20)
    private String reactionType;
    
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
    
    public CommentReaction() {
    }
    
    public CommentReaction(Comment comment, User user, String reactionType) {
        this.comment = comment;
        this.user = user;
        this.reactionType = reactionType;
    }
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
    
    public Long getReactionId() {
        return reactionId;
    }
    
    public void setReactionId(Long reactionId) {
        this.reactionId = reactionId;
    }
    
    public Comment getComment() {
        return comment;
    }
    
    public void setComment(Comment comment) {
        this.comment = comment;
    }
    
    public User getUser() {
        return user;
    }
    
    public void setUser(User user) {
        this.user = user;
    }
    
    public String getReactionType() {
        return reactionType;
    }
    
    public void setReactionType(String reactionType) {
        this.reactionType = reactionType;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    public boolean isLike() {
        return LIKE.equals(reactionType);
    }
    
    public boolean isLove() {
        return LOVE.equals(reactionType);
    }
    
    public boolean isLaugh() {
        return LAUGH.equals(reactionType);
    }
    
    public boolean isHelpful() {
        return HELPFUL.equals(reactionType);
    }
    
    public boolean isConfused() {
        return CONFUSED.equals(reactionType);
    }
    
    public boolean isCelebrate() {
        return CELEBRATE.equals(reactionType);
    }
    
    @Override
    public String toString() {
        return "CommentReaction{" +
                "reactionId=" + reactionId +
                ", reactionType='" + reactionType + '\'' +
                ", createdAt=" + createdAt +
                '}';
    }
}
