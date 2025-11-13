package com.appdev.academeet.model;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;

@Entity
@Table(name = "reminders")
public class Reminder {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "reminder_id")
    private Long reminderId;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "session_id", nullable = false)
    private Session session;
    
    @Column(name = "reminder_time", nullable = false)
    private LocalDateTime reminderTime;
    
    @Column(name = "is_sent")
    private Boolean isSent = false;
    
    @Column(name = "sent_at")
    private LocalDateTime sentAt;
    
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
    
    public Reminder() {
    }
    
    public Reminder(Student student, Session session, LocalDateTime reminderTime) {
        this.student = student;
        this.session = session;
        this.reminderTime = reminderTime;
    }
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
    
    public Long getReminderId() {
        return reminderId;
    }
    
    public void setReminderId(Long reminderId) {
        this.reminderId = reminderId;
    }
    
    public Student getStudent() {
        return student;
    }
    
    public void setStudent(Student student) {
        this.student = student;
    }
    
    public Session getSession() {
        return session;
    }
    
    public void setSession(Session session) {
        this.session = session;
    }
    
    public LocalDateTime getReminderTime() {
        return reminderTime;
    }
    
    public void setReminderTime(LocalDateTime reminderTime) {
        this.reminderTime = reminderTime;
    }
    
    public Boolean getIsSent() {
        return isSent;
    }
    
    public void setIsSent(Boolean isSent) {
        this.isSent = isSent;
    }
    
    public LocalDateTime getSentAt() {
        return sentAt;
    }
    
    public void setSentAt(LocalDateTime sentAt) {
        this.sentAt = sentAt;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    public boolean isPending() {
        return !isSent && reminderTime.isAfter(LocalDateTime.now());
    }
    
    public boolean isDue() {
        return !isSent && reminderTime.isBefore(LocalDateTime.now());
    }
    
    public void markAsSent() {
        this.isSent = true;
        this.sentAt = LocalDateTime.now();
    }
    
    @Override
    public String toString() {
        return "Reminder{" +
                "reminderId=" + reminderId +
                ", reminderTime=" + reminderTime +
                ", isSent=" + isSent +
                '}';
    }
}
