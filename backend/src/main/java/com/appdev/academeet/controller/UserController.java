package com.appdev.academeet.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.appdev.academeet.dto.UpdateProfileRequest;
import com.appdev.academeet.model.User;
import com.appdev.academeet.service.UserService;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174"})
public class UserController {
    
    @Autowired
    private UserService userService;
    
    /**
     * Get current authenticated user's profile from JWT token
     */
    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUserProfile() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication == null || !authentication.isAuthenticated()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("error", "User not authenticated"));
            }
            
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            String email = userDetails.getUsername();
            
            User user = userService.getUserByEmail(email);
            
            Map<String, Object> response = new HashMap<>();
            response.put("id", user.getId());
            response.put("name", user.getName());
            response.put("email", user.getEmail());
            response.put("program", user.getProgram());
            response.put("yearLevel", user.getYearLevel());
            response.put("bio", user.getBio());
            response.put("profilePic", user.getProfileImageUrl());
            response.put("coverImage", user.getCoverImageUrl());
            response.put("createdAt", user.getCreatedAt());
            response.put("followers", 0);
            response.put("following", 0);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to fetch user profile: " + e.getMessage()));
        }
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<?> getUserProfile(@PathVariable Long id) {
        try {
            User user = userService.getUserById(id);
            
            Map<String, Object> response = new HashMap<>();
            response.put("id", user.getId());
            response.put("name", user.getName());
            response.put("email", user.getEmail());
            response.put("program", user.getProgram());
            response.put("yearLevel", user.getYearLevel());
            response.put("bio", user.getBio());
            response.put("profilePic", user.getProfileImageUrl());
            response.put("coverImage", user.getCoverImageUrl());
            response.put("createdAt", user.getCreatedAt());
            response.put("followers", userService.getFollowerCount(user.getId()));
            response.put("following", userService.getFollowingCount(user.getId()));
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "User not found"));
        }
    }
    
    /**
     * Update current authenticated user's profile (user ID from JWT)
     */
    @PutMapping("/me")
    public ResponseEntity<?> updateMyProfile(@RequestBody UpdateProfileRequest request) {
        try {
            User currentUser = getAuthenticatedUser();
            User user = currentUser;
            
            if (request.getName() != null && !request.getName().trim().isEmpty()) {
                user.setName(request.getName().trim());
            }
            if (request.getProgram() != null && !request.getProgram().trim().isEmpty()) {
                user.setProgram(request.getProgram().trim());
            }
            if (request.getBio() != null) {
                user.setBio(request.getBio().trim());
            }
            if (request.getYearLevel() != null) {
                user.setYearLevel(request.getYearLevel());
            }
            if (request.getProfilePic() != null) {
                user.setProfileImageUrl(request.getProfilePic());
            }
            if (request.getCoverImage() != null) {
                user.setCoverImageUrl(request.getCoverImage());
            }
            
            User updatedUser = userService.updateUser(user);
        
            Map<String, Object> response = new HashMap<>();
            response.put("id", updatedUser.getId());
            response.put("name", updatedUser.getName());
            response.put("email", updatedUser.getEmail());
            response.put("program", updatedUser.getProgram());
            response.put("yearLevel", updatedUser.getYearLevel());
            response.put("bio", updatedUser.getBio());
            response.put("profilePic", updatedUser.getProfileImageUrl());
            response.put("coverImage", updatedUser.getCoverImageUrl());
            response.put("message", "Profile updated successfully");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to update profile: " + e.getMessage()));
        }
    }
    
    private User getAuthenticatedUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("User not authenticated");
        }
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        String email = userDetails.getUsername();
        return userService.getUserByEmail(email);
    }
    
    /**
     * Follow a user.
     * POST /api/users/{userId}/follow
     */
    @org.springframework.web.bind.annotation.PostMapping("/{userId}/follow")
    public ResponseEntity<?> followUser(@PathVariable Long userId) {
        try {
            User currentUser = getAuthenticatedUser();
            userService.followUser(currentUser.getId(), userId);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException | IllegalStateException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to follow user: " + e.getMessage()));
        }
    }
    
    /**
     * Unfollow a user.
     * DELETE /api/users/{userId}/follow
     */
    @org.springframework.web.bind.annotation.DeleteMapping("/{userId}/follow")
    public ResponseEntity<?> unfollowUser(@PathVariable Long userId) {
        try {
            User currentUser = getAuthenticatedUser();
            userService.unfollowUser(currentUser.getId(), userId);
            return ResponseEntity.noContent().build();
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to unfollow user: " + e.getMessage()));
        }
    }
    
    /**
     * Get a user's followers.
     * GET /api/users/{userId}/followers
     */
    @GetMapping("/{userId}/followers")
    public ResponseEntity<?> getFollowers(@PathVariable Long userId) {
        try {
            List<User> followers = userService.getFollowers(userId);
            List<Map<String, Object>> response = followers.stream()
                .map(user -> {
                    Map<String, Object> userMap = new HashMap<>();
                    userMap.put("id", user.getId());
                    userMap.put("name", user.getName());
                    userMap.put("email", user.getEmail());
                    userMap.put("program", user.getProgram());
                    userMap.put("profilePic", user.getProfileImageUrl());
                    return userMap;
                })
                .toList();
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to fetch followers: " + e.getMessage()));
        }
    }
    
    /**
     * Get users that a user is following.
     * GET /api/users/{userId}/following
     */
    @GetMapping("/{userId}/following")
    public ResponseEntity<?> getFollowing(@PathVariable Long userId) {
        try {
            List<User> following = userService.getFollowing(userId);
            List<Map<String, Object>> response = following.stream()
                .map(user -> {
                    Map<String, Object> userMap = new HashMap<>();
                    userMap.put("id", user.getId());
                    userMap.put("name", user.getName());
                    userMap.put("email", user.getEmail());
                    userMap.put("program", user.getProgram());
                    userMap.put("profilePic", user.getProfileImageUrl());
                    return userMap;
                })
                .toList();
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to fetch following: " + e.getMessage()));
        }
    }
}
