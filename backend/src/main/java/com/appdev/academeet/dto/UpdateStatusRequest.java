package com.appdev.academeet.dto;

import com.appdev.academeet.model.SessionStatus;

import jakarta.validation.constraints.NotNull;

public class UpdateStatusRequest {
    @NotNull(message = "Status is required")
    private SessionStatus status;

    public UpdateStatusRequest() {}

    public UpdateStatusRequest(SessionStatus status) {
        this.status = status;
    }

    public SessionStatus getStatus() { return status; }
    public void setStatus(SessionStatus status) { this.status = status; }
}