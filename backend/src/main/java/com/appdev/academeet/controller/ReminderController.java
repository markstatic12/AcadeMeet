package com.appdev.academeet.controller;

import com.appdev.academeet.dto.ReminderRequest;
import com.appdev.academeet.model.Reminder;
import com.appdev.academeet.service.ReminderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reminders")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174"})
public class ReminderController {

    private final ReminderService reminderService;

    @Autowired
    public ReminderController(ReminderService reminderService) {
        this.reminderService = reminderService;
    }

    @PostMapping
    public ResponseEntity<?> createReminder(@RequestBody ReminderRequest request) {
        try {
            Reminder reminder = reminderService.createReminder(
                request.getUserId(),
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