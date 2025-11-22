package com.appdev.academeet.service;

import com.appdev.academeet.model.Reminder;
import com.appdev.academeet.model.Session;
import com.appdev.academeet.model.User;
import com.appdev.academeet.repository.ReminderRepository;
import com.appdev.academeet.repository.SessionRepository;
import com.appdev.academeet.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

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

    @Transactional
    public Reminder createReminder(Long userId, Long sessionId, LocalDateTime reminderTime) {
        Optional<User> userOpt = userRepository.findById(userId);
        Optional<Session> sessionOpt = sessionRepository.findById(sessionId);
        
        if (userOpt.isPresent() && sessionOpt.isPresent()) {
            User user = userOpt.get();
            Session session = sessionOpt.get();
            
            Reminder reminder = new Reminder(user, session, reminderTime);
            return reminderRepository.save(reminder);
        }
        
        throw new RuntimeException("User or Session not found");
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