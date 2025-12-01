package com.appdev.academeet.repository;

import com.appdev.academeet.model.Comment;
import com.appdev.academeet.model.Session;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {
    
    @Query("SELECT c FROM Comment c WHERE c.session = :session AND c.parentComment IS NULL ORDER BY c.createdAt ASC")
    List<Comment> findTopLevelCommentsBySession(@Param("session") Session session);
    
    @Query("SELECT c FROM Comment c WHERE c.parentComment = :parentComment ORDER BY c.createdAt ASC")
    List<Comment> findRepliesByParentComment(@Param("parentComment") Comment parentComment);
    
    @Query("SELECT COUNT(c) FROM Comment c WHERE c.session = :session")
    Long countCommentsBySession(@Param("session") Session session);
    
    @Query("SELECT c FROM Comment c WHERE c.session.id = :sessionId ORDER BY c.createdAt ASC")
    List<Comment> findBySessionIdOrderByCreatedAt(@Param("sessionId") Long sessionId);
}