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

    @Transactional
    public void createRemindersForSession(User user, Session session) {
        if (reminderRepository.existsByUserIdAndSessionId(user.getId(), session.getId())) {
            return;
        }

        LocalDateTime sessionStart = session.getStartTime();
        LocalDateTime now = LocalDateTime.now();

        LocalDateTime dayBeforeTime = sessionStart.minusDays(1);
        if (dayBeforeTime.isBefore(sessionStart) && sessionStart.isAfter(now)) {
            Reminder dayBeforeReminder = new Reminder(
                user,
                session,
                ReminderType.DAY_BEFORE,
                dayBeforeTime
            );
            reminderRepository.save(dayBeforeReminder);
        }

        LocalDateTime oneHourBeforeTime = sessionStart.minusHours(1);
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

    @Transactional(readOnly = true)
    public List<ReminderDTO> getActiveReminders(Long userId) {
        LocalDateTime now = LocalDateTime.now();
        List<Reminder> allReminders = reminderRepository.findActiveRemindersByUserId(userId, now);

        Map<Long, Reminder> latestReminderPerSession = new java.util.HashMap<>();
        for (Reminder reminder : allReminders) {
            Long sessionId = reminder.getSession().getId();
            if (!latestReminderPerSession.containsKey(sessionId)) {
                latestReminderPerSession.put(sessionId, reminder);
            }
        }
        
        return latestReminderPerSession.values().stream()
            .map(this::convertToDTO)
            .sorted((a, b) -> {
                int readCompare = Boolean.compare(a.isRead(), b.isRead());
                if (readCompare != 0) return readCompare;
                return b.getScheduledTime().compareTo(a.getScheduledTime());
            })
            .collect(Collectors.toList());
    }

    @Transactional
    public void markAsRead(Long reminderId, Long userId) {
        Reminder reminder = reminderRepository.findById(reminderId)
            .orElseThrow(() -> new RuntimeException("Reminder not found"));
        
        if (!reminder.getUser().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized");
        }

        reminder.markAsRead();
        reminderRepository.save(reminder);
    }

    @Transactional
    public void deleteRemindersForUserSession(Long userId, Long sessionId) {
        reminderRepository.deleteByUserIdAndSessionId(userId, sessionId);
    }
    @Transactional(readOnly = true)
    public Long getUnreadCount(Long userId) {
        return reminderRepository.countUnreadReminders(userId, LocalDateTime.now());
    }
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

    private String generateMessage(ReminderType type, Session session, boolean isOwner) {
        String title = session.getTitle();
        LocalDateTime startTime = session.getStartTime();
        String formattedTime = startTime.format(DateTimeFormatter.ofPattern("h:mm a"));

        switch (type) {
            case DAY_BEFORE:
                return isOwner
                    ? String.format("⏰ Your session \"%s\" is scheduled for tomorrow at %s.", title, formattedTime)
                    : String.format("⏰ Upcoming session: \"%s\" tomorrow at %s.", title, formattedTime);

            case ONE_HOUR_BEFORE:
                return isOwner
                    ? String.format("⏰ Your session \"%s\" is coming up today at %s.", title, formattedTime)
                    : String.format("⏰ \"%s\" is coming up today at %s.", title, formattedTime);

            default:
                return "⏰ Reminder for \"" + title + "\"";
        }
    }
}
