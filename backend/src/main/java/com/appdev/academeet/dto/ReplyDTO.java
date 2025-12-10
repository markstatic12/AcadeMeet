package com.appdev.academeet.dto;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonInclude;

/**
 * Response DTO for comment replies
 * Immutable after construction
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ReplyDTO {
    private final Long commentId;
    private final Long userId;
    private final String userName;
    private final String profilePic;
    private final String content;
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private final LocalDateTime createdAt;
    private final Long replyingToUserId;
    private final String replyingToUserName;

    public ReplyDTO(Long commentId, Long userId, String userName, String profilePic, String content, 
                   LocalDateTime createdAt, Long replyingToUserId, String replyingToUserName) {
        this.commentId = commentId;
        this.userId = userId;
        this.userName = userName;
        this.profilePic = profilePic;
        this.content = content;
        this.createdAt = createdAt;
        this.replyingToUserId = replyingToUserId;
        this.replyingToUserName = replyingToUserName;
    }

    // Getters only (immutable)
    public Long getCommentId() { return commentId; }
    public Long getUserId() { return userId; }
    public String getUserName() { return userName; }
    public String getProfilePic() { return profilePic; }
    public String getContent() { return content; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public Long getReplyingToUserId() { return replyingToUserId; }
    public String getReplyingToUserName() { return replyingToUserName; }
}
