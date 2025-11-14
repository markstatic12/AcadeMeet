package com.appdev.academeet.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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
     * Get user profile by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getUserProfile(@PathVariable Long id) {
        try {
            User user = userService.getUserById(id);
            
            // Create response without password
            Map<String, Object> response = new HashMap<>();
            response.put("id", user.getId());
            response.put("name", user.getName());
            response.put("email", user.getEmail());
            response.put("program", user.getProgram());
            response.put("yearLevel", user.getYearLevel());
            response.put("school", user.getSchool());
            response.put("studentId", user.getStudentId());
            response.put("bio", user.getBio());
            response.put("profilePic", user.getProfilePic());
            response.put("createdAt", user.getCreatedAt());
            response.put("followers", 0); // TODO: Implement followers feature
            response.put("following", 0); // TODO: Implement following feature
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "User not found"));
        }
    }
    
    /**
     * Update user profile
     */
    @PutMapping("/{id}")
    public ResponseEntity<?> updateUserProfile(
            @PathVariable Long id,
            @RequestBody UpdateProfileRequest request) {
        try {
            // Get existing user
            User user = userService.getUserById(id);
            
            // Update fields
            if (request.getName() != null && !request.getName().trim().isEmpty()) {
                user.setName(request.getName().trim());
            }
            if (request.getSchool() != null) {
                user.setSchool(request.getSchool().trim());
            }
            if (request.getStudentId() != null) {
                user.setStudentId(request.getStudentId().trim());
            }
            if (request.getBio() != null) {
                user.setBio(request.getBio().trim());
            }
            if (request.getProfilePic() != null) {
                user.setProfilePic(request.getProfilePic());
            }
            if (request.getCoverImage() != null) {
                user.setCoverImage(request.getCoverImage());
            }
            
            // Save updated user
            User updatedUser = userService.updateUser(user);
            
            // Create response
            Map<String, Object> response = new HashMap<>();
            response.put("id", updatedUser.getId());
            response.put("name", updatedUser.getName());
            response.put("email", updatedUser.getEmail());
            response.put("program", updatedUser.getProgram());
            response.put("yearLevel", updatedUser.getYearLevel());
            response.put("school", updatedUser.getSchool());
            response.put("studentId", updatedUser.getStudentId());
            response.put("bio", updatedUser.getBio());
            response.put("profilePic", updatedUser.getProfilePic());
            response.put("coverImage", updatedUser.getCoverImage());
            response.put("message", "Profile updated successfully");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to update profile: " + e.getMessage()));
        }
    }
}
