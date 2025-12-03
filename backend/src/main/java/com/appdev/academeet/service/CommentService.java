package com.appdev.academeet.service;

import java.util.List;
import java.util.Optional;

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

    @Transactional
    public Comment createComment(Long userId, Long sessionId, String content, Long parentCommentId) {
        Optional<User> userOpt = userRepository.findById(userId);
        Optional<Session> sessionOpt = sessionRepository.findById(sessionId);
        
        if (userOpt.isPresent() && sessionOpt.isPresent()) {
            User user = userOpt.get();
            Session session = sessionOpt.get();
            
            // Only create top-level comments (no parent comments)
            Comment comment = new Comment(session, user, content, null);
            return commentRepository.save(comment);
        }
        
        throw new RuntimeException("User or Session not found");
    }

    @Transactional(readOnly = true)
    public List<Comment> getSessionComments(Long sessionId) {
        return commentRepository.findBySessionIdOrderByCreatedAt(sessionId);
    }
}