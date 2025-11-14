package com.appdev.academeet.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.appdev.academeet.model.CommentReaction;

@Repository
public interface CommentReactionRepository extends JpaRepository<CommentReaction, Long> {
    
    @Query("SELECT cr FROM CommentReaction cr WHERE cr.comment.commentId = :commentId AND " +
           "cr.user.id = :studentId AND cr.reactionType = :reactionType")
    Optional<CommentReaction> findByCommentAndStudentAndType(
        @Param("commentId") Long commentId,
        @Param("studentId") Long studentId,
        @Param("reactionType") String reactionType
    );
    
    @Query("SELECT cr FROM CommentReaction cr WHERE cr.comment.commentId = :commentId")
    List<CommentReaction> findByComment(@Param("commentId") Long commentId);
    
    @Query("SELECT cr FROM CommentReaction cr WHERE cr.user.id = :studentId")
    List<CommentReaction> findByStudent(@Param("studentId") Long studentId);
    
    @Query("SELECT cr FROM CommentReaction cr WHERE cr.comment.commentId = :commentId AND cr.reactionType = :reactionType")
    List<CommentReaction> findByCommentAndType(
        @Param("commentId") Long commentId,
        @Param("reactionType") String reactionType
    );
    
    @Query("SELECT COUNT(cr) FROM CommentReaction cr WHERE cr.comment.commentId = :commentId")
    Long countByComment(@Param("commentId") Long commentId);
    
    @Query("SELECT COUNT(cr) FROM CommentReaction cr WHERE cr.comment.commentId = :commentId AND cr.reactionType = :reactionType")
    Long countByCommentAndType(
        @Param("commentId") Long commentId,
        @Param("reactionType") String reactionType
    );
    
    @Query("SELECT cr.reactionType, COUNT(cr) FROM CommentReaction cr WHERE cr.comment.commentId = :commentId GROUP BY cr.reactionType")
    List<Object[]> countReactionsByType(@Param("commentId") Long commentId);
    
    void deleteByCommentCommentId(Long commentId);
}
