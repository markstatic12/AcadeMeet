package com.appdev.academeet.service;

import com.appdev.academeet.model.Follower;
import com.appdev.academeet.model.Student;
import com.appdev.academeet.repository.FollowerRepository;
import com.appdev.academeet.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class FollowerService {
    
    @Autowired
    private FollowerRepository followerRepository;
    
    @Autowired
    private StudentRepository studentRepository;
    
    // Follow a user
    @Transactional
    public Follower followUser(Long followerId, Long followingId) {
        // Validation
        if (followerId.equals(followingId)) {
            throw new RuntimeException("Cannot follow yourself");
        }
        
        // Check if already following
        if (followerRepository.existsByFollowerAndFollowing(followerId, followingId)) {
            throw new RuntimeException("Already following this user");
        }
        
        // Get students
        Student follower = studentRepository.findById(followerId)
                .orElseThrow(() -> new RuntimeException("Follower not found with id: " + followerId));
        
        Student following = studentRepository.findById(followingId)
                .orElseThrow(() -> new RuntimeException("User to follow not found with id: " + followingId));
        
        // Create follow relationship
        Follower followRelationship = new Follower(follower, following);
        return followerRepository.save(followRelationship);
    }
    
    // Unfollow a user
    @Transactional
    public void unfollowUser(Long followerId, Long followingId) {
        if (!followerRepository.existsByFollowerAndFollowing(followerId, followingId)) {
            throw new RuntimeException("Not following this user");
        }
        
        followerRepository.deleteByFollowerAndFollowing(followerId, followingId);
    }
    
    // Get all followers of a user
    @Transactional(readOnly = true)
    public List<Follower> getFollowers(Long userId) {
        return followerRepository.findByFollowing(userId);
    }
    
    // Get all users that a user is following
    @Transactional(readOnly = true)
    public List<Follower> getFollowing(Long userId) {
        return followerRepository.findByFollower(userId);
    }
    
    // Count followers
    @Transactional(readOnly = true)
    public long countFollowers(Long userId) {
        return followerRepository.countFollowers(userId);
    }
    
    // Count following
    @Transactional(readOnly = true)
    public long countFollowing(Long userId) {
        return followerRepository.countFollowing(userId);
    }
    
    // Check if user A follows user B
    @Transactional(readOnly = true)
    public boolean isFollowing(Long followerId, Long followingId) {
        return followerRepository.existsByFollowerAndFollowing(followerId, followingId);
    }
    
    // Get follower IDs for a user
    @Transactional(readOnly = true)
    public List<Long> getFollowerIds(Long userId) {
        return followerRepository.findFollowerIdsByFollowing(userId);
    }
    
    // Get following IDs for a user
    @Transactional(readOnly = true)
    public List<Long> getFollowingIds(Long userId) {
        return followerRepository.findFollowingIdsByFollower(userId);
    }
    
    // Get mutual followers (friends)
    @Transactional(readOnly = true)
    public List<Follower> getMutualFollows() {
        return followerRepository.findMutualFollows();
    }
    
    // Get suggested follows for a user
    @Transactional(readOnly = true)
    public List<Student> getSuggestedFollows(Long userId, int limit) {
        List<Student> suggested = followerRepository.findSuggestedFollows(userId);
        return suggested.stream().limit(limit).toList();
    }
    
    // Get follow relationship
    @Transactional(readOnly = true)
    public Optional<Follower> getFollowRelationship(Long followerId, Long followingId) {
        return followerRepository.findByFollowerAndFollowing(followerId, followingId);
    }
    
    // Check if mutual follow exists (both users follow each other)
    @Transactional(readOnly = true)
    public boolean isMutualFollow(Long userId1, Long userId2) {
        return followerRepository.existsByFollowerAndFollowing(userId1, userId2) &&
               followerRepository.existsByFollowerAndFollowing(userId2, userId1);
    }
    
    // Get followers with Student details
    @Transactional(readOnly = true)
    public List<Student> getFollowerStudents(Long userId) {
        List<Follower> followers = followerRepository.findByFollowing(userId);
        return followers.stream()
                .map(Follower::getFollower)
                .toList();
    }
    
    // Get following with Student details
    @Transactional(readOnly = true)
    public List<Student> getFollowingStudents(Long userId) {
        List<Follower> following = followerRepository.findByFollower(userId);
        return following.stream()
                .map(Follower::getFollowing)
                .toList();
    }
}
