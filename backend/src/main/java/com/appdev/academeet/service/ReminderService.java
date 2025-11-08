package com.appdev.academeet.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.appdev.academeet.model.Reminder;
import com.appdev.academeet.model.Session;
import com.appdev.academeet.model.Student;
import com.appdev.academeet.repository.ReminderRepository;
import com.appdev.academeet.repository.SessionRepository;
import com.appdev.academeet.repository.StudentRepository;

@Service
public class ReminderService {
    
    @Autowired
    private ReminderRepository reminderRepository;
    
    @Autowired
    private SessionRepository sessionRepository;
    
    @Autowired
    private StudentRepository studentRepository;
    
    // Create a reminder for a session
    @Transactional
    public Reminder createReminder(Long studentId, Integer sessionId, LocalDateTime reminderTime) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found with id: " + studentId));
        
        Session session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new RuntimeException("Session not found with id: " + sessionId));
        
        // Validate reminder time is before session
        if (reminderTime.isAfter(session.getStartTime())) {
            throw new RuntimeException("Reminder time must be before session start time");
        }
        
        // Check if reminder already exists
        if (reminderRepository.existsByStudentAndSessionAndReminderTime(studentId, sessionId, reminderTime)) {
            throw new RuntimeException("Reminder already exists for this session and time");
        }
        
        Reminder reminder = new Reminder();
        reminder.setStudent(student);
        reminder.setSession(session);
        reminder.setReminderTime(reminderTime);
        reminder.setIsSent(false);
        reminder.setCreatedAt(LocalDateTime.now());
        
        return reminderRepository.save(reminder);
    }
    
    // Create reminder with minutes before session
    @Transactional
    public Reminder createReminderMinutesBefore(Long studentId, Integer sessionId, int minutesBefore) {
        Session session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new RuntimeException("Session not found with id: " + sessionId));
        
        LocalDateTime reminderTime = session.getStartTime().minusMinutes(minutesBefore);
        
        // Validate reminder time is not in the past
        if (reminderTime.isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Cannot create reminder for past time");
        }
        
        return createReminder(studentId, sessionId, reminderTime);
    }
    
    // Get all reminders for a student
    @Transactional(readOnly = true)
    public List<Reminder> getStudentReminders(Long studentId) {
        return reminderRepository.findByStudent(studentId);
    }
    
    // Get pending reminders for a student
    @Transactional(readOnly = true)
    public List<Reminder> getPendingReminders(Long studentId) {
        return reminderRepository.findUpcomingByStudent(studentId);
    }
    
    // Get all reminders for a session
    @Transactional(readOnly = true)
    public List<Reminder> getSessionReminders(Integer sessionId) {
        return reminderRepository.findBySession(sessionId);
    }
    
    // Get due reminders (ready to be sent)
    @Transactional(readOnly = true)
    public List<Reminder> getDueReminders() {
        return reminderRepository.findPendingReminders(LocalDateTime.now());
    }
    
    // Get reminders to send soon (within specified minutes)
    @Transactional(readOnly = true)
    public List<Reminder> getRemindersToSendSoon(int withinMinutes) {
        return reminderRepository.findRemindersToSendSoon(LocalDateTime.now(), withinMinutes);
    }
    
    // Get upcoming reminders for a student
    @Transactional(readOnly = true)
    public List<Reminder> getUpcomingReminders(Long studentId, int days) {
        LocalDateTime endTime = LocalDateTime.now().plusDays(days);
        return reminderRepository.findByStudentAndTimeRange(studentId, LocalDateTime.now(), endTime);
    }
    
    // Mark reminder as sent
    @Transactional
    public void markAsSent(Long reminderId) {
        Reminder reminder = reminderRepository.findById(reminderId)
                .orElseThrow(() -> new RuntimeException("Reminder not found with id: " + reminderId));
        
        reminder.markAsSent();
        reminderRepository.save(reminder);
    }
    
    // Mark multiple reminders as sent
    @Transactional
    public void markMultipleAsSent(List<Long> reminderIds) {
        List<Reminder> reminders = reminderRepository.findAllById(reminderIds);
        LocalDateTime now = LocalDateTime.now();
        
        reminders.forEach(reminder -> {
            reminder.setIsSent(true);
            reminder.setSentAt(now);
        });
        
        reminderRepository.saveAll(reminders);
    }
    
    // Delete a reminder
    @Transactional
    public void deleteReminder(Long reminderId, Long studentId) {
        Reminder reminder = reminderRepository.findById(reminderId)
                .orElseThrow(() -> new RuntimeException("Reminder not found with id: " + reminderId));
        
        // Verify ownership
        if (!reminder.getStudent().getStudentId().equals(studentId)) {
            throw new RuntimeException("Not authorized to delete this reminder");
        }
        
        reminderRepository.delete(reminder);
    }
    
    // Delete all reminders for a session
    @Transactional
    public void deleteSessionReminders(Integer sessionId) {
        reminderRepository.deleteBySessionSessionId(sessionId);
    }
    
    // Delete old sent reminders
    @Transactional
    public void deleteOldSentReminders(int daysOld) {
        LocalDateTime cutoffDate = LocalDateTime.now().minusDays(daysOld);
        reminderRepository.deleteOldSentReminders(cutoffDate);
    }
    
    // Count pending reminders for a student
    @Transactional(readOnly = true)
    public long countPendingReminders(Long studentId) {
        return reminderRepository.countPendingByStudent(studentId);
    }
    
    // Check if reminder exists
    @Transactional(readOnly = true)
    public boolean reminderExists(Long studentId, Integer sessionId, LocalDateTime reminderTime) {
        return reminderRepository.existsByStudentAndSessionAndReminderTime(studentId, sessionId, reminderTime);
    }
    
    // Update reminder time
    @Transactional
    public Reminder updateReminderTime(Long reminderId, Long studentId, LocalDateTime newReminderTime) {
        Reminder reminder = reminderRepository.findById(reminderId)
                .orElseThrow(() -> new RuntimeException("Reminder not found with id: " + reminderId));
        
        // Verify ownership
        if (!reminder.getStudent().getStudentId().equals(studentId)) {
            throw new RuntimeException("Not authorized to update this reminder");
        }
        
        // Validate new time is before session
        if (newReminderTime.isAfter(reminder.getSession().getStartTime())) {
            throw new RuntimeException("Reminder time must be before session start time");
        }
        
        // Validate not already sent
        if (reminder.getIsSent()) {
            throw new RuntimeException("Cannot update a reminder that has already been sent");
        }
        
        reminder.setReminderTime(newReminderTime);
        return reminderRepository.save(reminder);
    }
}
