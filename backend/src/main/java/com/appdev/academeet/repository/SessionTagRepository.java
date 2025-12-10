package com.appdev.academeet.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.appdev.academeet.model.SessionTag;

@Repository
public interface SessionTagRepository extends JpaRepository<SessionTag, Long> {
    List<SessionTag> findBySessionId(Long sessionId);
   
    List<SessionTag> findByTagName(String tagName);

    void deleteBySessionId(Long sessionId);
    
    boolean existsBySessionIdAndTagName(Long sessionId, String tagName);
}
