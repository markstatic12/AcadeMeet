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
import jakarta.persistence.Table;

@Entity
@Table(name = "user_saved_notes")
public class UserSavedNote {

    // Define a composite primary key class (UserSavedNoteId) here, or use @EmbeddedId
    @Id 
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // Using a surrogate key for simplicity, though composite is typical

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "note_id", nullable = false)
    private Note note;

    @Column(name = "saved_at", nullable = false)
    private LocalDateTime savedAt;

    // Constructors, Getters, and Setters go here
    public UserSavedNote() {
    }

    public UserSavedNote(Long id, User user, Note note, LocalDateTime savedAt) {
        this.id = id;
        this.user = user;
        this.note = note;
        this.savedAt = savedAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Note getNote() {
        return note;
    }

    public void setNote(Note note) {
        this.note = note;
    }

    public LocalDateTime getSavedAt() {
        return savedAt;
    }

    public void setSavedAt(LocalDateTime savedAt) {
        this.savedAt = savedAt;
    }
}