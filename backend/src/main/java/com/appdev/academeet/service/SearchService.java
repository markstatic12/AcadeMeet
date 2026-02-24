package com.appdev.academeet.service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.appdev.academeet.dto.SessionDTO;
import com.appdev.academeet.model.Session;
import com.appdev.academeet.model.SessionPrivacy;
import com.appdev.academeet.model.SessionStatus;
import com.appdev.academeet.model.User;
import com.appdev.academeet.repository.SessionRepository;
import com.appdev.academeet.repository.UserRepository;

@Service
public class SearchService {

    private final UserRepository userRepository;
    private final SessionRepository sessionRepository;
    private final UserService userService;
    
    @Autowired
    public SearchService(UserRepository userRepository, SessionRepository sessionRepository, UserService userService) {
        this.userRepository = userRepository;
        this.sessionRepository = sessionRepository;
        this.userService = userService;
    }

    @Transactional(readOnly = true)
    public Map<String, Object> searchAll(String query, String sortBy, Long currentUserId) {
        Map<String, Object> response = new HashMap<>();
        
        if (query == null || query.trim().isEmpty()) {
            response.put("users", List.of());
            response.put("sessions", List.of());
            return response;
        }
        
        List<Map<String, Object>> users = searchUsersMapped(query, null, null, sortBy, currentUserId);
        List<SessionDTO> sessions = searchSessions(query, null, null, null, sortBy);
        
        response.put("users", users);
        response.put("sessions", sessions);
        
        return response;
    }

    @Transactional(readOnly = true)
    public List<java.util.Map<String, Object>> searchUsersMapped(String keyword, String program, Integer yearLevel, String sortBy, Long currentUserId) {
        List<User> users = searchUsers(keyword, program, yearLevel, sortBy);
        
        return users.stream()
                .map(user -> mapUserToResponse(user, currentUserId))
                .collect(Collectors.toList());
    }
    
    private java.util.Map<String, Object> mapUserToResponse(User user, Long currentUserId) {
        java.util.Map<String, Object> userMap = new java.util.HashMap<>();
        userMap.put("id", user.getId());
        userMap.put("name", user.getName());
        userMap.put("email", user.getEmail());
        userMap.put("program", user.getProgram());
        userMap.put("yearLevel", user.getYearLevel());
        userMap.put("bio", user.getBio());
        userMap.put("profileImageUrl", user.getProfileImageUrl());
        userMap.put("followers", userService.getFollowerCount(user.getId()));
        userMap.put("following", userService.getFollowingCount(user.getId()));
        
        if (currentUserId != null) {
            boolean isFollowing = userService.isFollowing(currentUserId, user.getId());
            userMap.put("isFollowing", isFollowing);
        } else {
            userMap.put("isFollowing", false);
        }
        
        return userMap;
    }
    
    @Transactional(readOnly = true)
    public List<User> searchUsers(String keyword, String program, Integer yearLevel, String sortBy) {
        List<User> users = new ArrayList<>();

        if ((keyword == null || keyword.trim().isEmpty()) && program == null && yearLevel == null) {
            return users;
        }

        if (keyword != null && !keyword.trim().isEmpty()) {
            // Use repository-level LIKE query for better performance and SQL-level filtering
            users = userRepository.searchByKeyword(keyword.trim());
        } else {
            users = userRepository.findAll();
        }

        if (program != null && !program.trim().isEmpty() && !program.equalsIgnoreCase("All Programs")) {
            final String programFilter = program.trim();
            users = users.stream()
                    .filter(user -> user.getProgram() != null && 
                                    user.getProgram().equalsIgnoreCase(programFilter))
                    .collect(Collectors.toList());
        }

        if (yearLevel != null) {
            users = users.stream()
                    .filter(user -> user.getYearLevel() != null && 
                                    user.getYearLevel().equals(yearLevel))
                    .collect(Collectors.toList());
        }

        if ("name".equalsIgnoreCase(sortBy)) {
            users.sort(Comparator.comparing(User::getName, String.CASE_INSENSITIVE_ORDER));
        } else {
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

    @Transactional(readOnly = true)
    public List<SessionDTO> searchSessions(String keyword, String date, String timeOfDay, String privacy, String sortBy) {
        
        if ((keyword == null || keyword.trim().isEmpty()) && date == null && 
            timeOfDay == null && privacy == null) {
            return new ArrayList<>();
        }

        List<Session> sessions = sessionRepository.findAll().stream()
                .filter(session -> session.getSessionStatus() == SessionStatus.ACTIVE)
                .collect(Collectors.toList());

        if (keyword != null && !keyword.trim().isEmpty()) {
            final String lowerKeyword = keyword.toLowerCase();
            sessions = sessions.stream()
                    .filter(session -> 
                        (session.getTitle() != null && 
                         session.getTitle().toLowerCase().contains(lowerKeyword)) ||
                        (session.getLocation() != null && 
                         session.getLocation().toLowerCase().contains(lowerKeyword)) ||
                        (session.getTags() != null && 
                         session.getTags().stream()
                                .anyMatch(tag -> tag.toLowerCase().contains(lowerKeyword)))
                    )
                    .collect(Collectors.toList());
        }

        if (date != null && !date.trim().isEmpty()) {
            try {
                LocalDate filterDate = LocalDate.parse(date);
                sessions = sessions.stream()
                        .filter(session -> session.getStartTime() != null &&
                                          session.getStartTime().toLocalDate().equals(filterDate))
                        .collect(Collectors.toList());
            } catch (java.time.format.DateTimeParseException e) {
                org.slf4j.LoggerFactory.getLogger(SearchService.class)
                    .warn("Invalid date format provided for search: {}", date);
            }
        }

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

        if (privacy != null && !privacy.trim().isEmpty() && !privacy.equalsIgnoreCase("All Sessions")) {
            SessionPrivacy privacyType = privacy.equalsIgnoreCase("public") ? 
                                      SessionPrivacy.PUBLIC : SessionPrivacy.PRIVATE;
            sessions = sessions.stream()
                    .filter(session -> session.getSessionPrivacy() == privacyType)
                    .collect(Collectors.toList());
        }

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
            if (keyword != null && !keyword.trim().isEmpty()) {
                final String lowerKeyword = keyword.toLowerCase();
                sessions.sort((s1, s2) -> {
                    boolean s1TitleMatch = s1.getTitle() != null && 
                                          s1.getTitle().toLowerCase().startsWith(lowerKeyword);
                    boolean s2TitleMatch = s2.getTitle() != null && 
                                          s2.getTitle().toLowerCase().startsWith(lowerKeyword);
                    
                    if (s1TitleMatch && !s2TitleMatch) return -1;
                    if (!s1TitleMatch && s2TitleMatch) return 1;
                    
                    if (s1.getStartTime() == null) return 1;
                    if (s2.getStartTime() == null) return -1;
                    return s1.getStartTime().compareTo(s2.getStartTime());
                });
            } else {
                sessions.sort((s1, s2) -> {
                    if (s1.getStartTime() == null) return 1;
                    if (s2.getStartTime() == null) return -1;
                    return s1.getStartTime().compareTo(s2.getStartTime());
                });
            }
        }

        return sessions.stream()
                .map(SessionDTO::new)
                .collect(Collectors.toList());
    }
}
