package com.appdev.academeet.dto;

public class JoinSessionRequest {
    private String password;

    public JoinSessionRequest() {}

    public JoinSessionRequest(String password) {
        this.password = password;
    }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
}