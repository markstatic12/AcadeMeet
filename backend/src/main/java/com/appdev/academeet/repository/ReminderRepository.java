package com.appdev.academeet.repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.appdev.academeet.model.Reminder;

@Repository
public interface ReminderRepository extends JpaRepository<Reminder, Long> {
    
    @Query("SELECT r FROM Reminder r WHERE r.user.id = :studentId AND r.session.sessionId = :sessionId")
    Optional<Reminder> findByStudentAndSession(
        @Param("studentId") Long studentId,
        @Param("sessionId") Integer sessionId
    );
    
    @Query("SELECT r FROM Reminder r WHERE r.user.id = :studentId ORDER BY r.reminderTime ASC")
    List<Reminder> findByStudent(@Param("studentId") Long studentId);
    
    @Query("SELECT r FROM Reminder r WHERE r.session.sessionId = :sessionId")
    List<Reminder> findBySession(@Param("sessionId") Integer sessionId);
    
    @Query("SELECT r FROM Reminder r WHERE r.isSent = false AND r.reminderTime <= :currentTime")
    List<Reminder> findPendingReminders(@Param("currentTime") LocalDateTime currentTime);
    
    @Query("SELECT r FROM Reminder r WHERE r.user.id = :studentId AND r.isSent = false ORDER BY r.reminderTime ASC")
    List<Reminder> findUpcomingByStudent(@Param("studentId") Long studentId);
    
    @Query("SELECT COUNT(r) FROM Reminder r WHERE r.user.id = :studentId AND r.isSent = false")
    Long countPendingByStudent(@Param("studentId") Long studentId);
    
    @Query("SELECT r FROM Reminder r WHERE r.user.id = :studentId AND " +
           "r.reminderTime BETWEEN :startTime AND :endTime ORDER BY r.reminderTime ASC")
    List<Reminder> findByStudentAndTimeRange(
        @Param("studentId") Long studentId,
        @Param("startTime") LocalDateTime startTime,
        @Param("endTime") LocalDateTime endTime
    );
    
    void deleteBySessionSessionId(Integer sessionId);
    
    // Additional alias methods for service compatibility
    @Query("SELECT CASE WHEN COUNT(r) > 0 THEN true ELSE false END FROM Reminder r " +
           "WHERE r.user.id = :studentId AND r.session.sessionId = :sessionId AND r.reminderTime = :reminderTime")
    boolean existsByStudentAndSessionAndReminderTime(
        @Param("studentId") Long studentId,
        @Param("sessionId") Integer sessionId,
        @Param("reminderTime") LocalDateTime reminderTime
    );
    
    @Modifying
    @Query("DELETE FROM Reminder r WHERE r.isSent = true AND r.sentAt < :cutoffDate")
    void deleteOldSentReminders(@Param("cutoffDate") LocalDateTime cutoffDate);
    
    @Query("SELECT r FROM Reminder r WHERE r.isSent = false AND r.reminderTime BETWEEN :now AND :endTime ORDER BY r.reminderTime ASC")
    List<Reminder> findRemindersToSendSoon(
        @Param("now") LocalDateTime now,
        @Param("endTime") LocalDateTime endTime
    );
    
    // Helper method - findRemindersToSendSoon with minutes
    default List<Reminder> findRemindersToSendSoon(LocalDateTime now, int withinMinutes) {
        LocalDateTime endTime = now.plusMinutes(withinMinutes);
        return findRemindersToSendSoon(now, endTime);
    }
}
