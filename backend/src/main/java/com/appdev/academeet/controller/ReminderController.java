package com.appdev.academeet.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.appdev.academeet.dto.ReminderDTO;
import com.appdev.academeet.model.User;
import com.appdev.academeet.repository.UserRepository;
import com.appdev.academeet.service.ReminderService;

@RestController
@RequestMapping("/api/reminders")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174"})
public class ReminderController {

    private final ReminderService reminderService;
    private final UserRepository userRepository;

    public ReminderController(ReminderService reminderService, UserRepository userRepository) {
        this.reminderService = reminderService;
        this.userRepository = userRepository;
    }

    /**
     * Helper method to get authenticated user from JWT token
     */
    private User getAuthenticatedUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("User not authenticated");
        }
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        String email = userDetails.getUsername();
        return userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));
    }

    /**
     * Get active reminders for authenticated user
     * Sorted by: unread first, then by scheduled time descending
     */
    @GetMapping("/active")
    public ResponseEntity<List<ReminderDTO>> getActiveReminders() {
        try {
            User user = getAuthenticatedUser();
            List<ReminderDTO> reminders = reminderService.getActiveReminders(user.getId());
            return ResponseEntity.ok(reminders);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Mark reminder as read (when user clicks on it)
     */
    @PatchMapping("/{reminderId}/read")
    public ResponseEntity<?> markAsRead(@PathVariable Long reminderId) {
        try {
            User user = getAuthenticatedUser();
            reminderService.markAsRead(reminderId, user.getId());
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Get unread reminder count (for badge)
     */
    @GetMapping("/unread/count")
    public ResponseEntity<Map<String, Long>> getUnreadCount() {
        try {
            User user = getAuthenticatedUser();
            Long count = reminderService.getUnreadCount(user.getId());
            return ResponseEntity.ok(Map.of("count", count));
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
