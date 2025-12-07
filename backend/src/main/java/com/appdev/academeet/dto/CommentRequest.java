package com.appdev.academeet.dto;


import com.fasterxml.jackson.annotation.JsonInclude;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class CommentRequest {
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
