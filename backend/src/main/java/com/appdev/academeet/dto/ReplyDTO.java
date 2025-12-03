package com.appdev.academeet.dto;

import java.time.LocalDateTime;

public class ReplyDTO {
    private Long commentId;
    private Long userId;
    private String userName;
    private String content;
    private LocalDateTime createdAt;

    public ReplyDTO() {}

    public ReplyDTO(Long commentId, Long userId, String userName, String content, 
                   LocalDateTime createdAt, Long replyingToUserId, String replyingToUserName) {
        this.commentId = commentId;
        this.userId = userId;
        this.userName = userName;
        this.content = content;
        this.createdAt = createdAt;
        // Note: replyingToUserId and replyingToUserName are ignored for simplicity
    }

    // Getters and Setters
    public Long getCommentId() { return commentId; }
    public void setCommentId(Long commentId) { this.commentId = commentId; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getUserName() { return userName; }
    public void setUserName(String userName) { this.userName = userName; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
