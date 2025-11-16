package com.appdev.academeet.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.appdev.academeet.model.Tag;
import com.appdev.academeet.service.TagService;

@RestController
@RequestMapping("/api/tags")
public class TagController {

    @Autowired
    private TagService tagService;

    // --- Placeholder for security check ---
    private boolean isAdmin() {
        // TODO: Replace with actual security logic (e.g., check SecurityContext)
        return true; 
    }

    /**
     * GET /api/tags : Retrieves all available predefined tags.
     */
    @GetMapping
    public ResponseEntity<List<Tag>> getAllTags() {
        List<Tag> tags = tagService.getAllTags();
        return ResponseEntity.ok(tags);
    }

    /**
     * POST /api/tags : Creates a new predefined tag.
     */
    @PostMapping
    public ResponseEntity<?> createTag(@RequestBody Map<String, String> request) {
        if (!isAdmin()) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("error", "Access denied. Administrator privileges required."));
        }
        
        String tagName = request.get("name");

        try {
            Tag newTag = tagService.createTag(tagName);
            return ResponseEntity.status(HttpStatus.CREATED).body(newTag);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", e.getMessage()));
        } catch (DataIntegrityViolationException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("error", "Tag already exists."));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", "Failed to create tag."));
        }
    }

    /**
     * DELETE /api/tags/{id} : Deletes a predefined tag.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTag(@PathVariable Long id) {
        if (!isAdmin()) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("error", "Access denied. Administrator privileges required."));
        }

        try {
            tagService.deleteTag(id);
            return ResponseEntity.noContent().build();
        } catch (DataIntegrityViolationException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("error", "Cannot delete tag. It is still linked to existing notes or sessions."));
        } catch (RuntimeException e) {
            if (e.getMessage().contains("not found")) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", e.getMessage()));
            }

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", "An unexpected error occurred: " + e.getMessage()));
        }
    }
}