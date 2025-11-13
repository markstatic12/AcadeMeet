package com.appdev.academeet.controller;

import com.appdev.academeet.model.Comment;
import com.appdev.academeet.model.Note;
import com.appdev.academeet.model.Session;
import com.appdev.academeet.model.Student;
import com.appdev.academeet.service.SearchService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/search")
@CrossOrigin(origins = "http://localhost:5173")
public class SearchController {
    
    @Autowired
    private SearchService searchService;
    
    // Unified search across all content types
    @GetMapping
    public ResponseEntity<Map<String, Object>> searchAll(
            @RequestParam String query,
            @RequestParam(required = false) Integer limit) {
        try {
            Map<String, Object> results = searchService.searchAll(query, limit);
            return ResponseEntity.ok(results);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    // Search sessions only
    @GetMapping("/sessions")
    public ResponseEntity<List<Session>> searchSessions(
            @RequestParam String query,
            @RequestParam(defaultValue = "20") int limit) {
        try {
            List<Session> sessions = searchService.searchSessions(query, limit);
            return ResponseEntity.ok(sessions);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    // Advanced session search with filters
    @GetMapping("/sessions/advanced")
    public ResponseEntity<List<Session>> advancedSessionSearch(
            @RequestParam(required = false) String query,
            @RequestParam(required = false) String privacyType,
            @RequestParam(required = false) String sessionType,
            @RequestParam(required = false) String status) {
        try {
            List<Session> sessions = searchService.advancedSessionSearch(
                query, privacyType, sessionType, status
            );
            return ResponseEntity.ok(sessions);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    // Search sessions by topic
    @GetMapping("/sessions/topic/{topicId}")
    public ResponseEntity<List<Session>> searchSessionsByTopic(
            @PathVariable Long topicId,
            @RequestParam(defaultValue = "20") int limit) {
        try {
            List<Session> sessions = searchService.searchSessionsByTopic(topicId, limit);
            return ResponseEntity.ok(sessions);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    // Search sessions by tag
    @GetMapping("/sessions/tag/{tagName}")
    public ResponseEntity<List<Session>> searchSessionsByTag(
            @PathVariable String tagName,
            @RequestParam(defaultValue = "20") int limit) {
        try {
            List<Session> sessions = searchService.searchSessionsByTag(tagName, limit);
            return ResponseEntity.ok(sessions);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    // Search sessions by multiple tags
    @PostMapping("/sessions/tags")
    public ResponseEntity<List<Session>> searchSessionsByTags(@RequestBody TagSearchRequest request) {
        try {
            List<Session> sessions = searchService.searchSessionsByTags(
                request.getTagNames(),
                request.getLimit() != null ? request.getLimit() : 20
            );
            return ResponseEntity.ok(sessions);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    // Search students only
    @GetMapping("/students")
    public ResponseEntity<List<Student>> searchStudents(
            @RequestParam String query,
            @RequestParam(defaultValue = "20") int limit) {
        try {
            List<Student> students = searchService.searchStudents(query, limit);
            return ResponseEntity.ok(students);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    // Search students by program
    @GetMapping("/students/program/{program}")
    public ResponseEntity<List<Student>> searchStudentsByProgram(
            @PathVariable String program,
            @RequestParam(defaultValue = "20") int limit) {
        try {
            List<Student> students = searchService.searchStudentsByProgram(program, limit);
            return ResponseEntity.ok(students);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    // Search students by year level
    @GetMapping("/students/year/{yearLevel}")
    public ResponseEntity<List<Student>> searchStudentsByYearLevel(
            @PathVariable String yearLevel,
            @RequestParam(defaultValue = "20") int limit) {
        try {
            List<Student> students = searchService.searchStudentsByYearLevel(yearLevel, limit);
            return ResponseEntity.ok(students);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    // Search notes only
    @GetMapping("/notes")
    public ResponseEntity<List<Note>> searchNotes(
            @RequestParam String query,
            @RequestParam(defaultValue = "20") int limit) {
        try {
            List<Note> notes = searchService.searchNotes(query, limit);
            return ResponseEntity.ok(notes);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    // Search comments only
    @GetMapping("/comments")
    public ResponseEntity<List<Comment>> searchComments(
            @RequestParam String query,
            @RequestParam(defaultValue = "20") int limit) {
        try {
            List<Comment> comments = searchService.searchComments(query, limit);
            return ResponseEntity.ok(comments);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    // Get search suggestions
    @GetMapping("/suggestions")
    public ResponseEntity<Map<String, Object>> getSearchSuggestions() {
        try {
            Map<String, Object> suggestions = searchService.getSearchSuggestions();
            return ResponseEntity.ok(suggestions);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    // Autocomplete search
    @GetMapping("/autocomplete")
    public ResponseEntity<List<String>> autocomplete(
            @RequestParam String prefix,
            @RequestParam String type,
            @RequestParam(defaultValue = "10") int limit) {
        try {
            List<String> suggestions = searchService.autocomplete(prefix, type, limit);
            return ResponseEntity.ok(suggestions);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    // Get trending searches
    @GetMapping("/trending")
    public ResponseEntity<List<String>> getTrendingSearches(
            @RequestParam(defaultValue = "10") int limit) {
        try {
            List<String> trending = searchService.getTrendingSearches(limit);
            return ResponseEntity.ok(trending);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    // Inner DTO class
    public static class TagSearchRequest {
        private List<String> tagNames;
        private Integer limit;
        
        public List<String> getTagNames() { return tagNames; }
        public void setTagNames(List<String> tagNames) { this.tagNames = tagNames; }
        
        public Integer getLimit() { return limit; }
        public void setLimit(Integer limit) { this.limit = limit; }
    }
}
