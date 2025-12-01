package com.appdev.academeet.service;

import com.appdev.academeet.model.Comment;
import com.appdev.academeet.model.Session;
import com.appdev.academeet.model.User;
import com.appdev.academeet.repository.CommentRepository;
import com.appdev.academeet.repository.SessionRepository;
import com.appdev.academeet.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

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
            Comment parentComment = null;
            
            if (parentCommentId != null) {
                Optional<Comment> parentOpt = commentRepository.findById(parentCommentId);
                if (parentOpt.isPresent()) {
                    parentComment = parentOpt.get();
                    parentComment.incrementReplyCount();
                    commentRepository.save(parentComment);
                }
            }
            
            Comment comment = new Comment(session, user, content, parentComment);
            return commentRepository.save(comment);
        }
        
        throw new RuntimeException("User or Session not found");
    }

    @Transactional(readOnly = true)
    public List<Comment> getSessionComments(Long sessionId) {
        return commentRepository.findBySessionIdOrderByCreatedAt(sessionId);
    }

    @Transactional
    public void deleteComment(Long commentId) {
        Optional<Comment> commentOpt = commentRepository.findById(commentId);
        if (commentOpt.isPresent()) {
            Comment comment = commentOpt.get();
            
            // If this comment has a parent, decrement the parent's reply count
            if (comment.getParentComment() != null) {
                Comment parent = comment.getParentComment();
                parent.decrementReplyCount();
                commentRepository.save(parent);
            }
            
            commentRepository.delete(comment);
        }
    }

    @Transactional(readOnly = true)
    public List<Comment> getReplies(Long parentCommentId) {
        Optional<Comment> parentOpt = commentRepository.findById(parentCommentId);
        if (parentOpt.isPresent()) {
            return commentRepository.findRepliesByParentComment(parentOpt.get());
        }
        throw new RuntimeException("Parent comment not found");
    }

    @Transactional(readOnly = true)
    public Long countCommentsBySession(Long sessionId) {
        Optional<Session> sessionOpt = sessionRepository.findById(sessionId);
        if (sessionOpt.isPresent()) {
            return commentRepository.countCommentsBySession(sessionOpt.get());
        }
        return 0L;
    }
}