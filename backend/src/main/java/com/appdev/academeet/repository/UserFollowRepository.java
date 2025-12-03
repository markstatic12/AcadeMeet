package com.appdev.academeet.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.appdev.academeet.model.UserFollow;
import com.appdev.academeet.model.UserFollowId;

/**
 * Repository for UserFollow entity.
 * Handles social following feature between users.
 */
@Repository
public interface UserFollowRepository extends JpaRepository<UserFollow, UserFollowId> {
    
    /**
     * Get all users that the specified user is following.
     */
    @Query("SELECT uf FROM UserFollow uf WHERE uf.id.followerId = :followerId")
    List<UserFollow> findByFollowerId(@Param("followerId") Long followerId);
    
    /**
     * Get all followers of the specified user.
     */
    @Query("SELECT uf FROM UserFollow uf WHERE uf.id.followingId = :followingId")
    List<UserFollow> findByFollowingId(@Param("followingId") Long followingId);
    
    /**
     * Check if a user is already following another user.
     */
    @Query("SELECT CASE WHEN COUNT(uf) > 0 THEN true ELSE false END FROM UserFollow uf WHERE uf.id.followerId = :followerId AND uf.id.followingId = :followingId")
    boolean existsByFollowerIdAndFollowingId(@Param("followerId") Long followerId, @Param("followingId") Long followingId);
    
    /**
     * Count how many users are following a specific user.
     */
    @Query("SELECT COUNT(uf) FROM UserFollow uf WHERE uf.id.followingId = :followingId")
    long countFollowersByFollowingId(@Param("followingId") Long followingId);
    
    /**
     * Count how many users a specific user is following.
     */
    @Query("SELECT COUNT(uf) FROM UserFollow uf WHERE uf.id.followerId = :followerId")
    long countFollowingByFollowerId(@Param("followerId") Long followerId);
    
    /**
     * Delete a follow relationship (unfollow).
     */
    @Query("DELETE FROM UserFollow uf WHERE uf.id.followerId = :followerId AND uf.id.followingId = :followingId")
    void deleteByFollowerIdAndFollowingId(@Param("followerId") Long followerId, @Param("followingId") Long followingId);
}
