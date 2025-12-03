package com.appdev.academeet.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.appdev.academeet.dto.ReminderRequest;
import com.appdev.academeet.model.Reminder;
import com.appdev.academeet.model.User;
import com.appdev.academeet.repository.UserRepository;
import com.appdev.academeet.service.ReminderService;

@RestController
@RequestMapping("/api/reminders")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174"})
public class ReminderController {

    private final ReminderService reminderService;
    private final UserRepository userRepository;

    @Autowired
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

    @PostMapping
    public ResponseEntity<?> createReminder(@RequestBody ReminderRequest request) {
        try {
            User user = getAuthenticatedUser();
            Reminder reminder = reminderService.createReminder(
                user.getId(),
                request.getSessionId(),
                request.getReminderTime()
            );
            
            if (request.getReminderMessage() != null) {
                reminder.setReminderMessage(request.getReminderMessage());
            }
            
            if (request.getNotificationType() != null) {
                reminder.setNotificationType(request.getNotificationType());
            }
            
            return ResponseEntity.ok(reminder);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping
    public ResponseEntity<List<Reminder>> getUserReminders(@RequestParam Long userId) {
        try {
            List<Reminder> reminders = reminderService.getRemindersByUser(userId);
            return ResponseEntity.ok(reminders);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Get reminders for authenticated user from JWT
     */
    @GetMapping("/me")
    public ResponseEntity<List<Reminder>> getMyReminders() {
        try {
            User user = getAuthenticatedUser();
            List<Reminder> reminders = reminderService.getRemindersByUser(user.getId());
            return ResponseEntity.ok(reminders);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PatchMapping("/{id}")
    public ResponseEntity<?> updateReminder(@PathVariable Long id, @RequestBody ReminderRequest request) {
        try {
            Reminder updatedReminder = reminderService.updateReminderTime(id, request.getReminderTime());
            
            if (request.getReminderMessage() != null) {
                updatedReminder.setReminderMessage(request.getReminderMessage());
            }
            
            if (request.getNotificationType() != null) {
                updatedReminder.setNotificationType(request.getNotificationType());
            }
            
            return ResponseEntity.ok(updatedReminder);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteReminder(@PathVariable Long id) {
        try {
            reminderService.deleteReminder(id);
            return ResponseEntity.ok(Map.of("message", "Reminder deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/pending")
    public ResponseEntity<List<Reminder>> getPendingReminders(@RequestParam Long userId) {
        try {
            List<Reminder> pendingReminders = reminderService.getPendingReminders(userId);
            return ResponseEntity.ok(pendingReminders);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Get pending reminders for authenticated user from JWT
     */
    @GetMapping("/me/pending")
    public ResponseEntity<List<Reminder>> getMyPendingReminders() {
        try {
            User user = getAuthenticatedUser();
            List<Reminder> pendingReminders = reminderService.getPendingReminders(user.getId());
            return ResponseEntity.ok(pendingReminders);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/count")
    public ResponseEntity<Map<String, Long>> getPendingReminderCount(@RequestParam Long userId) {
        try {
            Long count = reminderService.countPendingRemindersByUser(userId);
            return ResponseEntity.ok(Map.of("count", count));
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}