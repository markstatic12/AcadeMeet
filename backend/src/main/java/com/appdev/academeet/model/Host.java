package com.appdev.academeet.model;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "hosts")
public class Host {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "host_id")
    private Integer hostId;

    @Column(nullable = false)
    private String name;

    @OneToMany(mappedBy = "host", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Session> hostedSessions = new ArrayList<>();

    // Constructors
    public Host() {}

    public Host(Integer hostId, String name) {
        this.hostId = hostId;
        this.name = name;
    }

    @Column
    private String privileges;

    // Domain-like helper methods (placeholders)
    public void editSession(Session session, String newTitle, String newDescription) {
        if (session != null) {
            session.setSubject(newTitle);
            session.setDescription(newDescription);
        }
    }
    public void manageParticipants(Session session, Student student, String action) {
        // placeholder
    }
    public void endSession(Session session) {
        if (session != null) session.setStatus("ENDED");
    }

    // Getters and setters
    public Integer getHostId() { return hostId; }
    public void setHostId(Integer hostId) { this.hostId = hostId; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public List<Session> getHostedSessions() { return hostedSessions; }
    public void setHostedSessions(List<Session> hostedSessions) { this.hostedSessions = hostedSessions; }
}
