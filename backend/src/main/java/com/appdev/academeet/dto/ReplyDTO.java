package com.appdev.academeet.dto;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonInclude;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class ReplyDTO {
    private Long commentId;
    private Long userId;
    private String userName;
    private String profilePic;
    private String content;
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime createdAt;
    private Long replyingToUserId;
    private String replyingToUserName;

    public ReplyDTO() {}

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

    // Getters and Setters
    public Long getCommentId() { return commentId; }
    public void setCommentId(Long commentId) { this.commentId = commentId; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getUserName() { return userName; }
    public void setUserName(String userName) { this.userName = userName; }

    public String getProfilePic() { return profilePic; }
    public void setProfilePic(String profilePic) { this.profilePic = profilePic; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public Long getReplyingToUserId() { return replyingToUserId; }
    public void setReplyingToUserId(Long replyingToUserId) { this.replyingToUserId = replyingToUserId; }

    public String getReplyingToUserName() { return replyingToUserName; }
    public void setReplyingToUserName(String replyingToUserName) { this.replyingToUserName = replyingToUserName; }
}
