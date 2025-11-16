package com.appdev.academeet.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.appdev.academeet.model.Note;

@Repository
public interface NoteRepository extends JpaRepository<Note, Long> {

    // Finds all notes owned by a user, excluding those in TRASH (used for the main "Active" view).
    List<Note> findByOwnerIdAndStatusNot(Long ownerId, Note.NoteStatus status);
    
    /*Finds a specific note by ID and ownership, excluding TRASH.*/
    Optional<Note> findByIdAndOwnerIdAndStatusNot(Long noteId, Long ownerId, Note.NoteStatus status);
    
    /* Finds notes owned by a user with a specific status (e.g., ARCHIVED or TRASH).
     */
    List<Note> findByOwnerIdAndStatus(Long ownerId, Note.NoteStatus status);

    // Find notes by status across all users (used for public feed)
    List<Note> findByStatus(Note.NoteStatus status);
}