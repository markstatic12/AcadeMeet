package com.appdev.academeet.service;

import com.appdev.academeet.dto.CreateSessionRequest;
import com.appdev.academeet.dto.SessionResponse;
import com.appdev.academeet.model.Session;
import com.appdev.academeet.model.User;
import com.appdev.academeet.repository.SessionRepository;
import com.appdev.academeet.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.Month;
import java.time.format.DateTimeParseException;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class SessionService {

    @Autowired
    private SessionRepository sessionRepository;

    @Autowired
    private UserRepository userRepository; // To find the host

    public SessionResponse createSession(CreateSessionRequest request) {
        
        // 1. Find the Host User
        // Note: Finding by name is not ideal. A real app would use the host's ID
        // from the security token. We may need to add findByName to UserRepository.
        Optional<User> hostOptional = userRepository.findByEmail(request.getHost()); // Assuming host is an email for now
        
        // --- This is a TEMPORARY fallback ---
        // We'll assume the first user in the DB is the host if the name isn't found
        // This is just to make it work without proper auth
        if (hostOptional.isEmpty()) {
            hostOptional = userRepository.findById(1L); // Fallback to user 1
            if(hostOptional.isEmpty()) {
                 return new SessionResponse(null, null, "Error: No host user found.");
            }
        }
        User host = hostOptional.get();

        // 2. Convert Date and Time
        LocalDateTime startDateTime;
        LocalDateTime endDateTime = null;
        try {
            startDateTime = parseDateTime(request.getYear(), request.getMonth(), request.getDay(), request.getStartTime());
            
            if (request.getEndTime() != null && !request.getEndTime().isEmpty()) {
                endDateTime = parseDateTime(request.getYear(), request.getMonth(), request.getDay(), request.getEndTime());
            }
        } catch (Exception e) {
            return new SessionResponse(null, null, "Error: Invalid date or time format.");
        }

        // 3. Create new Session entity
        Session session = new Session();
        session.setTitle(request.getTitle());
        session.setHost(host);
        session.setLocation(request.getLocation());
        session.setDescription(request.getDescription());
        session.setAdditionalNotes(request.getAdditionalNotes());
        session.setStartDateTime(startDateTime);
        session.setEndDateTime(endDateTime);
        // We will handle tags later

        // 4. Save to database
        Session savedSession = sessionRepository.save(session);

        // 5. Return success response
        return new SessionResponse(savedSession.getId(), savedSession.getTitle(), "Session created successfully");
    }

    // Helper method to parse the frontend's date/time strings
    private LocalDateTime parseDateTime(String yearStr, String monthStr, String dayStr, String timeStr) {
        // Map month name to Month enum
        Month month = Month.valueOf(monthStr.toUpperCase());
        int day = Integer.parseInt(dayStr);
        int year = Integer.parseInt(yearStr);
        
        LocalTime time = LocalTime.parse(timeStr); // Assumes "HH:mm" format (e.g., "14:30")

        return LocalDateTime.of(year, month, day, time.getHour(), time.getMinute());
    }

    // We will build this out later
    public List<SessionResponse> getAllSessions() {
        // 1. Get entities from repo
        List<Session> sessions = sessionRepository.findAllByOrderByStartDateTimeAsc();
        
        // 2. Convert to DTOs (to be implemented)
        // List<SessionResponse> responseList = ...
        
        return null; // Placeholder
    }
}