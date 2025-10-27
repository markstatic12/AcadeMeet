package com.appdev.academeet.model;

import jakarta.persistence.Column;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@DiscriminatorValue("PARTICIPANT")
public class Participant extends Student {
    
    @Column(name = "join_date")
    private LocalDate joinDate;
    
    @Column(name = "status")
    private String status;
    
    @ManyToMany
    @JoinTable(
        name = "session_participants",
        joinColumns = @JoinColumn(name = "student_id"),
        inverseJoinColumns = @JoinColumn(name = "session_id")
    )
    private List<Session> enrolledSessions = new ArrayList<>();
    
    // Constructors
    public Participant() {
        super();
    }
    
    public Participant(String name, String email, String password, String program, Integer yearLevel) {
        super(name, email, password, program, yearLevel);
    }
    
    // Getters and Setters
    public LocalDate getJoinDate() {
        return joinDate;
    }
    
    public void setJoinDate(LocalDate joinDate) {
        this.joinDate = joinDate;
    }
    
    public String getStatus() {
        return status;
    }
    
    public void setStatus(String status) {
        this.status = status;
    }
    
    public List<Session> getEnrolledSessions() {
        return enrolledSessions;
    }
    
    public void setEnrolledSessions(List<Session> enrolledSessions) {
        this.enrolledSessions = enrolledSessions;
    }
    
    // Helper methods
    public void enrollInSession(Session session) {
        this.enrolledSessions.add(session);
        session.getParticipants().add(this);
    }
    
    public void withdrawFromSession(Session session) {
        this.enrolledSessions.remove(session);
        session.getParticipants().remove(this);
    }
    
    @Override
    public String toString() {
        return "Participant{" +
                "id=" + getId() +
                ", name='" + getName() + '\'' +
                ", email='" + getEmail() + '\'' +
                ", program='" + getProgram() + '\'' +
                ", yearLevel=" + getYearLevel() +
                ", joinDate=" + joinDate +
                ", status='" + status + '\'' +
                '}';
    }
}
