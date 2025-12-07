package com.appdev.academeet.service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.appdev.academeet.dto.ReminderDTO;
import com.appdev.academeet.model.Reminder;
import com.appdev.academeet.model.ReminderType;
import com.appdev.academeet.model.Session;
import com.appdev.academeet.model.User;
import com.appdev.academeet.repository.ReminderRepository;

@Service
public class ReminderService {

    private final ReminderRepository reminderRepository;

    public ReminderService(ReminderRepository reminderRepository) {
        this.reminderRepository = reminderRepository;
    }

    /**
     * Auto-create reminders when user joins or creates a session
     */
    @Transactional
    public void createRemindersForSession(User user, Session session) {
        // Check if reminders already exist
        if (reminderRepository.existsByUserIdAndSessionId(user.getId(), session.getId())) {
            return; // Already created
        }

        LocalDateTime sessionStart = session.getStartTime();
        LocalDateTime now = LocalDateTime.now();

        // Create "Day Before" reminder (if session is >24 hours away)
        if (sessionStart.isAfter(now.plusHours(24))) {
            Reminder dayBeforeReminder = new Reminder(
                user,
                session,
                ReminderType.DAY_BEFORE,
                sessionStart.minusDays(1)
            );
            reminderRepository.save(dayBeforeReminder);
        }

        // Create "1 Hour Before" reminder (if session is >1 hour away)
        if (sessionStart.isAfter(now.plusHours(1))) {
            Reminder oneHourReminder = new Reminder(
                user,
                session,
                ReminderType.ONE_HOUR_BEFORE,
                sessionStart.minusHours(1)
            );
            reminderRepository.save(oneHourReminder);
        }
    }

    /**
     * Get active reminders for user
     * Returns reminders sorted by: unread first, then by scheduled time descending
     */
    @Transactional(readOnly = true)
    public List<ReminderDTO> getActiveReminders(Long userId) {
        LocalDateTime now = LocalDateTime.now();
        List<Reminder> reminders = reminderRepository.findActiveRemindersByUserId(userId, now);

        return reminders.stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }

    /**
     * Mark reminder as read
     */
    @Transactional
    public void markAsRead(Long reminderId, Long userId) {
        Reminder reminder = reminderRepository.findById(reminderId)
            .orElseThrow(() -> new RuntimeException("Reminder not found"));

        // Verify ownership
        if (!reminder.getUser().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized");
        }

        reminder.markAsRead();
        reminderRepository.save(reminder);
    }

    /**
     * Delete all reminders for a user-session pair
     * Called when user cancels participation
     */
    @Transactional
    public void deleteRemindersForUserSession(Long userId, Long sessionId) {
        reminderRepository.deleteByUserIdAndSessionId(userId, sessionId);
    }

    /**
     * Get unread reminder count
     */
    @Transactional(readOnly = true)
    public Long getUnreadCount(Long userId) {
        return reminderRepository.countUnreadReminders(userId, LocalDateTime.now());
    }

    /**
     * Convert Reminder entity to DTO with generated message
     */
    private ReminderDTO convertToDTO(Reminder reminder) {
        Session session = reminder.getSession();
        User user = reminder.getUser();
        boolean isOwner = session.getHost().getId().equals(user.getId());

        String message = generateMessage(reminder.getType(), session, isOwner);

        return new ReminderDTO(
            reminder.getId(),
            session.getId(),
            session.getTitle(),
            message,
            reminder.getType(),
            reminder.getScheduledTime(),
            reminder.isRead(),
            reminder.getReadAt(),
            isOwner
        );
    }

    /**
     * Generate fixed message template based on reminder type and user role
     */
    private String generateMessage(ReminderType type, Session session, boolean isOwner) {
        String title = session.getTitle();
        String startTime = session.getStartTime().format(
            DateTimeFormatter.ofPattern("h:mm a")
        );

        switch (type) {
            case DAY_BEFORE:
                return isOwner
                    ? String.format("⏰ Your session %s is scheduled for tomorrow at %s.", title, startTime)
                    : String.format("⏰ Upcoming session: %s tomorrow at %s.", title, startTime);

            case ONE_HOUR_BEFORE:
                return isOwner
                    ? String.format("⏰ Your session %s starts in 1 hour.", title)
                    : String.format("⏰ %s will start in 1 hour.", title);

            default:
                return "Reminder for " + title;
        }
    }
}
