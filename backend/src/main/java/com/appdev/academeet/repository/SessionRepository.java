package com.appdev.academeet.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.appdev.academeet.model.Session;
import com.appdev.academeet.model.SessionStatus;

@Repository
public interface SessionRepository extends JpaRepository<Session, Long> {
    // Read/Status
    List<Session> findByHost_Id(Long userId);
    List<Session> findAllByOrderByStartTime();
    Page<Session> findByStatus(SessionStatus status, Pageable pageable);
    
    // Search/Filter
    Page<Session> findByTitleContainingAndStatus(String keyword, SessionStatus status, Pageable pageable);
    List<Session> findByStartTimeBetween(LocalDateTime start, LocalDateTime end);
    
    // Additional useful methods
    Page<Session> findByTitleContaining(String keyword, Pageable pageable);
}