package com.appdev.academeet.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.appdev.academeet.model.Follower;
import com.appdev.academeet.model.Student;

@Repository
public interface FollowerRepository extends JpaRepository<Follower, Long> {
    
    @Query("SELECT f FROM Follower f WHERE f.follower.id = :followerId AND f.following.id = :followingId")
    Optional<Follower> findByFollowerAndFollowing(
        @Param("followerId") Long followerId,
        @Param("followingId") Long followingId
    );
    
    @Query("SELECT f FROM Follower f WHERE f.follower.id = :studentId")
    List<Follower> findByFollower(@Param("studentId") Long studentId);
    
    @Query("SELECT f FROM Follower f WHERE f.following.id = :studentId")
    List<Follower> findByFollowing(@Param("studentId") Long studentId);
    
    @Query("SELECT COUNT(f) FROM Follower f WHERE f.follower.id = :studentId")
    Long countFollowing(@Param("studentId") Long studentId);
    
    @Query("SELECT COUNT(f) FROM Follower f WHERE f.following.id = :studentId")
    Long countFollowers(@Param("studentId") Long studentId);
    
    @Query("SELECT CASE WHEN COUNT(f) > 0 THEN true ELSE false END FROM Follower f " +
           "WHERE f.follower.id = :followerId AND f.following.id = :followingId")
    boolean existsByFollowerAndFollowing(
        @Param("followerId") Long followerId,
        @Param("followingId") Long followingId
    );
    
    // Additional methods for service compatibility
    @Modifying
    @Query("DELETE FROM Follower f WHERE f.follower.id = :followerId AND f.following.id = :followingId")
    void deleteByFollowerAndFollowing(
        @Param("followerId") Long followerId,
        @Param("followingId") Long followingId
    );
    
    @Query("SELECT f.follower.id FROM Follower f WHERE f.following.id = :followingId")
    List<Long> findFollowerIdsByFollowing(@Param("followingId") Long followingId);
    
    @Query("SELECT f.following.id FROM Follower f WHERE f.follower.id = :followerId")
    List<Long> findFollowingIdsByFollower(@Param("followerId") Long followerId);
    
    @Query("SELECT f FROM Follower f WHERE EXISTS " +
           "(SELECT f2 FROM Follower f2 WHERE f2.follower.id = f.following.id AND f2.following.id = f.follower.id)")
    List<Follower> findMutualFollows();
    
    @Query("SELECT DISTINCT f.following FROM Follower f WHERE f.follower.id IN " +
           "(SELECT f2.follower.id FROM Follower f2 WHERE f2.following.id = :studentId) " +
           "AND f.following.id != :studentId AND NOT EXISTS " +
           "(SELECT f3 FROM Follower f3 WHERE f3.follower.id = :studentId AND f3.following.id = f.following.id)")
    List<Student> findSuggestedFollows(@Param("studentId") Long studentId);
}
