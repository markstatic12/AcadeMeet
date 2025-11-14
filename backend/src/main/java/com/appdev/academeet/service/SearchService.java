package com.appdev.academeet.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.appdev.academeet.model.Comment;
import com.appdev.academeet.model.Note;
import com.appdev.academeet.model.Session;
import com.appdev.academeet.model.User;
import com.appdev.academeet.repository.CommentRepository;
import com.appdev.academeet.repository.NoteRepository;
import com.appdev.academeet.repository.SessionRepository;
import com.appdev.academeet.repository.UserRepository;

@Service
public class SearchService {
    
    @Autowired
    private SessionRepository sessionRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private NoteRepository noteRepository;
    
    @Autowired
    private CommentRepository commentRepository;
    
    // Unified search across all content types
    @Transactional(readOnly = true)
    public Map<String, Object> searchAll(String query, Integer limit) {
        int searchLimit = limit != null ? limit : 10;
        
        Map<String, Object> results = new HashMap<>();
        results.put("sessions", searchSessions(query, searchLimit));
        results.put("users", searchUsers(query, searchLimit));
        results.put("notes", searchNotes(query, searchLimit));
        results.put("comments", searchComments(query, searchLimit));
        results.put("query", query);
        
        return results;
    }
    
    // Search sessions
    @Transactional(readOnly = true)
    public List<Session> searchSessions(String query, int limit) {
        // Search by title and description
        return sessionRepository.findAll().stream()
                .filter(session -> 
                    session.getTitle().toLowerCase().contains(query.toLowerCase()) ||
                    (session.getDescription() != null && 
                     session.getDescription().toLowerCase().contains(query.toLowerCase())))
                .limit(limit)
                .collect(Collectors.toList());
    }
    
    // Search users
    @Transactional(readOnly = true)
    public List<User> searchUsers(String query, int limit) {
        String lowerQuery = query.toLowerCase();
        return userRepository.findAll().stream()
                .filter(user ->
                    user.getName().toLowerCase().contains(lowerQuery) ||
                    user.getEmail().toLowerCase().contains(lowerQuery) ||
                    (user.getProgram() != null && 
                     user.getProgram().toLowerCase().contains(lowerQuery)))
                .limit(limit)
                .collect(Collectors.toList());
    }
    
    // Search notes
    @Transactional(readOnly = true)
    public List<Note> searchNotes(String query, int limit) {
        return noteRepository.findAll().stream()
                .filter(note ->
                    note.getTitle().toLowerCase().contains(query.toLowerCase()) ||
                    note.getContent().toLowerCase().contains(query.toLowerCase()))
                .limit(limit)
                .collect(Collectors.toList());
    }
    
    // Search comments
    @Transactional(readOnly = true)
    public List<Comment> searchComments(String query, int limit) {
        return commentRepository.findAll().stream()
                .filter(comment ->
                    comment.getContent().toLowerCase().contains(query.toLowerCase()))
                .limit(limit)
                .collect(Collectors.toList());
    }
    
    // Advanced session search with filters
    @Transactional(readOnly = true)
    public List<Session> advancedSessionSearch(String query, String privacyType, 
                                                String sessionType, String status) {
        return sessionRepository.findAll().stream()
                .filter(session -> {
                    boolean matchesQuery = query == null || query.isEmpty() ||
                        session.getTitle().toLowerCase().contains(query.toLowerCase()) ||
                        (session.getDescription() != null && 
                         session.getDescription().toLowerCase().contains(query.toLowerCase()));
                    
                    // Note: These filters depend on SessionEnhanced fields
                    // Once Session.java is updated with these fields, uncomment:
                    // boolean matchesPrivacy = privacyType == null || 
                    //     session.getPrivacyType().equals(privacyType);
                    // boolean matchesType = sessionType == null || 
                    //     session.getSessionType().equals(sessionType);
                    // boolean matchesStatus = status == null || 
                    //     session.getStatus().equals(status);
                    
                    return matchesQuery;
                    // return matchesQuery && matchesPrivacy && matchesType && matchesStatus;
                })
                .collect(Collectors.toList());
    }
    
