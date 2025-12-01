package com.appdev.academeet.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.appdev.academeet.model.SessionTag;

@Repository
public interface SessionTagRepository extends JpaRepository<SessionTag, Long> {
    
    /**
     * Find all tags for a specific session.
     */
    List<SessionTag> findBySessionId(Long sessionId);
    
    /**
     * Find all sessions with a specific tag name.
     */
    List<SessionTag> findByTagName(String tagName);
    
    /**
     * Delete all tags for a specific session.
     */
    void deleteBySessionId(Long sessionId);
    
    /**
     * Check if a tag exists for a session.
     */
    boolean existsBySessionIdAndTagName(Long sessionId, String tagName);
}
