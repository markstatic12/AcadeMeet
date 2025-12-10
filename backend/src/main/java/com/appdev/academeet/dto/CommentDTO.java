package com.appdev.academeet.dto;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonInclude;

/**
 * Response DTO for comments with nested replies
 * Immutable after construction
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
public class CommentDTO {
    private final Long commentId;
    private final Long userId;
    private final String userName;
    private final String profilePic;
    private final String content;
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private final LocalDateTime createdAt;
    private final int replyCount;
    private List<ReplyDTO> replies;

    public CommentDTO(Long commentId, Long userId, String userName, String profilePic, String content, 
                     LocalDateTime createdAt, int replyCount) {
        this.commentId = commentId;
        this.userId = userId;
        this.userName = userName;
        this.profilePic = profilePic;
        this.content = content;
        this.createdAt = createdAt;
        this.replyCount = replyCount;
        this.replies = new ArrayList<>();
    }

    // Getters only (immutable)
    public Long getCommentId() { return commentId; }
    public Long getUserId() { return userId; }
    public String getUserName() { return userName; }
    public String getProfilePic() { return profilePic; }
    public String getContent() { return content; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public int getReplyCount() { return replyCount; }
    public List<ReplyDTO> getReplies() { return replies; }
    
    // Only setter needed for lazy-loading replies
    public void setReplies(List<ReplyDTO> replies) { 
        this.replies = replies == null ? new ArrayList<>() : new ArrayList<>(replies); 
    }
}
