package com.appdev.academeet.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.appdev.academeet.dto.CommentDTO;
import com.appdev.academeet.dto.CommentRequest;
import com.appdev.academeet.dto.ReplyDTO;
import com.appdev.academeet.model.User;
import com.appdev.academeet.service.CommentService;

@RestController
@RequestMapping("/api")
public class CommentController extends BaseController {

    private final CommentService commentService;

    @Autowired
    public CommentController(CommentService commentService) {
        this.commentService = commentService;
    }

    @PostMapping("/sessions/{sessionId}/comments")
    public ResponseEntity<?> createComment(@PathVariable Long sessionId, @RequestBody CommentRequest request) {
        User user = getAuthenticatedUser();
        CommentDTO dto = commentService.createCommentAndGetDTO(user.getId(), sessionId, request.getContent());
        return ResponseEntity.ok(dto);
    }

    @PostMapping("/sessions/{sessionId}/comments/{commentId}/replies")
    public ResponseEntity<?> createReply(
            @PathVariable Long sessionId,
            @PathVariable Long commentId,
            @RequestBody CommentRequest request) {
        User user = getAuthenticatedUser();
        ReplyDTO dto = commentService.createReplyAndGetDTO(user.getId(), sessionId, commentId, request.getContent());
        return ResponseEntity.ok(dto);
    }

    @GetMapping("/sessions/{sessionId}/comments")
    public ResponseEntity<?> getSessionComments(@PathVariable Long sessionId) {
        List<CommentDTO> comments = commentService.getSessionCommentsGrouped(sessionId);
        return ResponseEntity.ok(comments);
    }

    @DeleteMapping("/sessions/{sessionId}/comments/{commentId}")
    public ResponseEntity<?> deleteComment(@PathVariable Long sessionId, @PathVariable Long commentId) {
        User user = getAuthenticatedUser();
        commentService.deleteComment(commentId, user.getId());
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/comments/{commentId}/replies")
    public ResponseEntity<?> getReplies(@PathVariable Long commentId) {
        List<ReplyDTO> replies = commentService.getReplies(commentId);
        return ResponseEntity.ok(replies);
    }
}