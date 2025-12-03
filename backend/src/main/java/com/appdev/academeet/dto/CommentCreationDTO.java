package com.appdev.academeet.dto;

/**
 * DTO for creating a new comment.
 * Includes optional replyToId for threaded discussions.
 */
public class CommentCreationDTO {
    private String content;
    private Long replyToId; // Optional: ID of parent comment for replies
    
    // Constructors
    public CommentCreationDTO() {
    }
    
    public CommentCreationDTO(String content, Long replyToId) {
        this.content = content;
        this.replyToId = replyToId;
    }
    
    // Getters and Setters
    public String getContent() {
        return content;
    }
    
    public void setContent(String content) {
        this.content = content;
    }
    
    public Long getReplyToId() {
        return replyToId;
    }
    
    public void setReplyToId(Long replyToId) {
        this.replyToId = replyToId;
    }
}
