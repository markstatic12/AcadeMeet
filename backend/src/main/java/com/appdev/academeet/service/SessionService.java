package com.appdev.academeet.service;

import com.appdev.academeet.dto.CreateSessionRequest;
import com.appdev.academeet.dto.SessionDetailsDto; // UPDATED
import com.appdev.academeet.dto.SessionResponse;

import com.appdev.academeet.model.Session;
import com.appdev.academeet.model.Tag; // NEW
import com.appdev.academeet.model.User;

import com.appdev.academeet.repository.SessionRepository;
import com.appdev.academeet.repository.TagRepository; // NEW
import com.appdev.academeet.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional; // NEW

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.Month;
import java.time.format.DateTimeFormatter; // NEW
import java.time.format.DateTimeParseException;
import java.util.HashSet; // NEW
import java.util.List; // NEW
import java.util.Map;
import java.util.Optional;
import java.util.Set; // NEW
import java.util.stream.Collectors; // NEW

@Service
public class SessionService {
    @Autowired
    private SessionRepository sessionRepository;

    @Autowired
    private UserRepository userRepository;

    // NEW: Inject the TagRepository
    @Autowired
    private TagRepository tagRepository;

    // UPDATED: Added @Transactional to ensure data integrity
    @Transactional
    public SessionResponse createSession(CreateSessionRequest request) {
        
        // UPDATED: Added try/catch block
        try {
            // 1. Find the Host User
            Optional<User> hostOptional = userRepository.findByName(request.getHost());
            
            if (hostOptional.isEmpty()) {
                hostOptional = userRepository.findById(1L); // Fallback to user 1
                if(hostOptional.isEmpty()) {
                    return new SessionResponse(null, null, "Error: No host user found.");
                }
            }
            User host = hostOptional.get();

            // 2. Convert Date and Time
            LocalDateTime startDateTime = parseDateTime(request.getYear(), request.getMonth(), request.getDay(), request.getStartTime());
            LocalDateTime endDateTime = null;
            
            if (request.getEndTime() != null && !request.getEndTime().isEmpty()) {
                endDateTime = parseDateTime(request.getYear(), request.getMonth(), request.getDay(), request.getEndTime());
            }
            
            // NEW: 3. Handle Tags
            Set<Tag> sessionTags = new HashSet<>();
            if (request.getTags() != null) {
                for (String tagName : request.getTags()) {
                    // Find tag or create it if it doesn't exist
                    Tag tag = tagRepository.findByName(tagName)
                            .orElseGet(() -> tagRepository.save(new Tag(tagName)));
                    sessionTags.add(tag);
                }
            }

            // 4. Create new Session entity
            Session session = new Session();
            session.setTitle(request.getTitle());
            session.setHost(host);
            session.setLocation(request.getLocation());
            session.setDescription(request.getDescription());
            session.setAdditionalNotes(request.getAdditionalNotes());
            session.setStartDateTime(startDateTime);
            session.setEndDateTime(endDateTime);
            session.setTags(sessionTags); // NEW: Set the tags

            // 5. Save to database
            Session savedSession = sessionRepository.save(session);

            // 6. Return success response
            return new SessionResponse(savedSession.getId(), savedSession.getTitle(), "Session created successfully");

        } catch (DateTimeParseException e) {
            return new SessionResponse(null, request.getTitle(), "Error: Invalid date or time format. " + e.getMessage());
        } catch (Exception e) {
            // Catch-all for other potential errors (e.g., database)
            return new SessionResponse(null, request.getTitle(), "Error: Could not create session. " + e.getMessage());
        }
    }

    // ... (parseDateTime helper method is correct)
    private LocalDateTime parseDateTime(String yearStr, String monthStr, String dayStr, String timeStr) {
        Month month = Month.valueOf(monthStr.toUpperCase());
        int day = Integer.parseInt(dayStr);
        int year = Integer.parseInt(yearStr);
        LocalTime time = LocalTime.parse(timeStr);
        return LocalDateTime.of(year, month, day, time.getHour(), time.getMinute());
    }

    // UPDATED: Implemented getAllSessions
    public List<SessionDetailsDto> getAllSessions() {
        // 1. Get entities from repo
        List<Session> sessions = sessionRepository.findAllByOrderByStartDateTimeAsc();
        
        // 2. Convert to DTOs
        return sessions.stream()
                .map(this::mapSessionToDetailsDto) // Use helper method
                .collect(Collectors.toList());
    }

    // NEW: Helper method to convert Entity -> DTO
    private SessionDetailsDto mapSessionToDetailsDto(Session session) {
        SessionDetailsDto dto = new SessionDetailsDto();
        dto.setId(session.getId());
        dto.setTitle(session.getTitle());
        dto.setDescription(session.getDescription());
        dto.setLocation(session.getLocation());
        dto.setAdditionalNotes(session.getAdditionalNotes());
        
        // Get host name (checking for null)
        if (session.getHost() != null) {
            dto.setHostName(session.getHost().getName()); // Assuming User has a getName()
        }

        // Format Date and Time
        LocalDateTime start = session.getStartDateTime();
        dto.setDate(start.format(DateTimeFormatter.ofPattern("MMMM d, yyyy")));
        dto.setStartTime(start.format(DateTimeFormatter.ofPattern("HH:mm")));
        
        if (session.getEndDateTime() != null) {
            dto.setEndTime(session.getEndDateTime().format(DateTimeFormatter.ofPattern("HH:mm")));
        }

        // Get Tag Names
        List<String> tagNames = session.getTags().stream()
                .map(Tag::getName)
                .collect(Collectors.toList());
        dto.setTags(tagNames);

        return dto;
    }
}