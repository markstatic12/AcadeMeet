package com.appdev.academeet.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.appdev.academeet.model.SessionParticipant;

@Repository
public interface SessionParticipantRepository extends JpaRepository<SessionParticipant, Long> {
    
    /**
     * Find all participants for a specific session.
     */
    List<SessionParticipant> findBySessionId(Long sessionId);
    
    /**
     * Find all sessions a user is participating in.
     */
    @Query("SELECT sp FROM SessionParticipant sp WHERE sp.user.id = :userId")
    List<SessionParticipant> findByUserId(Long userId);
    
    /**
     * Check if a user is already a participant in a session.
     */
    @Query("SELECT sp FROM SessionParticipant sp WHERE sp.session.id = :sessionId AND sp.user.id = :userId")
    Optional<SessionParticipant> findBySessionIdAndUserId(Long sessionId, Long userId);
    
    /**
     * Check if a user is participating in a session.
     */
    boolean existsBySessionIdAndUserId(Long sessionId, Long userId);
    
    /**
     * Count participants for a session.
     */
    long countBySessionId(Long sessionId);
    
    /**
     * Delete all participants from a session.
     */
    void deleteBySessionId(Long sessionId);
    
    /**
     * Remove a specific user from a session.
     */
    void deleteBySessionIdAndUserId(Long sessionId, Long userId);
}
