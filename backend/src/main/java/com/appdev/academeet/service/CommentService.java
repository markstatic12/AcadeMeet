package com.appdev.academeet.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.appdev.academeet.model.Comment;
import com.appdev.academeet.model.Session;
import com.appdev.academeet.model.User;
import com.appdev.academeet.repository.CommentRepository;
import com.appdev.academeet.repository.SessionRepository;
import com.appdev.academeet.repository.UserRepository;

@Service
public class CommentService {

    private final CommentRepository commentRepository;
    private final SessionRepository sessionRepository;
    private final UserRepository userRepository;

    @Autowired
    public CommentService(CommentRepository commentRepository, 
                         SessionRepository sessionRepository,
                         UserRepository userRepository) {
        this.commentRepository = commentRepository;
        this.sessionRepository = sessionRepository;
        this.userRepository = userRepository;
    }

    /**
     * Add a comment or reply to a session.
     * 
     * Business Rules:
     * 1. Content cannot be empty
     * 2. If replyTo is provided, ensure parent comment exists in the same session
     */
    @Transactional
    public Comment createComment(Long userId, Long sessionId, String content, Long parentCommentId) {
        // Business Rule 1: Validate content is not empty
        if (content == null || content.trim().isEmpty()) {
            throw new IllegalArgumentException("Comment content cannot be empty");
        }
        
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
        
        Session session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new RuntimeException("Session not found with id: " + sessionId));
        
        Comment parentComment = null;
        
        // Business Rule 2: If replyTo is provided, validate parent comment
        if (parentCommentId != null) {
            parentComment = commentRepository.findById(parentCommentId)
                    .orElseThrow(() -> new RuntimeException("Parent comment not found with id: " + parentCommentId));
            
            // Ensure parent comment is in the same session
            if (!parentComment.getSession().getId().equals(sessionId)) {
                throw new IllegalArgumentException("Parent comment must be in the same session");
            }
        }
        
        Comment comment = new Comment(session, user, content, parentComment);
        return commentRepository.save(comment);
    }

    /**
     * Get all replies to a specific comment.
     */
    @Transactional(readOnly = true)
    public List<Comment> getReplies(Long commentId) {
        return commentRepository.findByReplyTo_CommentId(commentId);
    }

    @Transactional(readOnly = true)
    public List<Comment> getSessionComments(Long sessionId) {
        return commentRepository.findBySessionIdOrderByCreatedAt(sessionId);
    }
}