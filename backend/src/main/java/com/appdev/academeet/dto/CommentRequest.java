package com.appdev.academeet.dto;

public class CommentRequest {
    private String content;
    private Long userId;
    private Long parentCommentId;

    public CommentRequest() {}

    public CommentRequest(String content, Long userId, Long parentCommentId) {
        this.content = content;
        this.userId = userId;
        this.parentCommentId = parentCommentId;
    }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
    
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    
    public Long getParentCommentId() { return parentCommentId; }
    public void setParentCommentId(Long parentCommentId) { this.parentCommentId = parentCommentId; }
}