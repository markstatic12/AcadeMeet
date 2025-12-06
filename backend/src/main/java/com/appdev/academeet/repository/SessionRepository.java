package com.appdev.academeet.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
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

    // Case-insensitive search variants
    Page<Session> findByTitleContainingIgnoreCase(String keyword, Pageable pageable);
    Page<Session> findByTitleContainingIgnoreCaseAndStatus(String keyword, SessionStatus status, Pageable pageable);

    // Trending sessions ranked by tag popularity (top 4)
    @Query("SELECT s FROM Session s " +
           "LEFT JOIN s.sessionTags st " +
           "WHERE st.tagName IN (" +
           "  SELECT t.tagName FROM SessionTag t " +
           "  GROUP BY t.tagName " +
           "  ORDER BY COUNT(t) DESC" +
           ") " +
           "GROUP BY s.id " +
           "ORDER BY COUNT(st) DESC")
    List<Session> findTrendingSessions(Pageable pageable);
}