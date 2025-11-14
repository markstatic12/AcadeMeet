package com.appdev.academeet.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.appdev.academeet.model.Comment;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {
    
    @Query("SELECT c FROM Comment c WHERE c.session.sessionId = :sessionId AND c.parentComment IS NULL ORDER BY c.createdAt DESC")
    List<Comment> findTopLevelCommentsBySession(@Param("sessionId") Integer sessionId);
    
    @Query("SELECT c FROM Comment c WHERE c.parentComment.commentId = :parentId ORDER BY c.createdAt ASC")
    List<Comment> findRepliesByParent(@Param("parentId") Long parentId);
    
    @Query("SELECT c FROM Comment c WHERE c.user.id = :studentId ORDER BY c.createdAt DESC")
    List<Comment> findByStudent(@Param("studentId") Long studentId);
    
    @Query("SELECT COUNT(c) FROM Comment c WHERE c.session.sessionId = :sessionId")
    Long countBySession(@Param("sessionId") Integer sessionId);
    
    @Query("SELECT COUNT(c) FROM Comment c WHERE c.parentComment.commentId = :parentId")
    Long countRepliesByParent(@Param("parentId") Long parentId);
    
    @Query("SELECT c FROM Comment c WHERE LOWER(c.content) LIKE LOWER(CONCAT('%', :search, '%'))")
    List<Comment> searchComments(@Param("search") String search);
}
