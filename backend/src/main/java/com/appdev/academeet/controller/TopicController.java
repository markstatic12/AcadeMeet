package com.appdev.academeet.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.appdev.academeet.model.Topic;
import com.appdev.academeet.service.TopicService;

@RestController
@RequestMapping("/api/topics")
@CrossOrigin(origins = "http://localhost:5173")
public class TopicController {
    
    @Autowired
    private TopicService topicService;
    
    // Get all active topics
    @GetMapping
    public ResponseEntity<List<Topic>> getAllTopics() {
        try {
            List<Topic> topics = topicService.getAllActiveTopics();
            return ResponseEntity.ok(topics);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    // Get predefined topics only
    @GetMapping("/predefined")
    public ResponseEntity<List<Topic>> getPredefinedTopics() {
        try {
            List<Topic> topics = topicService.getPredefinedTopics();
            return ResponseEntity.ok(topics);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    // Get user-created topics
    @GetMapping("/user-created")
    public ResponseEntity<List<Topic>> getUserCreatedTopics() {
        try {
            List<Topic> topics = topicService.getUserCreatedTopics();
            return ResponseEntity.ok(topics);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    // Get most popular topics
    @GetMapping("/popular")
    public ResponseEntity<List<Topic>> getPopularTopics(@RequestParam(defaultValue = "10") int limit) {
        try {
            List<Topic> topics = topicService.getMostPopularTopics(limit);
            return ResponseEntity.ok(topics);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    // Search topics
    @GetMapping("/search")
    public ResponseEntity<List<Topic>> searchTopics(@RequestParam String query) {
        try {
            List<Topic> topics = topicService.searchTopics(query);
            return ResponseEntity.ok(topics);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    // Get topic by ID
    @GetMapping("/{id}")
    public ResponseEntity<Topic> getTopicById(@PathVariable Long id) {
        try {
            Optional<Topic> topic = topicService.getTopicById(id);
            return topic.map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    // Create a new user topic
    @PostMapping
    public ResponseEntity<?> createTopic(@RequestBody TopicRequest request) {
        try {
            Topic topic = topicService.createTopic(
                request.getName(),
                request.getDescription(),
                request.getIcon(),
                request.getColor(),
                request.getCreatedBy()
            );
            return ResponseEntity.status(HttpStatus.CREATED).body(topic);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    // Create a predefined topic (admin only)
    @PostMapping("/predefined")
    public ResponseEntity<?> createPredefinedTopic(@RequestBody TopicRequest request) {
        try {
            Topic topic = topicService.createPredefinedTopic(
                request.getName(),
                request.getDescription(),
                request.getIcon(),
                request.getColor()
            );
            return ResponseEntity.status(HttpStatus.CREATED).body(topic);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    // Update topic
    @PutMapping("/{id}")
    public ResponseEntity<?> updateTopic(@PathVariable Long id, @RequestBody TopicRequest request) {
        try {
            Topic topic = topicService.updateTopic(
                id,
                request.getName(),
                request.getDescription(),
                request.getIcon(),
                request.getColor()
            );
            return ResponseEntity.ok(topic);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    // Deactivate topic
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deactivateTopic(@PathVariable Long id) {
        try {
            topicService.deactivateTopic(id);
            return ResponseEntity.ok().body("Topic deactivated successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    // Increment session count (called when session is created with this topic)
    @PostMapping("/{id}/increment")
    public ResponseEntity<?> incrementSessionCount(@PathVariable Long id) {
        try {
            topicService.incrementSessionCount(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    // Inner DTO class for requests
    public static class TopicRequest {
        private String name;
        private String description;
        private Long createdBy;
        private String icon;
        private String color;
        
        // Getters and setters
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        
        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }
        
        public Long getCreatedBy() { return createdBy; }
        public void setCreatedBy(Long createdBy) { this.createdBy = createdBy; }
        
        public String getIcon() { return icon; }
        public void setIcon(String icon) { this.icon = icon; }
        
        public String getColor() { return color; }
        public void setColor(String color) { this.color = color; }
    }
}
