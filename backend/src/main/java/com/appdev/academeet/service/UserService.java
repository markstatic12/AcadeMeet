package com.appdev.academeet.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.appdev.academeet.model.User;
import com.appdev.academeet.repository.UserRepository;

@Service
public class UserService {
    
    @Autowired
    private UserRepository userRepository;
    
    // @Autowired
    // private UserFollowRepository userFollowRepository;
    
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
    
    // Profile Search
    public List<User> searchUsersByName(String keyword) {
        return userRepository.findByNameContaining(keyword);
    }
    
    public List<User> getUsersByProgram(String program) {
        return userRepository.findByProgram(program);
    }
    public List<User> getUsersByYearLevel(Integer yearLevel) {
        return userRepository.findByYearLevel(yearLevel);
    }
    
    // @Transactional
    // public void followUser(Long followerId, Long followingId) {
    //     // Integrity Check: User cannot follow themselves
    //     if (followerId.equals(followingId)) {
    //         throw new IllegalArgumentException("User cannot follow themselves");
    //     }
        
    //     // Integrity Check: Prevent duplicate follow entries
    //     if (userFollowRepository.existsByFollowerIdAndFollowingId(followerId, followingId)) {
    //         throw new IllegalStateException("User is already following this user");
    //     }
        
    //     // Verify both users exist
    //     User follower = getUserById(followerId);
    //     User following = getUserById(followingId);
        
    //     // Create follow relationship
    //     UserFollow userFollow = new UserFollow(follower, following);
    //     userFollowRepository.save(userFollow);
    // }
    
    // @Transactional
    // public void unfollowUser(Long followerId, Long followingId) {
    //     // Verify relationship exists
    //     if (!userFollowRepository.existsByFollowerIdAndFollowingId(followerId, followingId)) {
    //         throw new IllegalStateException("User is not following this user");
    //     }
        
    //     userFollowRepository.deleteByFollowerIdAndFollowingId(followerId, followingId);
    // }
    
    // // Get followers with full profile details
    // @Transactional(readOnly = true)
    // public List<User> getFollowers(Long userId) {
    //     List<UserFollow> follows = userFollowRepository.findByFollowingId(userId);
    //     return follows.stream()
    //             .map(UserFollow::getFollower)
    //             .collect(Collectors.toList());
    // }
    
    // // Get users that a user is following
    // @Transactional(readOnly = true)
    // public List<User> getFollowing(Long userId) {
    //     List<UserFollow> follows = userFollowRepository.findByFollowerId(userId);
    //     return follows.stream()
    //             .map(UserFollow::getFollowing)
    //             .collect(Collectors.toList());
    // }
    
    // // Get follower/following counts
    // public long getFollowerCount(Long userId) {
    //     return userFollowRepository.countFollowersByFollowingId(userId);
    // }
    
    // public long getFollowingCount(Long userId) {
    //     return userFollowRepository.countFollowingByFollowerId(userId);
    // }
    
    // public boolean isFollowing(Long followerId, Long followingId) {
    //     return userFollowRepository.existsByFollowerIdAndFollowingId(followerId, followingId);
    // }
}
