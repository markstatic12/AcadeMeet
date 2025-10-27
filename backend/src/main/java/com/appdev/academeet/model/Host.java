package com.appdev.academeet.model;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@DiscriminatorValue("HOST")
public class Host extends Student {
    
    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(
        name = "host_privileges", 
        joinColumns = @JoinColumn(name = "student_id")
    )
    @Column(name = "privilege")
    private List<String> privileges = new ArrayList<>();
    
    @OneToMany(mappedBy = "host", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Session> hostedSessions = new ArrayList<>();
    
    // Constructors
    public Host() {
        super();
    }
    
    public Host(String name, String email, String password, String program, Integer yearLevel) {
        super(name, email, password, program, yearLevel);
    }
    
    // Getters and Setters
    public List<String> getPrivileges() {
        return privileges;
    }
    
    public void setPrivileges(List<String> privileges) {
        this.privileges = privileges;
    }
    
    public List<Session> getHostedSessions() {
        return hostedSessions;
    }
    
    public void setHostedSessions(List<Session> hostedSessions) {
        this.hostedSessions = hostedSessions;
    }
    
    // Helper methods
    public void addPrivilege(String privilege) {
        this.privileges.add(privilege);
    }
    
    public void removePrivilege(String privilege) {
        this.privileges.remove(privilege);
    }
    
    public void addHostedSession(Session session) {
        this.hostedSessions.add(session);
        session.setHost(this);
    }
    
    public void removeHostedSession(Session session) {
        this.hostedSessions.remove(session);
        session.setHost(null);
    }
    
    @Override
    public String toString() {
        return "Host{" +
                "id=" + getId() +
                ", name='" + getName() + '\'' +
                ", email='" + getEmail() + '\'' +
                ", program='" + getProgram() + '\'' +
                ", yearLevel=" + getYearLevel() +
                ", privileges=" + privileges +
                '}';
    }
}