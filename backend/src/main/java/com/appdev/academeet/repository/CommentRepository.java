package com.appdev.academeet.repository;

import java.util.Collection;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.appdev.academeet.model.Comment;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {
    
    @Query("SELECT c FROM Comment c WHERE c.session.id = :sessionId AND c.parentComment IS NULL ORDER BY c.createdAt ASC")
    List<Comment> findBySessionIdOrderByCreatedAt(@Param("sessionId") Long sessionId);

    @Query("SELECT c FROM Comment c WHERE c.session.id = :sessionId ORDER BY c.createdAt ASC")
    List<Comment> findBySessionIdOrderByCreatedAtAsc(@Param("sessionId") Long sessionId);

    List<Comment> findByParentComment_CommentId(Long commentId);

    List<Comment> findByParentComment_CommentIdIn(Collection<Long> parentIds);

    Page<Comment> findByParentCommentIsNullAndSessionIdOrderByCreatedAtAsc(Long sessionId, Pageable pageable);

    @Modifying
    @Query("UPDATE Comment c SET c.replyCount = c.replyCount + :delta WHERE c.commentId = :id")
    void updateReplyCount(@Param("id") Long id, @Param("delta") int delta);
}