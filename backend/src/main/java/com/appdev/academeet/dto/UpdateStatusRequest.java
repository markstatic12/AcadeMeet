package com.appdev.academeet.dto;

import com.appdev.academeet.model.SessionStatus;

public class UpdateStatusRequest {
    private SessionStatus status;

    public UpdateStatusRequest() {}

    public UpdateStatusRequest(SessionStatus status) {
        this.status = status;
    }

    public SessionStatus getStatus() { return status; }
    public void setStatus(SessionStatus status) { this.status = status; }
}