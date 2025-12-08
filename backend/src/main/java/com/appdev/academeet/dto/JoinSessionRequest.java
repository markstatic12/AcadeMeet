package com.appdev.academeet.dto;

import jakarta.validation.constraints.Size;

public class JoinSessionRequest {
    @Size(min = 6, message = "Password must be at least 6 characters long")
    private String password;

    public JoinSessionRequest() {}

    public JoinSessionRequest(String password) {
        this.password = password;
    }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
}