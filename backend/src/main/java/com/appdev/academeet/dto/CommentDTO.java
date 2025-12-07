package com.appdev.academeet.dto;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonInclude;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class CommentDTO {
    private Long commentId;
    private Long userId;
    private String userName;
    private String content;
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime createdAt;
    private int replyCount = 0;
    private List<ReplyDTO> replies = new ArrayList<>();

    public CommentDTO() {}

    public CommentDTO(Long commentId, Long userId, String userName, String content, 
                     LocalDateTime createdAt, int replyCount) {
        this.commentId = commentId;
        this.userId = userId;
        this.userName = userName;
        this.content = content;
        this.createdAt = createdAt;
        this.replyCount = replyCount;
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

    public int getReplyCount() { return replyCount; }
    public void setReplyCount(int replyCount) { this.replyCount = replyCount; }

    public List<ReplyDTO> getReplies() { return Collections.unmodifiableList(replies); }
    public void setReplies(List<ReplyDTO> replies) { this.replies = replies == null ? new ArrayList<>() : new ArrayList<>(replies); }
}
