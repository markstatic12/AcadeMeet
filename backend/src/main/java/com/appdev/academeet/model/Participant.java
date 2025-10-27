package com.appdev.academeet.model;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "participants")
public class Participant {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "participant_id")
    private Integer participantId;

    @Column(nullable = false)
    private String name;

    @ManyToMany
    @JoinTable(
        name = "participant_sessions",
        joinColumns = @JoinColumn(name = "participant_id"),
        inverseJoinColumns = @JoinColumn(name = "session_id")
    )
    private List<Session> enrolledSessions = new ArrayList<>();

    @Column(name = "join_date")
    private java.time.LocalDate joinDate;

    @Column
    private String status;

    public Participant() {}

    public Participant(Integer participantId, String name) {
        this.participantId = participantId;
        this.name = name;
    }

    // Minimal domain methods
    public String viewSessionDetails(Session session) {
        return session != null ? session.getSubject() : null;
    }

    public Integer getParticipantId() { return participantId; }
    public void setParticipantId(Integer participantId) { this.participantId = participantId; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public List<Session> getEnrolledSessions() { return enrolledSessions; }
    public void setEnrolledSessions(List<Session> enrolledSessions) { this.enrolledSessions = enrolledSessions; }
}
