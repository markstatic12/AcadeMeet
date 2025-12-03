package com.appdev.academeet.dto;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import com.appdev.academeet.model.Comment;

/**
 * DTO for comment response with threaded structure.
 * Includes author information and nested replies.
 */
public class CommentResponseDTO {
    private Long commentId;
    private String content;
    private UserSummaryDTO author;
    private LocalDateTime createdAt;
    private List<CommentResponseDTO> replies;
    
    // Constructors
    public CommentResponseDTO() {
        this.replies = new ArrayList<>();
    }
    
    public CommentResponseDTO(Comment comment) {
        this.commentId = comment.getCommentId();
        this.content = comment.getContent();
        this.createdAt = comment.getCreatedAt();
        
        // Map author to UserSummaryDTO
        if (comment.getAuthor() != null) {
            this.author = new UserSummaryDTO(
                comment.getAuthor().getId(),
                comment.getAuthor().getName(),
                comment.getAuthor().getProfileImageUrl(),
                comment.getAuthor().getProgram(),
                comment.getAuthor().getBio()
            );
        }
        
        // Map replies recursively
        if (comment.getReplies() != null) {
            this.replies = comment.getReplies().stream()
                .map(CommentResponseDTO::new)
                .collect(Collectors.toList());
        } else {
            this.replies = new ArrayList<>();
        }
    }
    
    // Getters and Setters
    public Long getCommentId() {
        return commentId;
    }
    
    public void setCommentId(Long commentId) {
        this.commentId = commentId;
    }
    
    public String getContent() {
        return content;
    }
    
    public void setContent(String content) {
        this.content = content;
    }
    
    public UserSummaryDTO getAuthor() {
        return author;
    }
    
    public void setAuthor(UserSummaryDTO author) {
        this.author = author;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    public List<CommentResponseDTO> getReplies() {
        return replies;
    }
    
    public void setReplies(List<CommentResponseDTO> replies) {
        this.replies = replies;
    }
}
