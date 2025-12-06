package com.appdev.academeet.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.appdev.academeet.model.User;
import com.appdev.academeet.model.UserFollow;
import com.appdev.academeet.repository.UserFollowRepository;
import com.appdev.academeet.repository.UserRepository;

@Service
public class UserService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private UserFollowRepository userFollowRepository;
    
    public User getUserById(Long id) {
        return userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found with id: " + id));
    }
    
    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found with email: " + email));
    }
    
    public User updateUser(User user) {
        return userRepository.save(user);
    }
    
    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }
    
    public List<User> searchUsersByName(String keyword) {
        return userRepository.findByNameContaining(keyword);
    }
    
    public List<User> getUsersByProgram(String program) {
        return userRepository.findByProgram(program);
    }
    public List<User> getUsersByYearLevel(Integer yearLevel) {
        return userRepository.findByYearLevel(yearLevel);
    }
    
    @Transactional
    public void followUser(Long followerId, Long followingId) {
        if (followerId.equals(followingId)) {
            throw new IllegalArgumentException("User cannot follow themselves");
        }
        
        if (userFollowRepository.existsByFollowerIdAndFollowingId(followerId, followingId)) {
            throw new IllegalStateException("User is already following this user");
        }
        
        User follower = getUserById(followerId);
        User following = getUserById(followingId);
        
        UserFollow userFollow = new UserFollow(follower, following);
        userFollowRepository.save(userFollow);
    }
    
    @Transactional
    public void unfollowUser(Long followerId, Long followingId) {
        if (!userFollowRepository.existsByFollowerIdAndFollowingId(followerId, followingId)) {
            throw new IllegalStateException("User is not following this user");
        }
        
        userFollowRepository.deleteByFollowerIdAndFollowingId(followerId, followingId);
    }
    
    // Get followers with full profile details
    @Transactional(readOnly = true)
    public List<User> getFollowers(Long userId) {
        getUserById(userId);
        List<User> followers = userFollowRepository.findFollowersByFollowingId(userId);
        return java.util.Collections.unmodifiableList(followers);
    }
    
    // Get users that a user is following
    @Transactional(readOnly = true)
    public List<User> getFollowing(Long userId) {

        getUserById(userId);
        List<User> following = userFollowRepository.findFollowingByFollowerId(userId);
        return java.util.Collections.unmodifiableList(following);
    }
    
    // Get follower/following counts
    public long getFollowerCount(Long userId) {
        return userFollowRepository.countFollowersByFollowingId(userId);
    }
    
    public long getFollowingCount(Long userId) {
        return userFollowRepository.countFollowingByFollowerId(userId);
    }
    
    public boolean isFollowing(Long followerId, Long followingId) {
        return userFollowRepository.existsByFollowerIdAndFollowingId(followerId, followingId);
    }
}
