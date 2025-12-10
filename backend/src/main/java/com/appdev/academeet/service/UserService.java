package com.appdev.academeet.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.appdev.academeet.dto.UpdateProfileRequest;
import com.appdev.academeet.dto.UserProfileResponse;
import com.appdev.academeet.dto.UserSummaryDTO;
import com.appdev.academeet.exception.BusinessException;
import com.appdev.academeet.exception.ResourceNotFoundException;
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
    
    // ========================================
    // Private Mapping Helper Methods
    // ========================================
    
    /**
     * Maps User entity to UserProfileResponse DTO.
     */
    private UserProfileResponse toProfileResponse(User user, Long followersCount, Long followingCount) {
        return new UserProfileResponse(
            user.getId(),
            user.getName(),
            user.getEmail(),
            user.getProgram(),
            user.getYearLevel(),
            user.getBio(),
            user.getProfileImageUrl(),
            user.getCoverImageUrl(),
            user.getCreatedAt(),
            followersCount,
            followingCount
        );
    }
    
    /**
     * Maps User entity to UserSummaryDTO.
     */
    private UserSummaryDTO toSummaryDTO(User user) {
        return new UserSummaryDTO(
            user.getId(),
            user.getName(),
            user.getEmail(),
            user.getProgram(),
            user.getProfileImageUrl()
        );
    }
    
    /**
     * Maps list of User entities to UserSummaryDTO list.
     */
    private List<UserSummaryDTO> toSummaryDTOList(List<User> users) {
        return users.stream()
            .map(this::toSummaryDTO)
            .collect(Collectors.toList());
    }
    
    // ========================================
    // Public Service Methods
    // ========================================
    
    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
    }
    
    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
    }
    
    public User updateUser(User user) {
        return userRepository.save(user);
    }
    
    public User updateProfile(User user, UpdateProfileRequest request) {
        // Validate and update profile fields
        if (request.getName() != null && !request.getName().trim().isEmpty()) {
            user.setName(request.getName().trim());
        }
        
        if (request.getProgram() != null && !request.getProgram().trim().isEmpty()) {
            user.setProgram(request.getProgram().trim());
        }
        
        if (request.getYearLevel() != null) {
            user.setYearLevel(request.getYearLevel());
        }
        
        if (request.getBio() != null) {
            user.setBio(request.getBio().trim());
        }
        
        if (request.getProfilePic() != null) {
            user.setProfileImageUrl(request.getProfilePic());
        }
        
        if (request.getCoverImage() != null) {
            user.setCoverImageUrl(request.getCoverImage());
        }
        
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
            throw new BusinessException("User cannot follow themselves");
        }
        
        if (userFollowRepository.existsByFollowerIdAndFollowingId(followerId, followingId)) {
            throw new BusinessException("User is already following this user");
        }
        
        User follower = getUserById(followerId);
        User following = getUserById(followingId);
        
        UserFollow userFollow = new UserFollow(follower, following);
        userFollowRepository.save(userFollow);
    }
    
    @Transactional
    public void unfollowUser(Long followerId, Long followingId) {
        if (!userFollowRepository.existsByFollowerIdAndFollowingId(followerId, followingId)) {
            throw new BusinessException("User is not following this user");
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
    
    // ========================================
    // DTO-Returning Methods for Controllers
    // ========================================
    
    /**
     * Get user profile as DTO with follower counts.
     */
    @Transactional(readOnly = true)
    public UserProfileResponse getUserProfileDTO(Long userId) {
        User user = getUserById(userId);
        Long followersCount = getFollowerCount(userId);
        Long followingCount = getFollowingCount(userId);
        return toProfileResponse(user, followersCount, followingCount);
    }
    
    /**
     * Get followers as DTOs.
     */
    @Transactional(readOnly = true)
    public List<UserSummaryDTO> getFollowersDTO(Long userId) {
        List<User> followers = getFollowers(userId);
        return toSummaryDTOList(followers);
    }
    
    /**
     * Get following as DTOs.
     */
    @Transactional(readOnly = true)
    public List<UserSummaryDTO> getFollowingDTO(Long userId) {
        List<User> following = getFollowing(userId);
        return toSummaryDTOList(following);
    }
    
    /**
     * Update profile and return updated DTO.
     */
    @Transactional
    public UserProfileResponse updateProfileDTO(User user, UpdateProfileRequest request) {
        User updatedUser = updateProfile(user, request);
        Long followersCount = getFollowerCount(updatedUser.getId());
        Long followingCount = getFollowingCount(updatedUser.getId());
        return toProfileResponse(updatedUser, followersCount, followingCount);
    }
}
