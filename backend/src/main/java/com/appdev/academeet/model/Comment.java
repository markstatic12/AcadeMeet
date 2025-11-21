package com.appdev.academeet.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "comments")
public class Comment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "comment_id")
    private Long commentId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "session_id", nullable = false)
    private Session session;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String content;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_comment_id")
    private Comment parentComment;

    @OneToMany(mappedBy = "parentComment", cascade = CascadeType.ALL)
    private List<Comment> replies = new ArrayList<>();

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "is_edited")
    private boolean isEdited = false;

    @Column(name = "reply_count")
    private Integer replyCount = 0;

    // Lifecycle Methods
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
        isEdited = true;
    }

    // Constructors
    public Comment() {}

    public Comment(Session session, User user, String content, Comment parentComment) {
        this.session = session;
        this.user = user;
        this.content = content;
        this.parentComment = parentComment;
    }

    // Getters
    public Long getCommentId() { return commentId; }
    public Session getSession() { return session; }
    public User getUser() { return user; }
    public String getContent() { return content; }
    public Comment getParentComment() { return parentComment; }
    public List<Comment> getReplies() { return replies; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public boolean isEdited() { return isEdited; }
    public Integer getReplyCount() { return replyCount; }

    // Setters
    public void setCommentId(Long commentId) { this.commentId = commentId; }
    public void setSession(Session session) { this.session = session; }
    public void setUser(User user) { this.user = user; }
    public void setContent(String content) { this.content = content; }
    public void setParentComment(Comment parentComment) { this.parentComment = parentComment; }
    public void setReplies(List<Comment> replies) { this.replies = replies; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    public void setEdited(boolean edited) { this.isEdited = edited; }
    public void setReplyCount(Integer replyCount) { this.replyCount = replyCount; }

    // Helper methods
    public void incrementReplyCount() {
        this.replyCount++;
    }

    public void decrementReplyCount() {
        if (this.replyCount > 0) {
            this.replyCount--;
        }
    }
}