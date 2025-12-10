package com.appdev.academeet.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.appdev.academeet.model.UserFollow;
import com.appdev.academeet.model.UserFollowId;


@Repository
public interface UserFollowRepository extends JpaRepository<UserFollow, UserFollowId> {
    @Query("SELECT uf FROM UserFollow uf WHERE uf.id.followerId = :followerId")
    List<UserFollow> findByFollowerId(@Param("followerId") Long followerId);
    
    @Query("SELECT uf FROM UserFollow uf WHERE uf.id.followingId = :followingId")
    List<UserFollow> findByFollowingId(@Param("followingId") Long followingId);

    @Query("SELECT uf.follower FROM UserFollow uf WHERE uf.id.followingId = :followingId")
    List<com.appdev.academeet.model.User> findFollowersByFollowingId(@Param("followingId") Long followingId);

    @Query("SELECT CASE WHEN COUNT(uf) > 0 THEN true ELSE false END FROM UserFollow uf WHERE uf.id.followerId = :followerId AND uf.id.followingId = :followingId")
    boolean existsByFollowerIdAndFollowingId(@Param("followerId") Long followerId, @Param("followingId") Long followingId);
    
    @Query("SELECT COUNT(uf) FROM UserFollow uf WHERE uf.id.followingId = :followingId")
    long countFollowersByFollowingId(@Param("followingId") Long followingId);

    @Query("SELECT COUNT(uf) FROM UserFollow uf WHERE uf.id.followerId = :followerId")
    long countFollowingByFollowerId(@Param("followerId") Long followerId);

    @Query("DELETE FROM UserFollow uf WHERE uf.id.followerId = :followerId AND uf.id.followingId = :followingId")
    @org.springframework.data.jpa.repository.Modifying
    void deleteByFollowerIdAndFollowingId(@Param("followerId") Long followerId, @Param("followingId") Long followingId);

    @Query("SELECT uf.following FROM UserFollow uf WHERE uf.id.followerId = :followerId")
    List<com.appdev.academeet.model.User> findFollowingByFollowerId(@Param("followerId") Long followerId);
}