package com.appdev.academeet.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.appdev.academeet.model.Reminder;
import com.appdev.academeet.model.Session;
import com.appdev.academeet.model.User;
import com.appdev.academeet.repository.ReminderRepository;
import com.appdev.academeet.repository.SessionRepository;
import com.appdev.academeet.repository.UserRepository;

@Service
public class ReminderService {

    private final ReminderRepository reminderRepository;
    private final UserRepository userRepository;
    private final SessionRepository sessionRepository;

    @Autowired
    public ReminderService(ReminderRepository reminderRepository,
                          UserRepository userRepository,
                          SessionRepository sessionRepository) {
        this.reminderRepository = reminderRepository;
        this.userRepository = userRepository;
        this.sessionRepository = sessionRepository;
    }

    /**
     * Create a reminder with validation.
     * 
     * Business Rule: Reminder time must be a valid future time.
     */
    @Transactional
    public Reminder createReminder(Long userId, Long sessionId, String header, String message, LocalDateTime reminderTime) {
        // Business Rule: Validate reminder_time is in the future
        if (reminderTime.isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("Reminder time must be in the future");
        }
        
        // Validate header is not empty
        if (header == null || header.trim().isEmpty()) {
            throw new IllegalArgumentException("Reminder header cannot be empty");
        }
        
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
        
        Session session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new RuntimeException("Session not found with id: " + sessionId));
        
        Reminder reminder = new Reminder(user, session, reminderTime);
        reminder.setHeader(header);
        reminder.setMessage(message);
        reminder.setRead(false);
        
        return reminderRepository.save(reminder);
    }

    /**
     * Get unread reminders for a user.
     */
    @Transactional(readOnly = true)
    public List<Reminder> getUnreadReminders(Long userId) {
        return reminderRepository.findByUserIdAndIsReadFalseOrderByReminderTimeAsc(userId);
    }

    /**
     * Mark a reminder as read.
     */
    @Transactional
    public void markAsRead(Long reminderId) {
        Reminder reminder = reminderRepository.findById(reminderId)
                .orElseThrow(() -> new RuntimeException("Reminder not found with id: " + reminderId));
        
        reminder.setRead(true);
        reminderRepository.save(reminder);
    }

    /**
     * Scheduled task to check and send reminders.
     * This should be called periodically (e.g., @Scheduled(fixedDelay = 60000)).
     */
    @Transactional
    public void scheduleCheckAndSend() {
        List<Reminder> dueReminders = reminderRepository.findByIsSentFalseAndReminderTimeBefore(LocalDateTime.now());
        
        for (Reminder reminder : dueReminders) {
            try {
                // TODO: Dispatch notification (email, push, etc.)
                // For now, just mark as sent
                
                reminderRepository.markAsSent(reminder.getReminderId(), LocalDateTime.now());
            } catch (Exception e) {
                // Log error but continue processing other reminders
                System.err.println("Failed to send reminder " + reminder.getReminderId() + ": " + e.getMessage());
            }
        }
    }

    @Transactional(readOnly = true)
    public List<Reminder> getRemindersByUser(Long userId) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isPresent()) {
            return reminderRepository.findByUserOrderByReminderTime(userOpt.get());
        }
        throw new RuntimeException("User not found");
    }

    @Transactional
    public void markReminderAsSent(Long reminderId) {
        Optional<Reminder> reminderOpt = reminderRepository.findById(reminderId);
        if (reminderOpt.isPresent()) {
            Reminder reminder = reminderOpt.get();
            reminder.markAsSent();
            reminderRepository.save(reminder);
        }
    }

    @Transactional
    public void deleteReminder(Long reminderId) {
        reminderRepository.deleteById(reminderId);
    }

    @Transactional
    public Reminder updateReminderTime(Long reminderId, LocalDateTime newTime) {
        Optional<Reminder> reminderOpt = reminderRepository.findById(reminderId);
        if (reminderOpt.isPresent()) {
            Reminder reminder = reminderOpt.get();
            reminder.setReminderTime(newTime);
            reminder.setSent(false); // Reset sent status since time changed
            reminder.setSentAt(null);
            return reminderRepository.save(reminder);
        }
        throw new RuntimeException("Reminder not found");
    }

    @Transactional(readOnly = true)
    public List<Reminder> getPendingReminders(Long userId) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isPresent()) {
            return reminderRepository.findPendingRemindersByUser(userOpt.get());
        }
        throw new RuntimeException("User not found");
    }

    @Transactional(readOnly = true)
    public List<Reminder> getDueReminders() {
        return reminderRepository.findDueReminders(LocalDateTime.now());
    }

    @Transactional(readOnly = true)
    public Long countPendingRemindersByUser(Long userId) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isPresent()) {
            return reminderRepository.countPendingRemindersByUser(userOpt.get());
        }
        return 0L;
    }
}