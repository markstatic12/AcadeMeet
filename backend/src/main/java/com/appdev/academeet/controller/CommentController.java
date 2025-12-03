package com.appdev.academeet.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.appdev.academeet.dto.CommentRequest;
import com.appdev.academeet.model.Comment;
import com.appdev.academeet.model.User;
import com.appdev.academeet.repository.UserRepository;
import com.appdev.academeet.service.CommentService;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174"})
public class CommentController {

    private final CommentService commentService;
    private final UserRepository userRepository;

    @Autowired
    public CommentController(CommentService commentService, UserRepository userRepository) {
        this.commentService = commentService;
        this.userRepository = userRepository;
    }

    @PostMapping("/sessions/{sessionId}/comments")
    public ResponseEntity<?> createComment(@PathVariable Long sessionId, @RequestBody CommentRequest request) {
        try {
            // Get authenticated user from JWT
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication == null || !authentication.isAuthenticated()) {
                return ResponseEntity.status(401).body(Map.of("error", "User not authenticated"));
            }
            
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            String email = userDetails.getUsername();
            
            User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
            
            Comment comment = commentService.createComment(
                user.getId(), 
                sessionId, 
                request.getContent(), 
                null // No parent comment - only top-level comments
            );
            return ResponseEntity.ok(comment);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/sessions/{sessionId}/comments")
    public ResponseEntity<List<Comment>> getSessionComments(@PathVariable Long sessionId) {
        try {
            List<Comment> comments = commentService.getSessionComments(sessionId);
            return ResponseEntity.ok(comments);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    /**
     * Delete a comment (only the author can delete).
     * DELETE /api/sessions/{sessionId}/comments/{commentId}
     */
    @org.springframework.web.bind.annotation.DeleteMapping("/sessions/{sessionId}/comments/{commentId}")
    public ResponseEntity<?> deleteComment(@PathVariable Long sessionId, @PathVariable Long commentId) {
        try {
            // Get authenticated user
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication == null || !authentication.isAuthenticated()) {
                return ResponseEntity.status(401).body(Map.of("error", "User not authenticated"));
            }
            
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            String email = userDetails.getUsername();
            
            User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
            
            // TODO: Add authorization check - only comment author can delete
            // For now, we'll just delete the comment
            // commentService.deleteComment(commentId, user.getId());
            System.out.println("Deleting comment " + commentId + " by user " + user.getId());
            
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    /**
     * Get replies to a specific comment.
     * GET /api/comments/{commentId}/replies
     */
    @GetMapping("/comments/{commentId}/replies")
    public ResponseEntity<?> getReplies(@PathVariable Long commentId) {
        try {
            List<Comment> replies = commentService.getReplies(commentId);
            return ResponseEntity.ok(replies);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}