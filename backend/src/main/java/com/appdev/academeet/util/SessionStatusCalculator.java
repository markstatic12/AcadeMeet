package com.appdev.academeet.util;

import java.time.LocalDateTime;

import com.appdev.academeet.model.Session;
import com.appdev.academeet.model.SessionStatus;

public class SessionStatusCalculator {
    public static SessionStatus calculateStatus(Session session) {
       
        SessionStatus currentStatus = session.getSessionStatus();
        if (currentStatus == SessionStatus.DELETED || 
            currentStatus == SessionStatus.CANCELLED || 
            currentStatus == SessionStatus.TRASH) {
            return currentStatus;
        }
        
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime startTime = session.getStartTime();
        LocalDateTime endTime = session.getEndTime();
        
        if (startTime == null || endTime == null) {
            return SessionStatus.SCHEDULED;
        }
        
        if (now.isBefore(startTime)) {
            return SessionStatus.SCHEDULED;
        }
        
        if (now.isAfter(startTime) && now.isBefore(endTime)) {
            return SessionStatus.ACTIVE;
        }
        
        return SessionStatus.COMPLETED;
    }
}
