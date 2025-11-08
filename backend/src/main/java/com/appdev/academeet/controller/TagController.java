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
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.appdev.academeet.model.Tag;
import com.appdev.academeet.service.TagService;

@RestController
@RequestMapping("/api/tags")
@CrossOrigin(origins = "http://localhost:5173")
public class TagController {
    
    @Autowired
    private TagService tagService;
    
    // Get all tags
    @GetMapping
    public ResponseEntity<List<Tag>> getAllTags() {
        try {
            List<Tag> tags = tagService.getAllTags();
            return ResponseEntity.ok(tags);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    // Get most popular tags
    @GetMapping("/popular")
    public ResponseEntity<List<Tag>> getPopularTags(@RequestParam(defaultValue = "20") int limit) {
        try {
            List<Tag> tags = tagService.getMostPopularTags(limit);
            return ResponseEntity.ok(tags);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    // Search tags
    @GetMapping("/search")
    public ResponseEntity<List<Tag>> searchTags(@RequestParam String query) {
        try {
            List<Tag> tags = tagService.searchTags(query);
            return ResponseEntity.ok(tags);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    // Get tag by ID
    @GetMapping("/{id}")
    public ResponseEntity<Tag> getTagById(@PathVariable Long id) {
        try {
            Optional<Tag> tag = tagService.getTagById(id);
            return tag.map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    // Find or create tag (auto-create if doesn't exist)
    @PostMapping("/find-or-create")
    public ResponseEntity<Tag> findOrCreateTag(@RequestBody TagRequest request) {
        try {
            Tag tag = tagService.findOrCreateTag(request.getName());
            return ResponseEntity.ok(tag);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    // Find or create multiple tags (bulk operation)
    @PostMapping("/find-or-create-bulk")
    public ResponseEntity<List<Tag>> findOrCreateTags(@RequestBody TagBulkRequest request) {
        try {
            List<Tag> tags = tagService.findOrCreateTags(request.getTagNames());
            return ResponseEntity.ok(tags);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    // Get tags by IDs
    @PostMapping("/by-ids")
    public ResponseEntity<List<Tag>> getTagsByIds(@RequestBody TagIdsRequest request) {
        try {
            List<Tag> tags = tagService.getTagsByIds(request.getTagIds());
            return ResponseEntity.ok(tags);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    // Cleanup unused tags (admin operation)
    @DeleteMapping("/cleanup")
    public ResponseEntity<?> cleanupUnusedTags(@RequestParam(defaultValue = "0") int minUsage) {
        try {
            int deleted = tagService.cleanupUnusedTags();
            return ResponseEntity.ok().body("Cleaned up " + deleted + " unused tags");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    // Increment usage count (called when tag is added to session/note)
    @PostMapping("/{id}/increment")
    public ResponseEntity<?> incrementUsageCount(@PathVariable Long id) {
        try {
            tagService.incrementUsageCount(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    // Decrement usage count (called when tag is removed from session/note)
    @PostMapping("/{id}/decrement")
    public ResponseEntity<?> decrementUsageCount(@PathVariable Long id) {
        try {
            tagService.decrementUsageCount(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    // Inner DTO classes
    public static class TagRequest {
        private String name;
        
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
    }
    
    public static class TagBulkRequest {
        private List<String> tagNames;
        
        public List<String> getTagNames() { return tagNames; }
        public void setTagNames(List<String> tagNames) { this.tagNames = tagNames; }
    }
    
    public static class TagIdsRequest {
        private List<Long> tagIds;
        
        public List<Long> getTagIds() { return tagIds; }
        public void setTagIds(List<Long> tagIds) { this.tagIds = tagIds; }
    }
}