    // Search sessions by topic
    @Transactional(readOnly = true)
    public List<Session> searchSessionsByTopic(Long topicId, int limit) {
        // TODO: Implement after Topic-Session relationship is established
        // This will use SessionTag join table
        return new ArrayList<>();
    }
    
    // Search sessions by tag
    @Transactional(readOnly = true)
    public List<Session> searchSessionsByTag(String tagName, int limit) {
        // TODO: Implement after Tag-Session relationship is established
        // This will use SessionTag join table
        return new ArrayList<>();
    }
    
    // Search sessions by tags
    @Transactional(readOnly = true)
    public List<Session> searchSessionsByTags(List<String> tagNames, int limit) {
        // TODO: Implement after Tag-Session relationship is established
        return new ArrayList<>();
    }
    
    // Search users by program
    @Transactional(readOnly = true)
    public List<User> searchUsersByProgram(String program, int limit) {
        return userRepository.findAll().stream()
                .filter(user -> user.getProgram() != null &&
                        user.getProgram().equalsIgnoreCase(program))
                .limit(limit)
                .collect(Collectors.toList());
    }
    
    // Search users by year level
    @Transactional(readOnly = true)
    public List<User> searchUsersByYearLevel(String yearLevel, int limit) {
        try {
            Integer yearLevelInt = Integer.parseInt(yearLevel);
            return userRepository.findAll().stream()
                    .filter(user -> user.getYearLevel() != null &&
                            user.getYearLevel().equals(yearLevelInt))
                    .limit(limit)
                    .collect(Collectors.toList());
        } catch (NumberFormatException e) {
            return new ArrayList<>();
        }
    }
    
    // Get search suggestions based on popular content
    @Transactional(readOnly = true)
    public Map<String, Object> getSearchSuggestions() {
        Map<String, Object> suggestions = new HashMap<>();
        
        // Get popular session titles (top 5)
        List<String> sessionTitles = sessionRepository.findAll().stream()
                .limit(5)
                .map(Session::getTitle)
                .collect(Collectors.toList());
        
        // Get common programs
        Set<String> programs = userRepository.findAll().stream()
                .map(User::getProgram)
                .filter(Objects::nonNull)
                .collect(Collectors.toSet());
        
        suggestions.put("recentSessions", sessionTitles);
        suggestions.put("programs", programs);
        
        return suggestions;
    }
    
    // Autocomplete search
    @Transactional(readOnly = true)
    public List<String> autocomplete(String prefix, String type, int limit) {
        String lowerPrefix = prefix.toLowerCase();
        
        return switch (type) {
            case "sessions" -> sessionRepository.findAll().stream()
                    .map(Session::getTitle)
                    .filter(title -> title.toLowerCase().startsWith(lowerPrefix))
                    .distinct()
                    .limit(limit)
                    .collect(Collectors.toList());
                    
            case "users" -> userRepository.findAll().stream()
                    .map(User::getName)
                    .filter(name -> name.toLowerCase().startsWith(lowerPrefix))
                    .distinct()
                    .limit(limit)
                    .collect(Collectors.toList());
                    
            case "programs" -> userRepository.findAll().stream()
                    .map(User::getProgram)
                    .filter(Objects::nonNull)
                    .filter(program -> program.toLowerCase().startsWith(lowerPrefix))
                    .distinct()
                    .limit(limit)
                    .collect(Collectors.toList());
                    
            default -> new ArrayList<>();
        };
    }
    
    // Get trending searches (mock implementation - would need search history table)
    @Transactional(readOnly = true)
    public List<String> getTrendingSearches(int limit) {
        // Mock implementation
        // In production, this would track search queries in a separate table
        return List.of(
            "Mathematics",
            "Programming",
            "Physics",
            "Chemistry",
            "English"
        ).stream().limit(limit).collect(Collectors.toList());
    }
}
