package com.appdev.academeet.controller;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

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
import org.springframework.web.bind.annotation.RestController;

import com.appdev.academeet.dto.ReminderCreationDTO;
import com.appdev.academeet.dto.ReminderResponseDTO;
import com.appdev.academeet.dto.ReminderUpdateDTO;
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
    public ResponseEntity<?> createReminder(@RequestBody ReminderCreationDTO request) {
        try {
            User user = getAuthenticatedUser();
            // Use new service signature: (userId, sessionId, header, message, reminderTime)
            String header = request.getHeader() != null ? request.getHeader() : "Reminder";
            String message = request.getMessage();

            Reminder reminder = reminderService.createReminder(
                user.getId(),
                request.getSessionId(),
                header,
                message,
                request.getReminderTime()
            );

            if (request.getNotificationType() != null) {
                reminder.setNotificationType(request.getNotificationType());
            }

            ReminderResponseDTO dto = new ReminderResponseDTO(reminder);
            return ResponseEntity.ok(dto);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }


    /**
     * Get reminders for authenticated user from JWT
     */
    @GetMapping("/me")
    public ResponseEntity<List<ReminderResponseDTO>> getMyReminders() {
        try {
            User user = getAuthenticatedUser();
            List<Reminder> reminders = reminderService.getRemindersByUser(user.getId());
            List<ReminderResponseDTO> dtos = reminders.stream()
                    .map(ReminderResponseDTO::new)
                    .collect(Collectors.toList());
            return ResponseEntity.ok(dtos);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PatchMapping("/{id}")
    public ResponseEntity<?> updateReminder(@PathVariable Long id, @RequestBody ReminderUpdateDTO request) {
        try {
            Reminder updatedReminder = reminderService.updateReminderTime(id, request.getReminderTime());

            if (request.getMessage() != null) {
                updatedReminder.setMessage(request.getMessage());
            }

            if (request.getNotificationType() != null) {
                updatedReminder.setNotificationType(request.getNotificationType());
            }

            ReminderResponseDTO dto = new ReminderResponseDTO(updatedReminder);
            return ResponseEntity.ok(dto);
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
    public ResponseEntity<List<ReminderResponseDTO>> getPendingReminders() {
        try {
            User user = getAuthenticatedUser();
            List<Reminder> pendingReminders = reminderService.getPendingReminders(user.getId());
            List<ReminderResponseDTO> dtos = pendingReminders.stream()
                    .map(ReminderResponseDTO::new)
                    .collect(Collectors.toList());
            return ResponseEntity.ok(dtos);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Get pending reminders for authenticated user from JWT
     */
    @GetMapping("/me/pending")
    public ResponseEntity<List<ReminderResponseDTO>> getMyPendingReminders() {
        try {
            User user = getAuthenticatedUser();
            List<Reminder> pendingReminders = reminderService.getPendingReminders(user.getId());
            List<ReminderResponseDTO> dtos = pendingReminders.stream()
                    .map(ReminderResponseDTO::new)
                    .collect(Collectors.toList());
            return ResponseEntity.ok(dtos);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/me/count")
    public ResponseEntity<Map<String, Long>> getMyPendingReminderCount() {
        try {
            User user = getAuthenticatedUser();
            Long count = reminderService.countPendingRemindersByUser(user.getId());
            return ResponseEntity.ok(Map.of("count", count));
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Get unread reminders for authenticated user.
     */
    @GetMapping("/unread")
    public ResponseEntity<?> getUnreadReminders() {
        try {
            User user = getAuthenticatedUser();
            List<Reminder> unreadReminders = reminderService.getUnreadReminders(user.getId());
            List<ReminderResponseDTO> dtos = unreadReminders.stream()
                    .map(ReminderResponseDTO::new)
                    .collect(Collectors.toList());
            return ResponseEntity.ok(dtos);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Failed to fetch unread reminders: " + e.getMessage()));
        }
    }

    /**
     * Mark a reminder as read.
     */
    @PatchMapping("/{reminderId}/read")
    public ResponseEntity<?> markReminderAsRead(@PathVariable Long reminderId) {
        try {
            reminderService.markAsRead(reminderId);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}