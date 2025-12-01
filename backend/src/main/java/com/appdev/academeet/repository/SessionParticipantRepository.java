package com.appdev.academeet.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.appdev.academeet.model.SessionParticipant;
import com.appdev.academeet.model.SessionParticipantId;

@Repository
public interface SessionParticipantRepository extends JpaRepository<SessionParticipant, SessionParticipantId> {
    
    /**
     * Find all participants for a specific session.
     */
    @Query("SELECT sp FROM SessionParticipant sp WHERE sp.id.sessionId = :sessionId")
    List<SessionParticipant> findBySessionId(Long sessionId);
    
    /**
     * Find all sessions a user is participating in.
     */
    @Query("SELECT sp FROM SessionParticipant sp WHERE sp.id.participantId = :userId")
    List<SessionParticipant> findByUserId(Long userId);
    
    /**
     * Check if a user is already a participant in a session.
     */
    @Query("SELECT sp FROM SessionParticipant sp WHERE sp.id.sessionId = :sessionId AND sp.id.participantId = :userId")
    Optional<SessionParticipant> findBySessionIdAndUserId(Long sessionId, Long userId);
    
    /**
     * Check if a user is participating in a session.
     */
    @Query("SELECT CASE WHEN COUNT(sp) > 0 THEN true ELSE false END FROM SessionParticipant sp WHERE sp.id.sessionId = :sessionId AND sp.id.participantId = :userId")
    boolean existsBySessionIdAndUserId(Long sessionId, Long userId);
    
    /**
     * Count participants for a session.
     */
    @Query("SELECT COUNT(sp) FROM SessionParticipant sp WHERE sp.id.sessionId = :sessionId")
    long countBySessionId(Long sessionId);
    
    /**
     * Delete all participants from a session.
     */
    @Query("DELETE FROM SessionParticipant sp WHERE sp.id.sessionId = :sessionId")
    void deleteBySessionId(Long sessionId);
    
    /**
     * Remove a specific user from a session.
     */
    @Query("DELETE FROM SessionParticipant sp WHERE sp.id.sessionId = :sessionId AND sp.id.participantId = :userId")
    void deleteBySessionIdAndUserId(Long sessionId, Long userId);
}
