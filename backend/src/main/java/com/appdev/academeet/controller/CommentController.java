package com.appdev.academeet.controller;

import com.appdev.academeet.dto.CommentRequest;
import com.appdev.academeet.model.Comment;
import com.appdev.academeet.service.CommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174"})
public class CommentController {

    private final CommentService commentService;

    @Autowired
    public CommentController(CommentService commentService) {
        this.commentService = commentService;
    }

    @PostMapping("/sessions/{sessionId}/comments")
    public ResponseEntity<?> createComment(@PathVariable Long sessionId, @RequestBody CommentRequest request) {
        try {
            Comment comment = commentService.createComment(
                request.getUserId(), 
                sessionId, 
                request.getContent(), 
                request.getParentCommentId()
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

    @PatchMapping("/comments/{id}")
    public ResponseEntity<?> updateComment(@PathVariable Long id, @RequestBody CommentRequest request) {
        try {
            Comment updatedComment = commentService.updateComment(id, request.getContent());
            return ResponseEntity.ok(updatedComment);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/comments/{id}")
    public ResponseEntity<?> deleteComment(@PathVariable Long id) {
        try {
            commentService.deleteComment(id);
            return ResponseEntity.ok(Map.of("message", "Comment deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/comments/{id}/reply")
    public ResponseEntity<?> replyToComment(@PathVariable Long id, @RequestBody CommentRequest request) {
        try {
            Comment reply = commentService.createComment(
                request.getUserId(),
                null, // Session will be inferred from parent comment
                request.getContent(),
                id // Parent comment ID
            );
            return ResponseEntity.ok(reply);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/comments/{parentId}/replies")
    public ResponseEntity<List<Comment>> getReplies(@PathVariable Long parentId) {
        try {
            List<Comment> replies = commentService.getReplies(parentId);
            return ResponseEntity.ok(replies);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}