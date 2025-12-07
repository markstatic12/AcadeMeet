package com.appdev.academeet.service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
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

        // Always create "Day Before" reminder (will show if scheduledTime <= now)
        LocalDateTime dayBeforeTime = sessionStart.minusDays(1);
        // Only create if the scheduled time hasn't passed AND session hasn't started yet
        if (dayBeforeTime.isBefore(sessionStart) && sessionStart.isAfter(now)) {
            Reminder dayBeforeReminder = new Reminder(
                user,
                session,
                ReminderType.DAY_BEFORE,
                dayBeforeTime
            );
            reminderRepository.save(dayBeforeReminder);
        }

        // Always create "1 Hour Before" reminder (will show if scheduledTime <= now)
        LocalDateTime oneHourBeforeTime = sessionStart.minusHours(1);
        // Only create if the scheduled time is before session start AND session hasn't started yet
        if (oneHourBeforeTime.isBefore(sessionStart) && sessionStart.isAfter(now)) {
            Reminder oneHourReminder = new Reminder(
                user,
                session,
                ReminderType.ONE_HOUR_BEFORE,
                oneHourBeforeTime
            );
            reminderRepository.save(oneHourReminder);
        }
    }

    /**
     * Get active reminders for user
     * Returns only the MOST RECENT reminder per session
     * Sorted by: unread first, then by scheduled time descending
     */
    @Transactional(readOnly = true)
    public List<ReminderDTO> getActiveReminders(Long userId) {
        LocalDateTime now = LocalDateTime.now();
        List<Reminder> allReminders = reminderRepository.findActiveRemindersByUserId(userId, now);

        // Group by session and keep only the most recent reminder per session
        Map<Long, Reminder> latestReminderPerSession = new java.util.HashMap<>();
        for (Reminder reminder : allReminders) {
            Long sessionId = reminder.getSession().getId();
            // Since query sorts by scheduledTime DESC, first one we see is the latest
            if (!latestReminderPerSession.containsKey(sessionId)) {
                latestReminderPerSession.put(sessionId, reminder);
            }
        }

        // Convert to DTOs and sort: unread first, then by scheduled time descending
        return latestReminderPerSession.values().stream()
            .map(this::convertToDTO)
            .sorted((a, b) -> {
                // Sort by read status first (unread = false comes first)
                int readCompare = Boolean.compare(a.isRead(), b.isRead());
                if (readCompare != 0) return readCompare;
                // Then by scheduled time descending (most recent first)
                return b.getScheduledTime().compareTo(a.getScheduledTime());
            })
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
     * Generate time-aware message template based on reminder type and user role
     */
    private String generateMessage(ReminderType type, Session session, boolean isOwner) {
        String title = session.getTitle();
        LocalDateTime startTime = session.getStartTime();
        String formattedTime = startTime.format(DateTimeFormatter.ofPattern("h:mm a"));

        switch (type) {
            case DAY_BEFORE:
                // 24+ hours before: Session is tomorrow
                return isOwner
                    ? String.format("⏰ Your session \"%s\" is scheduled for tomorrow at %s.", title, formattedTime)
                    : String.format("⏰ Upcoming session: \"%s\" tomorrow at %s.", title, formattedTime);

            case ONE_HOUR_BEFORE:
                // 1-23 hours before: Session is coming up today
                return isOwner
                    ? String.format("⏰ Your session \"%s\" is coming up today at %s.", title, formattedTime)
                    : String.format("⏰ \"%s\" is coming up today at %s.", title, formattedTime);

            default:
                return "⏰ Reminder for \"" + title + "\"";
        }
    }
}
