package com.appdev.academeet.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.appdev.academeet.dto.NotificationDTO;
import com.appdev.academeet.model.Notification;
import com.appdev.academeet.model.NotificationType;
import com.appdev.academeet.model.Session;
import com.appdev.academeet.model.User;
import com.appdev.academeet.repository.NotificationRepository;

@Service
public class NotificationService {
    
    private final NotificationRepository notificationRepository;
    
    public NotificationService(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }
    
    @Transactional
    public void createNotification(User recipient, Session session, NotificationType type, String message) {
        Notification notification = new Notification(recipient, session, type, message);
        notificationRepository.save(notification);
    }
   
    @Transactional(readOnly = true)
    public List<NotificationDTO> getAllNotifications(Long userId) {
        return notificationRepository.findAllByUserId(userId).stream()
                .map(NotificationDTO::new)
                .collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public List<NotificationDTO> getUnreadNotifications(Long userId) {
        return notificationRepository.findUnreadByUserId(userId).stream()
                .map(NotificationDTO::new)
                .collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public Long getUnreadCount(Long userId) {
        return notificationRepository.countUnreadByUserId(userId);
    }
    
    @Transactional
    public void markAsRead(Long notificationId, Long userId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification not found"));
        
        if (!notification.getRecipient().getId().equals(userId)) {
            throw new SecurityException("Unauthorized to mark this notification as read");
        }
        
        notification.setRead(true);
        notificationRepository.save(notification);
    }
    
    @Transactional
    public void markAsUnread(Long notificationId, Long userId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification not found"));
        
        if (!notification.getRecipient().getId().equals(userId)) {
            throw new SecurityException("Unauthorized to mark this notification as unread");
        }
        
        notification.setRead(false);
        notificationRepository.save(notification);
    }
    

    @Transactional
    public void markAllAsRead(Long userId) {
        notificationRepository.markAllAsReadByUserId(userId);
    }
    
    @Transactional
    public void notifyJoinConfirmation(User user, Session session) {
        String message = String.format("✅ You have successfully joined \"%s\"", session.getTitle());
        createNotification(user, session, NotificationType.JOIN_CONFIRMATION, message);
    }

    @Transactional
    public void notifyParticipantJoined(User participant, Session session) {
        if (session.getHost().getId().equals(participant.getId())) {
            return;
        }
        
        String message = String.format("✅ %s joined your session \"%s\"", 
                participant.getName(), session.getTitle());
        createNotification(session.getHost(), session, NotificationType.PARTICIPANT_JOINED, message);
    }
    
    @Transactional
    public void notifySessionUpdated(Session session, List<User> participants) {
        String message = String.format("🔔 The session \"%s\" has been updated. Please check the details.", 
                session.getTitle());
        
        for (User participant : participants) {
            if (!participant.getId().equals(session.getHost().getId())) {
                createNotification(participant, session, NotificationType.SESSION_UPDATED, message);
            }
        }
    }

    @Transactional
    public void notifySessionCanceled(Session session, List<User> participants) {
        String message = String.format("❌ The session \"%s\" has been canceled by %s.", 
                session.getTitle(), session.getHost().getName());
        
        for (User participant : participants) {
            // Don't notify the host
            if (!participant.getId().equals(session.getHost().getId())) {
                createNotification(participant, session, NotificationType.SESSION_CANCELED, message);
            }
        }
    }

    @Transactional
    public void notifyCommentReply(User originalCommenter, User replier, Session session) {
        // Don't notify if user replies to their own comment
        if (originalCommenter.getId().equals(replier.getId())) {
            return;
        }
        
        String message = String.format("💬 %s replied to your comment in \"%s\"", 
                replier.getName(), session.getTitle());
        createNotification(originalCommenter, session, NotificationType.COMMENT_REPLY, message);
    }
    
    @Transactional
    public void notifyCommentOnSession(User commenter, Session session) {
        if (session.getHost().getId().equals(commenter.getId())) {
            return;
        }
        
        String message = String.format("💬 %s commented on your session \"%s\"", 
                commenter.getName(), session.getTitle());
        createNotification(session.getHost(), session, NotificationType.COMMENT_ON_SESSION, message);
    }
    
    @Transactional
    public void notifyNotesUploaded(Session session, List<User> participants) {
        String message = String.format("📎 New notes were uploaded for \"%s\"", session.getTitle());
        
        for (User participant : participants) {
            if (!participant.getId().equals(session.getHost().getId())) {
                createNotification(participant, session, NotificationType.NOTES_UPLOADED, message);
            }
        }
    }
}
