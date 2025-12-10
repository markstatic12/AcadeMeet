package com.appdev.academeet.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.appdev.academeet.dto.UpdateProfileRequest;
import com.appdev.academeet.dto.UserProfileResponse;
import com.appdev.academeet.dto.UserSummaryDTO;
import com.appdev.academeet.model.User;
import com.appdev.academeet.service.UserService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/users")
public class UserController extends BaseController {
    
    private final UserService userService;
    
    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }
    
    @GetMapping("/me")
    public ResponseEntity<UserProfileResponse> getCurrentUserProfile() {
        User user = getAuthenticatedUser();
        UserProfileResponse response = userService.getUserProfileDTO(user.getId());
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<UserProfileResponse> getUserProfile(@PathVariable Long id) {
        UserProfileResponse response = userService.getUserProfileDTO(id);
        return ResponseEntity.ok(response);
    }
    
    @PutMapping("/me")
    public ResponseEntity<UserProfileResponse> updateMyProfile(@Valid @RequestBody UpdateProfileRequest request) {
        User currentUser = getAuthenticatedUser();
        UserProfileResponse response = userService.updateProfileDTO(currentUser, request);
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/{userId}/follow")
    public ResponseEntity<Void> followUser(@PathVariable Long userId) {
        User currentUser = getAuthenticatedUser();
        userService.followUser(currentUser.getId(), userId);
        return ResponseEntity.noContent().build();
    }
    
    @DeleteMapping("/{userId}/follow")
    public ResponseEntity<Void> unfollowUser(@PathVariable Long userId) {
        User currentUser = getAuthenticatedUser();
        userService.unfollowUser(currentUser.getId(), userId);
        return ResponseEntity.noContent().build();
    }
    
    @GetMapping("/{userId}/followers")
    public ResponseEntity<List<UserSummaryDTO>> getFollowers(@PathVariable Long userId) {
        List<UserSummaryDTO> response = userService.getFollowersDTO(userId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{userId}/following")
    public ResponseEntity<List<UserSummaryDTO>> getFollowing(@PathVariable Long userId) {
        List<UserSummaryDTO> response = userService.getFollowingDTO(userId);
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/{userId}/is-following")
    public ResponseEntity<Map<String, Boolean>> isFollowing(@PathVariable Long userId) {
        User currentUser = getAuthenticatedUser();
        boolean isFollowing = userService.isFollowing(currentUser.getId(), userId);
        return ResponseEntity.ok(Map.of("isFollowing", isFollowing));
    }

    @DeleteMapping("/me/followers/{followerId}")
    public ResponseEntity<Map<String, String>> removeFollower(@PathVariable Long followerId) {
        User currentUser = getAuthenticatedUser();
        userService.unfollowUser(followerId, currentUser.getId());
        return ResponseEntity.ok(Map.of("message", "Follower removed successfully"));
    }
}
