package com.appdev.academeet.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.appdev.academeet.model.Session;
import com.appdev.academeet.model.User;

@Repository
public interface SessionRepository extends JpaRepository<Session, Integer> {
    
    List<Session> findByHost(User host);
    
    List<Session> findByStatus(String status);
    
    List<Session> findBySubjectContainingIgnoreCase(String subject);
    
    @Query("SELECT s FROM Session s WHERE s.schedule >= ?1 AND s.schedule <= ?2")
    List<Session> findByScheduleBetween(LocalDateTime start, LocalDateTime end);
    
    @Query("SELECT s FROM Session s WHERE s.schedule >= ?1 ORDER BY s.schedule ASC")
    List<Session> findUpcomingSessions(LocalDateTime now);
    
    @Query("SELECT s FROM Session s WHERE s.host.id = ?1 ORDER BY s.schedule DESC")
    List<Session> findByHostId(Long hostId);
    
    @Query("SELECT s FROM Session s WHERE s.status = ?1 ORDER BY s.schedule ASC")
    List<Session> findByStatusOrderBySchedule(String status);
}
