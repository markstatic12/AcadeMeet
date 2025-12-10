package com.appdev.academeet.dto;

import com.fasterxml.jackson.annotation.JsonInclude;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * Request DTO for creating comments and replies
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
public class CommentRequest {
    @NotBlank(message = "Comment content is required")
    @Size(min = 1, max = 2000, message = "Comment must be between 1 and 2000 characters")
    private String content;

    public CommentRequest() {}

    public CommentRequest(String content) {
        this.content = content;
    }

    public String getContent() { 
        return content; 
    }
    
    public void setContent(String content) { 
        this.content = content == null ? null : content.trim(); 
    }
}
