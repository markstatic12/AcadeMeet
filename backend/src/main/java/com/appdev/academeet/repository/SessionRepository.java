package com.appdev.academeet.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.appdev.academeet.model.Session;
import com.appdev.academeet.model.SessionStatus;

@Repository
public interface SessionRepository extends JpaRepository<Session, Long> {
    List<Session> findByHost_Id(Long userId);  
    List<Session> findAllByOrderByStartTime();
    
    // Active sessions (not deleted)
    List<Session> findByHost_IdAndStatusNot(Long userId, SessionStatus status);
    
    // Deleted sessions (in trash)
    List<Session> findByHost_IdAndStatus(Long userId, SessionStatus status);
}