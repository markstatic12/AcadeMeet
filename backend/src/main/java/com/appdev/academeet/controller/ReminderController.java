package com.appdev.academeet.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.appdev.academeet.dto.ReminderDTO;
import com.appdev.academeet.model.User;
import com.appdev.academeet.service.ReminderService;

@RestController
@RequestMapping("/api/reminders")
public class ReminderController extends BaseController {

    private final ReminderService reminderService;

    public ReminderController(ReminderService reminderService) {
        this.reminderService = reminderService;
    }

    /**
     * Get active reminders for authenticated user
     * Sorted by: unread first, then by scheduled time descending
     */
    @GetMapping("/active")
    public ResponseEntity<List<ReminderDTO>> getActiveReminders() {
        User user = getAuthenticatedUser();
        List<ReminderDTO> reminders = reminderService.getActiveReminders(user.getId());
        return ResponseEntity.ok(reminders);
    }

    /**
     * Mark reminder as read (when user clicks on it)
     */
    @PatchMapping("/{reminderId}/read")
    public ResponseEntity<Void> markAsRead(@PathVariable Long reminderId) {
        User user = getAuthenticatedUser();
        reminderService.markAsRead(reminderId, user.getId());
        return ResponseEntity.noContent().build();
    }

    /**
     * Get unread reminder count (for badge)
     */
    @GetMapping("/unread/count")
    public ResponseEntity<Map<String, Long>> getUnreadCount() {
        User user = getAuthenticatedUser();
        Long count = reminderService.getUnreadCount(user.getId());
        return ResponseEntity.ok(Map.of("count", count));
    }
}
