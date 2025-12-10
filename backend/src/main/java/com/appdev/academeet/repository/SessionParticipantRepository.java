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
    
    @Query("SELECT sp FROM SessionParticipant sp WHERE sp.id.sessionId = :sessionId")
    List<SessionParticipant> findBySessionId(Long sessionId);
    
    @Query("SELECT sp FROM SessionParticipant sp WHERE sp.id.participantId = :userId")
    List<SessionParticipant> findByUserId(Long userId);
   
    @Query("SELECT sp FROM SessionParticipant sp WHERE sp.id.sessionId = :sessionId AND sp.id.participantId = :userId")
    Optional<SessionParticipant> findBySessionIdAndUserId(Long sessionId, Long userId);
    
    @Query("SELECT CASE WHEN COUNT(sp) > 0 THEN true ELSE false END FROM SessionParticipant sp WHERE sp.id.sessionId = :sessionId AND sp.id.participantId = :userId")
    boolean existsBySessionIdAndUserId(Long sessionId, Long userId);
   
    @Query("SELECT COUNT(sp) FROM SessionParticipant sp WHERE sp.id.sessionId = :sessionId")
    long countBySessionId(Long sessionId);

    @Query("DELETE FROM SessionParticipant sp WHERE sp.id.sessionId = :sessionId")
    void deleteBySessionId(Long sessionId);

    @Query("DELETE FROM SessionParticipant sp WHERE sp.id.sessionId = :sessionId AND sp.id.participantId = :userId")
    void deleteBySessionIdAndUserId(Long sessionId, Long userId);
}