package com.appdev.academeet.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.appdev.academeet.model.Comment;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {
    
    // Get all comments for a session, ordered chronologically
    @Query("SELECT c FROM Comment c WHERE c.session.id = :sessionId ORDER BY c.createdAt ASC")
    List<Comment> findBySessionIdOrderByCreatedAtAsc(@Param("sessionId") Long sessionId);
    
    // Get only top-level comments (no parent)
    @Query("SELECT c FROM Comment c WHERE c.session.id = :sessionId AND c.replyTo IS NULL ORDER BY c.createdAt ASC")
    List<Comment> findBySessionIdOrderByCreatedAt(@Param("sessionId") Long sessionId);
    
    // Get all replies to a specific parent comment
    List<Comment> findByReplyTo_CommentId(Long commentId);
}