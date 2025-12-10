package com.appdev.academeet.model;

import java.io.Serializable;
import java.util.Objects;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;

@Embeddable
public class SessionParticipantId implements Serializable {

    @Column(name = "session_id")
    private Long sessionId;

    @Column(name = "participant_id")
    private Long participantId;

    public SessionParticipantId() {
    }

    public SessionParticipantId(Long sessionId, Long participantId) {
        this.sessionId = sessionId;
        this.participantId = participantId;
    }

    public Long getSessionId() {
        return sessionId;
    }

    public void setSessionId(Long sessionId) {
        this.sessionId = sessionId;
    }

    public Long getParticipantId() {
        return participantId;
    }

    public void setParticipantId(Long participantId) {
        this.participantId = participantId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        SessionParticipantId that = (SessionParticipantId) o;
        return Objects.equals(sessionId, that.sessionId) &&
               Objects.equals(participantId, that.participantId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(sessionId, participantId);
    }
}
