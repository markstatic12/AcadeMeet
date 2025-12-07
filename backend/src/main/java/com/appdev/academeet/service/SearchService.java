package com.appdev.academeet.service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.appdev.academeet.dto.SessionDTO;
import com.appdev.academeet.model.Session;
import com.appdev.academeet.model.SessionStatus;
import com.appdev.academeet.model.SessionType;
import com.appdev.academeet.model.User;
import com.appdev.academeet.repository.SessionRepository;
import com.appdev.academeet.repository.UserRepository;

@Service
public class SearchService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SessionRepository sessionRepository;

    /**
     * Search for users with optional filters
     * 
     * @param keyword Case-insensitive search term for name, email
     * @param program Filter by program (e.g., "BSIT", "BSCS")
     * @param yearLevel Filter by year level (1-4)
     * @param sortBy Sort order: "relevance", "name"
     * @return List of matching users
     */
    @Transactional(readOnly = true)
    public List<User> searchUsers(String keyword, String program, Integer yearLevel, String sortBy) {
        List<User> users = new ArrayList<>();

        // If no filters, return empty list to avoid loading all users
        if ((keyword == null || keyword.trim().isEmpty()) && program == null && yearLevel == null) {
            return users;
        }

        // Start with all users or filtered by keyword
        if (keyword != null && !keyword.trim().isEmpty()) {
            // Case-insensitive search in name and email
            String lowerKeyword = keyword.toLowerCase();
            users = userRepository.findAll().stream()
                    .filter(user -> 
                        (user.getName() != null && user.getName().toLowerCase().contains(lowerKeyword)) ||
                        (user.getEmail() != null && user.getEmail().toLowerCase().contains(lowerKeyword)) ||
                        (user.getProgram() != null && user.getProgram().toLowerCase().contains(lowerKeyword))
                    )
                    .collect(Collectors.toList());
        } else {
            users = userRepository.findAll();
        }

        // Apply program filter
        if (program != null && !program.trim().isEmpty() && !program.equalsIgnoreCase("All Programs")) {
            final String programFilter = program.trim();
            users = users.stream()
                    .filter(user -> user.getProgram() != null && 
                                    user.getProgram().equalsIgnoreCase(programFilter))
                    .collect(Collectors.toList());
        }

        // Apply year level filter
        if (yearLevel != null) {
            users = users.stream()
                    .filter(user -> user.getYearLevel() != null && 
                                    user.getYearLevel().equals(yearLevel))
                    .collect(Collectors.toList());
        }

        // Sort results
        if ("name".equalsIgnoreCase(sortBy)) {
            users.sort(Comparator.comparing(User::getName, String.CASE_INSENSITIVE_ORDER));
        } else {
            // Default to relevance (keyword matches prioritized)
            if (keyword != null && !keyword.trim().isEmpty()) {
                final String lowerKeyword = keyword.toLowerCase();
                users.sort((u1, u2) -> {
                    boolean u1NameMatch = u1.getName() != null && 
                                          u1.getName().toLowerCase().startsWith(lowerKeyword);
                    boolean u2NameMatch = u2.getName() != null && 
                                          u2.getName().toLowerCase().startsWith(lowerKeyword);
                    
                    if (u1NameMatch && !u2NameMatch) return -1;
                    if (!u1NameMatch && u2NameMatch) return 1;
                    
                    return String.CASE_INSENSITIVE_ORDER.compare(
                        u1.getName() != null ? u1.getName() : "",
                        u2.getName() != null ? u2.getName() : ""
                    );
                });
            }
        }

        return users;
    }

    /**
     * Search for sessions with optional filters
     * 
     * @param keyword Case-insensitive search term for title, location, tags
     * @param date Filter by specific date (format: "yyyy-MM-dd")
     * @param timeOfDay Filter by time of day: "morning", "afternoon", "evening"
     * @param privacy Filter by privacy: "public", "private", or null for all
     * @param sortBy Sort order: "relevance", "newest", "oldest"
     * @return List of matching sessions as DTOs
     */
    @Transactional(readOnly = true)
    public List<SessionDTO> searchSessions(String keyword, String date, String timeOfDay, 
                                           String privacy, String sortBy) {
        // If no filters, return empty list
        if ((keyword == null || keyword.trim().isEmpty()) && date == null && 
            timeOfDay == null && privacy == null) {
            return new ArrayList<>();
        }

        // Start with all active sessions
        List<Session> sessions = sessionRepository.findAll().stream()
                .filter(session -> session.getSessionStatus() == SessionStatus.ACTIVE)
                .collect(Collectors.toList());

        // Apply keyword filter (search in title, location, description, tags)
        if (keyword != null && !keyword.trim().isEmpty()) {
            final String lowerKeyword = keyword.toLowerCase();
            sessions = sessions.stream()
                    .filter(session -> 
                        (session.getTitle() != null && 
                         session.getTitle().toLowerCase().contains(lowerKeyword)) ||
                        (session.getLocation() != null && 
                         session.getLocation().toLowerCase().contains(lowerKeyword)) ||
                        (session.getDescription() != null && 
                         session.getDescription().toLowerCase().contains(lowerKeyword)) ||
                        (session.getTags() != null && 
                         session.getTags().stream()
                                .anyMatch(tag -> tag.toLowerCase().contains(lowerKeyword)))
                    )
                    .collect(Collectors.toList());
        }

        // Apply date filter
        if (date != null && !date.trim().isEmpty()) {
            try {
                LocalDate filterDate = LocalDate.parse(date);
                sessions = sessions.stream()
                        .filter(session -> session.getStartTime() != null &&
                                          session.getStartTime().toLocalDate().equals(filterDate))
                        .collect(Collectors.toList());
            } catch (Exception e) {
                // Invalid date format, skip filter
            }
        }

        // Apply time of day filter
        if (timeOfDay != null && !timeOfDay.trim().isEmpty() && !timeOfDay.equalsIgnoreCase("Any Time")) {
            sessions = sessions.stream()
                    .filter(session -> {
                        if (session.getStartTime() == null) return false;
                        LocalTime time = session.getStartTime().toLocalTime();
                        int hour = time.getHour();
                        
                        switch (timeOfDay.toLowerCase()) {
                            case "morning":
                                // 6:00 AM to 11:59 AM (hour 6-11)
                                return hour >= 6 && hour < 12;
                            case "afternoon":
                                // 12:00 PM to 5:59 PM (hour 12-17)
                                return hour >= 12 && hour < 18;
                            case "evening":
                                // 6:00 PM to 11:59 PM (hour 18-23)
                                return hour >= 18 && hour < 24;
                            case "night":
                                // 12:00 AM to 5:59 AM (hour 0-5)
                                return hour >= 0 && hour < 6;
                            default:
                                return true;
                        }
                    })
                    .collect(Collectors.toList());
        }

        // Apply privacy filter
        if (privacy != null && !privacy.trim().isEmpty() && !privacy.equalsIgnoreCase("All Sessions")) {
            SessionType privacyType = privacy.equalsIgnoreCase("public") ? 
                                      SessionType.PUBLIC : SessionType.PRIVATE;
            sessions = sessions.stream()
                    .filter(session -> session.getSessionPrivacy() == privacyType)
                    .collect(Collectors.toList());
        }

        // Sort results
        if ("newest".equalsIgnoreCase(sortBy)) {
            sessions.sort((s1, s2) -> {
                if (s1.getCreatedAt() == null) return 1;
                if (s2.getCreatedAt() == null) return -1;
                return s2.getCreatedAt().compareTo(s1.getCreatedAt());
            });
        } else if ("oldest".equalsIgnoreCase(sortBy)) {
            sessions.sort((s1, s2) -> {
                if (s1.getCreatedAt() == null) return 1;
                if (s2.getCreatedAt() == null) return -1;
                return s1.getCreatedAt().compareTo(s2.getCreatedAt());
            });
        } else {
            // Default to relevance (keyword matches in title prioritized)
            if (keyword != null && !keyword.trim().isEmpty()) {
                final String lowerKeyword = keyword.toLowerCase();
                sessions.sort((s1, s2) -> {
                    boolean s1TitleMatch = s1.getTitle() != null && 
                                          s1.getTitle().toLowerCase().startsWith(lowerKeyword);
                    boolean s2TitleMatch = s2.getTitle() != null && 
                                          s2.getTitle().toLowerCase().startsWith(lowerKeyword);
                    
                    if (s1TitleMatch && !s2TitleMatch) return -1;
                    if (!s1TitleMatch && s2TitleMatch) return 1;
                    
                    // Secondary sort by start time
                    if (s1.getStartTime() == null) return 1;
                    if (s2.getStartTime() == null) return -1;
                    return s1.getStartTime().compareTo(s2.getStartTime());
                });
            } else {
                // No keyword, sort by upcoming sessions first
                sessions.sort((s1, s2) -> {
                    if (s1.getStartTime() == null) return 1;
                    if (s2.getStartTime() == null) return -1;
                    return s1.getStartTime().compareTo(s2.getStartTime());
                });
            }
        }

        // Convert to DTOs
        return sessions.stream()
                .map(SessionDTO::new)
                .collect(Collectors.toList());
    }
}
