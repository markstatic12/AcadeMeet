package com.appdev.academeet.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.appdev.academeet.model.Reminder;
import com.appdev.academeet.model.Session;
import com.appdev.academeet.model.User;

@Repository
public interface ReminderRepository extends JpaRepository<Reminder, Long> {
    
    @Query("SELECT r FROM Reminder r WHERE r.user = :user ORDER BY r.reminderTime ASC")
    List<Reminder> findByUserOrderByReminderTime(@Param("user") User user);
    
    @Query("SELECT r FROM Reminder r WHERE r.user = :user AND r.isSent = false ORDER BY r.reminderTime ASC")
    List<Reminder> findPendingRemindersByUser(@Param("user") User user);
    
    @Query("SELECT r FROM Reminder r WHERE r.isSent = false AND r.reminderTime <= :currentTime")
    List<Reminder> findDueReminders(@Param("currentTime") LocalDateTime currentTime);
    
    @Query("SELECT r FROM Reminder r WHERE r.session = :session")
    List<Reminder> findBySession(@Param("session") Session session);
    
    @Query("SELECT COUNT(r) FROM Reminder r WHERE r.user = :user AND r.isSent = false")
    Long countPendingRemindersByUser(@Param("user") User user);
    
    // Get unread reminders for a user (sorted by urgency)
    @Query("SELECT r FROM Reminder r WHERE r.user.id = :userId AND r.readAt IS NULL ORDER BY r.reminderTime ASC")
    List<Reminder> findByUserIdAndIsReadFalseOrderByReminderTimeAsc(@Param("userId") Long userId);
    
    // Get unsent reminders that need to be sent now
    @Query("SELECT r FROM Reminder r WHERE r.isSent = false AND r.reminderTime <= :currentTime")
    List<Reminder> findByIsSentFalseAndReminderTimeBefore(@Param("currentTime") LocalDateTime currentTime);
    
    // Mark reminder as sent
    @Modifying
    @Query("UPDATE Reminder r SET r.isSent = true, r.sentAt = :sentTime WHERE r.reminderId = :reminderId")
    void markAsSent(@Param("reminderId") Long reminderId, @Param("sentTime") LocalDateTime sentTime);
}