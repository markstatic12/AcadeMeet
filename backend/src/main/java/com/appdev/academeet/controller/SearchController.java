package com.appdev.academeet.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.appdev.academeet.dto.SessionDTO;
import com.appdev.academeet.model.User;
import com.appdev.academeet.service.SearchService;
import com.appdev.academeet.service.UserService;

@RestController
@RequestMapping("/api/search")
public class SearchController extends BaseController {

    @Autowired
    private SearchService searchService;

    @Autowired
    private UserService userService;

    /**
     * Search for both users and sessions
     * GET /api/search?q=keyword&sortBy=relevance
     */
    @GetMapping
    public ResponseEntity<?> searchAll(
            @RequestParam(required = false) String q,
            @RequestParam(defaultValue = "relevance") String sortBy) {
        
        Map<String, Object> response = new HashMap<>();
        
        if (q == null || q.trim().isEmpty()) {
            response.put("users", List.of());
            response.put("sessions", List.of());
            return ResponseEntity.ok(response);
        }
        
        // Search users
        List<Map<String, Object>> users = searchService.searchUsers(q, null, null, sortBy)
                .stream()
                .map(this::userToMap)
                .collect(Collectors.toList());
        
        // Search sessions
        List<SessionDTO> sessions = searchService.searchSessions(q, null, null, null, sortBy);
        
        response.put("users", users);
        response.put("sessions", sessions);
        
        return ResponseEntity.ok(response);
    }

    /**
     * Search for users only with filters
     * GET /api/search/users?q=keyword&program=BSIT&yearLevel=3&sortBy=relevance
     */
    @GetMapping("/users")
    public ResponseEntity<?> searchUsers(
            @RequestParam(required = false) String q,
            @RequestParam(required = false) String program,
            @RequestParam(required = false) Integer yearLevel,
            @RequestParam(defaultValue = "relevance") String sortBy) {
        
        List<User> users = searchService.searchUsers(q, program, yearLevel, sortBy);
        
        List<Map<String, Object>> userList = users.stream()
                .map(this::userToMap)
                .collect(Collectors.toList());
        
        return ResponseEntity.ok(userList);
    }

    /**
     * Search for sessions only with filters
     * GET /api/search/sessions?q=keyword&date=2025-12-31&timeOfDay=morning&privacy=public&sortBy=relevance
     */
    @GetMapping("/sessions")
    public ResponseEntity<?> searchSessions(
            @RequestParam(required = false) String q,
            @RequestParam(required = false) String date,
            @RequestParam(required = false) String timeOfDay,
            @RequestParam(required = false) String privacy,
            @RequestParam(defaultValue = "relevance") String sortBy) {
        
        List<SessionDTO> sessions = searchService.searchSessions(q, date, timeOfDay, privacy, sortBy);
        return ResponseEntity.ok(sessions);
    }

    /**
     * Helper method to convert User entity to Map for response
     */
    private Map<String, Object> userToMap(User user) {
        Map<String, Object> userMap = new HashMap<>();
        userMap.put("id", user.getId());
        userMap.put("name", user.getName());
        userMap.put("email", user.getEmail());
        userMap.put("program", user.getProgram());
        userMap.put("yearLevel", user.getYearLevel());
        userMap.put("bio", user.getBio());
        userMap.put("profileImageUrl", user.getProfileImageUrl());
        userMap.put("studentId", formatStudentId(user));
        
        // Add follower counts
        userMap.put("followers", userService.getFollowerCount(user.getId()));
        userMap.put("following", userService.getFollowingCount(user.getId()));
        
        return userMap;
    }

    /**
     * Helper method to format student ID
     * Format: "PROGRAM, YY-XXXX-XXX" (placeholder format)
     */
    private String formatStudentId(User user) {
        String program = user.getProgram() != null ? user.getProgram() : "N/A";
        return String.format("%s, 23-2684-%03d", program, user.getId() % 1000);
    }
}
