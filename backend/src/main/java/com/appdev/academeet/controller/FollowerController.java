package com.appdev.academeet.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.appdev.academeet.model.Follower;
import com.appdev.academeet.model.User;
import com.appdev.academeet.service.FollowerService;

@RestController
@RequestMapping("/api/followers")
@CrossOrigin(origins = "http://localhost:5173")
public class FollowerController {
    
    @Autowired
    private FollowerService followerService;
    
    // Follow a user
    @PostMapping("/follow")
    public ResponseEntity<?> followUser(@RequestBody FollowRequest request) {
        try {
            Follower follower = followerService.followUser(
                request.getFollowerId(),
                request.getFollowingId()
            );
            return ResponseEntity.status(HttpStatus.CREATED).body(follower);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    // Unfollow a user
    @DeleteMapping("/unfollow")
    public ResponseEntity<?> unfollowUser(@RequestBody FollowRequest request) {
        try {
            followerService.unfollowUser(
                request.getFollowerId(),
                request.getFollowingId()
            );
            return ResponseEntity.ok().body("Successfully unfollowed user");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    // Get followers of a user
    @GetMapping("/{userId}/followers")
    public ResponseEntity<List<User>> getFollowers(@PathVariable Long userId) {
        try {
            List<User> followers = followerService.getFollowerUsers(userId);
            return ResponseEntity.ok(followers);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    // Get users that a user is following
    @GetMapping("/{userId}/following")
    public ResponseEntity<List<User>> getFollowing(@PathVariable Long userId) {
        try {
            List<User> following = followerService.getFollowingUsers(userId);
            return ResponseEntity.ok(following);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    // Get follower/following counts
    @GetMapping("/{userId}/counts")
    public ResponseEntity<Map<String, Long>> getFollowerCounts(@PathVariable Long userId) {
        try {
            Map<String, Long> counts = new HashMap<>();
            counts.put("followers", followerService.countFollowers(userId));
            counts.put("following", followerService.countFollowing(userId));
            return ResponseEntity.ok(counts);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    // Check if user A follows user B
    @GetMapping("/check")
    public ResponseEntity<Map<String, Boolean>> checkFollowing(
            @RequestParam Long followerId,
            @RequestParam Long followingId) {
        try {
            boolean isFollowing = followerService.isFollowing(followerId, followingId);
            boolean isMutual = followerService.isMutualFollow(followerId, followingId);
            
            Map<String, Boolean> result = new HashMap<>();
            result.put("isFollowing", isFollowing);
            result.put("isMutual", isMutual);
            
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    // Get mutual follows (friends)
    @GetMapping("/mutual")
    public ResponseEntity<List<Follower>> getMutualFollows() {
        try {
            List<Follower> mutualFollows = followerService.getMutualFollows();
            return ResponseEntity.ok(mutualFollows);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    // Get suggested follows
    @GetMapping("/{userId}/suggestions")
    public ResponseEntity<List<User>> getSuggestedFollows(
            @PathVariable Long userId,
            @RequestParam(defaultValue = "10") int limit) {
        try {
            List<User> suggestions = followerService.getSuggestedFollows(userId, limit);
            return ResponseEntity.ok(suggestions);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    // Get follower IDs only (for quick checks)
    @GetMapping("/{userId}/follower-ids")
    public ResponseEntity<List<Long>> getFollowerIds(@PathVariable Long userId) {
        try {
            List<Long> followerIds = followerService.getFollowerIds(userId);
            return ResponseEntity.ok(followerIds);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    // Get following IDs only (for quick checks)
    @GetMapping("/{userId}/following-ids")
    public ResponseEntity<List<Long>> getFollowingIds(@PathVariable Long userId) {
        try {
            List<Long> followingIds = followerService.getFollowingIds(userId);
            return ResponseEntity.ok(followingIds);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    // Inner DTO class
    public static class FollowRequest {
        private Long followerId;
        private Long followingId;
        
        public Long getFollowerId() { return followerId; }
        public void setFollowerId(Long followerId) { this.followerId = followerId; }
        
        public Long getFollowingId() { return followingId; }
        public void setFollowingId(Long followingId) { this.followingId = followingId; }
    }
}
