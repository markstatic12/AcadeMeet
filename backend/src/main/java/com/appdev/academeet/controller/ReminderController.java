package com.appdev.academeet.controller;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.appdev.academeet.model.Reminder;
import com.appdev.academeet.service.ReminderService;

@RestController
@RequestMapping("/api/reminders")
@CrossOrigin(origins = "http://localhost:5173")
public class ReminderController {
    
    @Autowired
    private ReminderService reminderService;
    
    // Create a reminder with specific time
    @PostMapping
    public ResponseEntity<?> createReminder(@RequestBody ReminderRequest request) {
        try {
            Reminder reminder = reminderService.createReminder(
                request.getStudentId(),
                request.getSessionId(),
                request.getReminderTime()
            );
            return ResponseEntity.status(HttpStatus.CREATED).body(reminder);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    // Create reminder with minutes before session
    @PostMapping("/minutes-before")
    public ResponseEntity<?> createReminderMinutesBefore(@RequestBody ReminderMinutesRequest request) {
        try {
            Reminder reminder = reminderService.createReminderMinutesBefore(
                request.getStudentId(),
                request.getSessionId(),
                request.getMinutesBefore()
            );
            return ResponseEntity.status(HttpStatus.CREATED).body(reminder);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    // Get all reminders for a student
    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<Reminder>> getStudentReminders(@PathVariable Long studentId) {
        try {
            List<Reminder> reminders = reminderService.getStudentReminders(studentId);
            return ResponseEntity.ok(reminders);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    // Get pending reminders for a student
    @GetMapping("/student/{studentId}/pending")
    public ResponseEntity<List<Reminder>> getPendingReminders(@PathVariable Long studentId) {
        try {
            List<Reminder> reminders = reminderService.getPendingReminders(studentId);
            return ResponseEntity.ok(reminders);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    // Get upcoming reminders for a student (within N days)
    @GetMapping("/student/{studentId}/upcoming")
    public ResponseEntity<List<Reminder>> getUpcomingReminders(
            @PathVariable Long studentId,
            @RequestParam(defaultValue = "7") int days) {
        try {
            List<Reminder> reminders = reminderService.getUpcomingReminders(studentId, days);
            return ResponseEntity.ok(reminders);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    // Get all reminders for a session
    @GetMapping("/session/{sessionId}")
    public ResponseEntity<List<Reminder>> getSessionReminders(@PathVariable Integer sessionId) {
        try {
            List<Reminder> reminders = reminderService.getSessionReminders(sessionId);
            return ResponseEntity.ok(reminders);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    // Get due reminders (for notification service)
    @GetMapping("/due")
    public ResponseEntity<List<Reminder>> getDueReminders() {
        try {
            List<Reminder> reminders = reminderService.getDueReminders();
            return ResponseEntity.ok(reminders);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    // Get reminders to send soon (within N minutes)
    @GetMapping("/due-soon")
    public ResponseEntity<List<Reminder>> getRemindersToSendSoon(
            @RequestParam(defaultValue = "15") int withinMinutes) {
        try {
            List<Reminder> reminders = reminderService.getRemindersToSendSoon(withinMinutes);
            return ResponseEntity.ok(reminders);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    // Mark reminder as sent
    @PutMapping("/{reminderId}/mark-sent")
    public ResponseEntity<?> markAsSent(@PathVariable Long reminderId) {
        try {
            reminderService.markAsSent(reminderId);
            return ResponseEntity.ok().body("Reminder marked as sent");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    // Mark multiple reminders as sent (bulk operation)
    @PutMapping("/mark-sent-bulk")
    public ResponseEntity<?> markMultipleAsSent(@RequestBody ReminderBulkRequest request) {
        try {
            reminderService.markMultipleAsSent(request.getReminderIds());
            return ResponseEntity.ok().body("Reminders marked as sent");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    // Update reminder time
    @PutMapping("/{reminderId}")
    public ResponseEntity<?> updateReminderTime(@PathVariable Long reminderId, @RequestBody ReminderUpdateRequest request) {
        try {
            Reminder reminder = reminderService.updateReminderTime(
                reminderId,
                request.getStudentId(),
                request.getNewReminderTime()
            );
            return ResponseEntity.ok(reminder);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    // Delete a reminder
    @DeleteMapping("/{reminderId}")
    public ResponseEntity<?> deleteReminder(
            @PathVariable Long reminderId,
            @RequestParam Long studentId) {
        try {
            reminderService.deleteReminder(reminderId, studentId);
            return ResponseEntity.ok().body("Reminder deleted successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    // Delete all reminders for a session (admin operation)
    @DeleteMapping("/session/{sessionId}")
    public ResponseEntity<?> deleteSessionReminders(@PathVariable Integer sessionId) {
        try {
            reminderService.deleteSessionReminders(sessionId);
            return ResponseEntity.ok().body("Session reminders deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    // Cleanup old sent reminders (admin operation)
    @DeleteMapping("/cleanup")
    public ResponseEntity<?> cleanupOldReminders(@RequestParam(defaultValue = "30") int daysOld) {
        try {
            reminderService.deleteOldSentReminders(daysOld);
            return ResponseEntity.ok().body("Old reminders cleaned up successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    // Count pending reminders for a student
    @GetMapping("/student/{studentId}/count")
    public ResponseEntity<Long> countPendingReminders(@PathVariable Long studentId) {
        try {
            long count = reminderService.countPendingReminders(studentId);
            return ResponseEntity.ok(count);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    // Inner DTO classes
    public static class ReminderRequest {
        private Long studentId;
        private Integer sessionId;
        private LocalDateTime reminderTime;
        
        public Long getStudentId() { return studentId; }
        public void setStudentId(Long studentId) { this.studentId = studentId; }
        
        public Integer getSessionId() { return sessionId; }
        public void setSessionId(Integer sessionId) { this.sessionId = sessionId; }
        
        public LocalDateTime getReminderTime() { return reminderTime; }
        public void setReminderTime(LocalDateTime reminderTime) { this.reminderTime = reminderTime; }
    }
    
    public static class ReminderMinutesRequest {
        private Long studentId;
        private Integer sessionId;
        private int minutesBefore;
        
        public Long getStudentId() { return studentId; }
        public void setStudentId(Long studentId) { this.studentId = studentId; }
        
        public Integer getSessionId() { return sessionId; }
        public void setSessionId(Integer sessionId) { this.sessionId = sessionId; }
        
        public int getMinutesBefore() { return minutesBefore; }
        public void setMinutesBefore(int minutesBefore) { this.minutesBefore = minutesBefore; }
    }
    
    public static class ReminderUpdateRequest {
        private Long studentId;
        private LocalDateTime newReminderTime;
        
        public Long getStudentId() { return studentId; }
        public void setStudentId(Long studentId) { this.studentId = studentId; }
        
        public LocalDateTime getNewReminderTime() { return newReminderTime; }
        public void setNewReminderTime(LocalDateTime newReminderTime) { this.newReminderTime = newReminderTime; }
    }
    
    public static class ReminderBulkRequest {
        private List<Long> reminderIds;
        
        public List<Long> getReminderIds() { return reminderIds; }
        public void setReminderIds(List<Long> reminderIds) { this.reminderIds = reminderIds; }
    }
}
