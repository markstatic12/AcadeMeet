package com.appdev.academeet.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.appdev.academeet.model.Reminder;

@Repository
public interface ReminderRepository extends JpaRepository<Reminder, Long> {
    
    /**
     * Get active reminders for user (scheduled time has passed, session is active)
     * Sorted by: scheduled time descending (most recent first)
     */
    @Query("SELECT r FROM Reminder r " +
           "WHERE r.user.id = :userId " +
           "AND r.scheduledTime <= :currentTime " +
           "AND r.session.sessionStatus = 'ACTIVE' " +
           "ORDER BY r.scheduledTime DESC")
    List<Reminder> findActiveRemindersByUserId(
        @Param("userId") Long userId,
        @Param("currentTime") LocalDateTime currentTime
    );
    
    /**
     * Delete all reminders for a user-session pair
     * (used when user cancels participation)
     */
    @Modifying
    @Query("DELETE FROM Reminder r WHERE r.user.id = :userId AND r.session.id = :sessionId")
    void deleteByUserIdAndSessionId(
        @Param("userId") Long userId,
        @Param("sessionId") Long sessionId
    );
    
    /**
     * Get unread reminder count for user
     */
    @Query("SELECT COUNT(r) FROM Reminder r " +
           "WHERE r.user.id = :userId " +
           "AND r.scheduledTime <= :currentTime " +
           "AND r.isRead = false " +
           "AND r.session.sessionStatus = 'ACTIVE'")
    Long countUnreadReminders(
        @Param("userId") Long userId,
        @Param("currentTime") LocalDateTime currentTime
    );
    
    /**
     * Check if reminders already exist for user-session pair
     */
    boolean existsByUserIdAndSessionId(Long userId, Long sessionId);
}
