package com.appdev.academeet.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.appdev.academeet.model.SessionNote;

/**
 * Repository for SessionNote entity.
 * Handles file notes linked to sessions.
 */
@Repository
public interface SessionNoteRepository extends JpaRepository<SessionNote, String> {
    
    /**
     * Get all notes linked to a specific session.
     */
    List<SessionNote> findBySession_Id(Long sessionId);
    
    /**
     * Count notes for a specific session.
     * Essential for enforcing the "maximum of 3 notes" business rule.
     */
    long countBySession_Id(Long sessionId);
    
    /**
     * Delete all notes for a specific session.
     */
    void deleteBySession_Id(Long sessionId);
}
