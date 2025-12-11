package com.appdev.academeet.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.appdev.academeet.dto.NotificationDTO;
import com.appdev.academeet.model.User;
import com.appdev.academeet.service.NotificationService;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController extends BaseController {
    
    private final NotificationService notificationService;
    
    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }
   
    @GetMapping("/all")
    public ResponseEntity<List<NotificationDTO>> getAllNotifications() {
        User user = getAuthenticatedUser();
        List<NotificationDTO> notifications = notificationService.getAllNotifications(user.getId());
        return ResponseEntity.ok(notifications);
    }
    
    @GetMapping("/unread")
    public ResponseEntity<List<NotificationDTO>> getUnreadNotifications() {
        User user = getAuthenticatedUser();
        List<NotificationDTO> notifications = notificationService.getUnreadNotifications(user.getId());
        return ResponseEntity.ok(notifications);
    }

    @GetMapping("/unread/count")
    public ResponseEntity<Map<String, Long>> getUnreadCount() {
        User user = getAuthenticatedUser();
        Long count = notificationService.getUnreadCount(user.getId());
        return ResponseEntity.ok(Map.of("count", count));
    }
    
    @PatchMapping("/{id}/read")
    public ResponseEntity<Map<String, String>> markAsRead(@PathVariable Long id) {
        User user = getAuthenticatedUser();
        notificationService.markAsRead(id, user.getId());
        return ResponseEntity.ok(Map.of("message", "Notification marked as read"));
    }
 
    @PatchMapping("/{id}/unread")
    public ResponseEntity<Map<String, String>> markAsUnread(@PathVariable Long id) {
        User user = getAuthenticatedUser();
        notificationService.markAsUnread(id, user.getId());
        return ResponseEntity.ok(Map.of("message", "Notification marked as unread"));
    }

    @PostMapping("/mark-all-read")
    public ResponseEntity<Map<String, String>> markAllAsRead() {
        User user = getAuthenticatedUser();
        notificationService.markAllAsRead(user.getId());
        return ResponseEntity.ok(Map.of("message", "All notifications marked as read"));
    }
    
    @GetMapping("/reminders/active")
    public ResponseEntity<List<NotificationDTO>> getActiveReminders() {
        User user = getAuthenticatedUser();
        List<NotificationDTO> reminders = notificationService.getActiveReminders(user.getId());
        return ResponseEntity.ok(reminders);
    }
    
    @GetMapping("/reminders/unread/count")
    public ResponseEntity<Map<String, Long>> getUnreadReminderCount() {
        User user = getAuthenticatedUser();
        Long count = notificationService.getUnreadReminderCount(user.getId());
        return ResponseEntity.ok(Map.of("count", count));
    }
}
