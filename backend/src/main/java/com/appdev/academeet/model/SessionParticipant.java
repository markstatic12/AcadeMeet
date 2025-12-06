package com.appdev.academeet.model;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.MapsId;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;

@Entity
@Table(name = "session_participant", indexes = {
    @Index(name = "idx_participant_id", columnList = "participant_id")
})
public class SessionParticipant {

    @EmbeddedId
    private SessionParticipantId id;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("sessionId")
    @JoinColumn(name = "session_id", nullable = false)
    private Session session;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("participantId")
    @JoinColumn(name = "participant_id", referencedColumnName = "user_id", nullable = false)
    private User user;

    @Column(name = "joined_at")
    private LocalDateTime joinedAt;

    @PrePersist
    protected void onCreate() {
        joinedAt = LocalDateTime.now();
    }

    public SessionParticipant() {
    }

    public SessionParticipant(Session session, User user) {
        this.id = new SessionParticipantId(session.getId(), user.getId());
        this.session = session;
        this.user = user;
    }

    public SessionParticipantId getId() {
        return id;
    }

    public void setId(SessionParticipantId id) {
        this.id = id;
    }

    public Session getSession() {
        return session;
    }

    public void setSession(Session session) {
        this.session = session;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public LocalDateTime getJoinedAt() {
        return joinedAt;
    }

    public void setJoinedAt(LocalDateTime joinedAt) {
        this.joinedAt = joinedAt;
    }

    @Override
    public String toString() {
        return "SessionParticipant{" +
                "id=" + id +
                ", sessionId=" + (session != null ? session.getId() : null) +
                ", userId=" + (user != null ? user.getId() : null) +
                ", joinedAt=" + joinedAt +
                '}';
    }
}
