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

import com.appdev.academeet.dto.CommentDTO;
import com.appdev.academeet.dto.CommentRequest;
import com.appdev.academeet.dto.ReplyDTO;
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
            User user = getAuthenticatedUser();
            Comment saved = commentService.createComment(user.getId(), sessionId, request.getContent(), null);

            CommentDTO dto = new CommentDTO(
                saved.getCommentId(),
                saved.getAuthor().getId(),
                saved.getAuthor().getName(),
                saved.getContent(),
                saved.getCreatedAt(),
                saved.getReplyCount()
            );

            return ResponseEntity.ok(dto);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/sessions/{sessionId}/comments/{commentId}/replies")
    public ResponseEntity<?> createReply(
            @PathVariable Long sessionId,
            @PathVariable Long commentId,
            @RequestBody CommentRequest request) {
        try {
            User user = getAuthenticatedUser();
            Comment saved = commentService.createComment(user.getId(), sessionId, request.getContent(), commentId);

            ReplyDTO dto = new ReplyDTO(
                saved.getCommentId(),
                saved.getAuthor().getId(),
                saved.getAuthor().getName(),
                saved.getContent(),
                saved.getCreatedAt(),
                null,
                null
            );

            return ResponseEntity.ok(dto);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/sessions/{sessionId}/comments")
    public ResponseEntity<?> getSessionComments(@PathVariable Long sessionId) {
        try {
            List<CommentDTO> comments = commentService.getSessionCommentsGrouped(sessionId);
            return ResponseEntity.ok(comments);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @org.springframework.web.bind.annotation.DeleteMapping("/sessions/{sessionId}/comments/{commentId}")
    public ResponseEntity<?> deleteComment(@PathVariable Long sessionId, @PathVariable Long commentId) {
        try {
            User user = getAuthenticatedUser();
            commentService.deleteComment(commentId, user.getId());
            return ResponseEntity.noContent().build();
        } catch (SecurityException se) {
            return ResponseEntity.status(403).body(Map.of("error", se.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/comments/{commentId}/replies")
    public ResponseEntity<?> getReplies(@PathVariable Long commentId) {
        try {
            List<ReplyDTO> replies = commentService.getReplies(commentId);
            return ResponseEntity.ok(replies);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    private User getAuthenticatedUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("User not authenticated");
        }
        
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        String email = userDetails.getUsername();
        
        return userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));
    }
}