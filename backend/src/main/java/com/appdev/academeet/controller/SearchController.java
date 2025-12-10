package com.appdev.academeet.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.appdev.academeet.dto.SessionDTO;
import com.appdev.academeet.model.User;
import com.appdev.academeet.service.SearchService;

@RestController
@RequestMapping("/api/search")
public class SearchController extends BaseController {

    @Autowired
    private SearchService searchService;

    @GetMapping
    public ResponseEntity<Map<String, Object>> searchAll(
            @RequestParam(required = false) String q,
            @RequestParam(defaultValue = "relevance") String sortBy) {
        
        Long currentUserId = getCurrentUserIdOrNull();
        Map<String, Object> response = searchService.searchAll(q, sortBy, currentUserId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/users")
    public ResponseEntity<List<Map<String, Object>>> searchUsers(
            @RequestParam(required = false) String q,
            @RequestParam(required = false) String program,
            @RequestParam(required = false) Integer yearLevel,
            @RequestParam(defaultValue = "relevance") String sortBy) {
        
        Long currentUserId = getCurrentUserIdOrNull();
        List<Map<String, Object>> users = searchService.searchUsersMapped(q, program, yearLevel, sortBy, currentUserId);
        return ResponseEntity.ok(users);
    }

    @GetMapping("/sessions")
    public ResponseEntity<List<SessionDTO>> searchSessions(
            @RequestParam(required = false) String q,
            @RequestParam(required = false) String date,
            @RequestParam(required = false) String timeOfDay,
            @RequestParam(required = false) String privacy,
            @RequestParam(defaultValue = "relevance") String sortBy) {
        
        List<SessionDTO> sessions = searchService.searchSessions(q, date, timeOfDay, privacy, sortBy);
        return ResponseEntity.ok(sessions);
    }
    
    private Long getCurrentUserIdOrNull() {
        try {
            User currentUser = getAuthenticatedUser();
            return currentUser.getId();
        } catch (Exception e) {
            return null;
        }
    }
}
