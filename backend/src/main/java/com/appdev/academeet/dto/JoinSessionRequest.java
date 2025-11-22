package com.appdev.academeet.dto;

public class JoinSessionRequest {
    private String password;
    private Long userId;

    public JoinSessionRequest() {}

    public JoinSessionRequest(String password, Long userId) {
        this.password = password;
        this.userId = userId;
    }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
}