package com.appdev.academeet.model;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;

@Entity
@Table(name = "session_comment")
public class Comment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "comment_id")
    private Long commentId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "session_id", nullable = false)
    private Session session;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "author_id", nullable = false)
    private User author;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String content;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reply_to")
    private Comment replyTo;

    @OneToMany(mappedBy = "replyTo", cascade = CascadeType.ALL)
    private List<Comment> replies = new ArrayList<>();

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    // Lifecycle Methods
    @PrePersist
    protected void onCreate() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
    }

    // Constructors
    public Comment() {}

    public Comment(Session session, User author, String content, Comment replyTo) {
        this.session = session;
        this.author = author;
        this.content = content;
        this.replyTo = replyTo;
    }

    // Getters
    public Long getCommentId() { return commentId; }
    public Session getSession() { return session; }
    public User getAuthor() { return author; }
    public String getContent() { return content; }
    public Comment getReplyTo() { return replyTo; }
    public List<Comment> getReplies() { return replies; }
    public LocalDateTime getCreatedAt() { return createdAt; }

    // Setters
    public void setCommentId(Long commentId) { this.commentId = commentId; }
    public void setSession(Session session) { this.session = session; }
    public void setAuthor(User author) { this.author = author; }
    public void setContent(String content) { this.content = content; }
    public void setReplyTo(Comment replyTo) { this.replyTo = replyTo; }
    public void setReplies(List<Comment> replies) { this.replies = replies; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    // Helper methods
    public int getReplyCount() {
        return replies != null ? replies.size() : 0;
    }

    // Backward compatibility
    @Deprecated
    public User getUser() { return author; }
    
    @Deprecated
    public void setUser(User user) { this.author = user; }
    
    @Deprecated
    public Comment getParentComment() { return replyTo; }
    
    @Deprecated
    public void setParentComment(Comment parentComment) { this.replyTo = parentComment; }
}