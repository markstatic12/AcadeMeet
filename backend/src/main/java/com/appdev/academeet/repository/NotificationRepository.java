package com.appdev.academeet.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.appdev.academeet.model.Notification;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
  
    @Query("SELECT n FROM Notification n WHERE n.recipient.id = :userId AND (n.scheduledTime IS NULL OR n.scheduledTime <= :currentTime) ORDER BY n.createdAt DESC")
    List<Notification> findAllByUserId(@Param("userId") Long userId, @Param("currentTime") java.time.LocalDateTime currentTime);
    
    @Query("SELECT n FROM Notification n WHERE n.recipient.id = :userId AND n.isRead = false AND (n.scheduledTime IS NULL OR n.scheduledTime <= :currentTime) ORDER BY n.createdAt DESC")
    List<Notification> findUnreadByUserId(@Param("userId") Long userId, @Param("currentTime") java.time.LocalDateTime currentTime);
  
    @Query("SELECT COUNT(n) FROM Notification n WHERE n.recipient.id = :userId AND n.isRead = false AND (n.scheduledTime IS NULL OR n.scheduledTime <= :currentTime)")
    Long countUnreadByUserId(@Param("userId") Long userId, @Param("currentTime") java.time.LocalDateTime currentTime);
    
    @Modifying
    @Query("UPDATE Notification n SET n.isRead = true WHERE n.recipient.id = :userId AND n.isRead = false")
    void markAllAsReadByUserId(@Param("userId") Long userId);
    
    @Query("SELECT n FROM Notification n WHERE n.recipient.id = :userId AND n.scheduledTime IS NOT NULL AND n.scheduledTime <= :currentTime ORDER BY n.scheduledTime DESC")
    List<Notification> findActiveRemindersByUserId(@Param("userId") Long userId, @Param("currentTime") java.time.LocalDateTime currentTime);
    
    @Query("SELECT COUNT(n) FROM Notification n WHERE n.recipient.id = :userId AND n.scheduledTime IS NOT NULL AND n.isRead = false AND n.scheduledTime <= :currentTime")
    Long countUnreadRemindersByUserId(@Param("userId") Long userId, @Param("currentTime") java.time.LocalDateTime currentTime);
    
    @Modifying
    @Query("DELETE FROM Notification n WHERE n.recipient.id = :userId AND n.session.id = :sessionId AND n.scheduledTime IS NOT NULL")
    void deleteRemindersByUserIdAndSessionId(@Param("userId") Long userId, @Param("sessionId") Long sessionId);
    
    @Query("SELECT CASE WHEN COUNT(n) > 0 THEN true ELSE false END FROM Notification n WHERE n.recipient.id = :userId AND n.session.id = :sessionId AND n.scheduledTime IS NOT NULL")
    boolean existsReminderByUserIdAndSessionId(@Param("userId") Long userId, @Param("sessionId") Long sessionId);
}
