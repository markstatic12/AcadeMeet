package com.appdev.academeet.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.appdev.academeet.dto.AuthResponse;
import com.appdev.academeet.dto.ChangePasswordRequest;
import com.appdev.academeet.dto.LoginRequest;
import com.appdev.academeet.dto.SignupRequest;
import com.appdev.academeet.model.User;
import com.appdev.academeet.repository.UserRepository;
import com.appdev.academeet.security.JwtUtil;

@Service
public class AuthService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
    
    @Autowired
    private JwtUtil jwtUtil;
    
    public AuthResponse signup(SignupRequest request) {
        // Check if email already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            return new AuthResponse(null, null, null, null, null, "Email already exists");
        }
        
        // Validate input
        if (request.getName() == null || request.getName().trim().isEmpty()) {
            return new AuthResponse(null, null, null, null, null, "Name is required");
        }
        
        if (request.getEmail() == null || request.getEmail().trim().isEmpty()) {
            return new AuthResponse(null, null, null, null, null, "Email is required");
        }
        
        if (request.getPassword() == null || request.getPassword().length() < 6) {
            return new AuthResponse(null, null, null, null, null, "Password must be at least 6 characters");
        }
        
        if (request.getProgram() == null || request.getProgram().trim().isEmpty()) {
            return new AuthResponse(null, null, null, null, null, "Program is required");
        }
        
        if (request.getYearLevel() == null || request.getYearLevel() < 1 || request.getYearLevel() > 4) {
            return new AuthResponse(null, null, null, null, null, "Year level must be between 1 and 4");
        }
        
        // Create new user with encrypted password
        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setProgram(request.getProgram());
        user.setYearLevel(request.getYearLevel());
        
        User savedUser = userRepository.save(user);
        
        // Generate JWT access token and refresh token
        String token = jwtUtil.generateToken(savedUser);
        String refreshToken = jwtUtil.generateRefreshToken(savedUser);
        
        // Store refresh token in database
        savedUser.setRefreshToken(refreshToken);
        savedUser.setRefreshTokenExpiry(java.time.LocalDateTime.now().plusDays(7));
        userRepository.save(savedUser);
        
        return new AuthResponse(
            savedUser.getId(),
            savedUser.getName(),
            savedUser.getEmail(),
            savedUser.getProgram(),
            savedUser.getYearLevel(),
            "Signup successful",
            token,
            refreshToken
        );
    }
    
    public AuthResponse login(LoginRequest request) {
        // Validate input
        if (request.getEmail() == null || request.getEmail().trim().isEmpty()) {
            return new AuthResponse(null, null, null, null, null, "Email is required");
        }
        
        if (request.getPassword() == null || request.getPassword().trim().isEmpty()) {
            return new AuthResponse(null, null, null, null, null, "Password is required");
        }
        
        // Find user by email
        Optional<User> userOptional = userRepository.findByEmail(request.getEmail());
        
        if (userOptional.isEmpty()) {
            return new AuthResponse(null, null, null, null, null, "Invalid email or password");
        }
        
        User user = userOptional.get();
        
        // Check password
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            return new AuthResponse(null, null, null, null, null, "Invalid email or password");
        }
        
        // Generate JWT access token and refresh token
        String token = jwtUtil.generateToken(user);
        String refreshToken = jwtUtil.generateRefreshToken(user);
        
        // Store refresh token in database
        user.setRefreshToken(refreshToken);
        user.setRefreshTokenExpiry(java.time.LocalDateTime.now().plusDays(7));
        userRepository.save(user);
        
        return new AuthResponse(
            user.getId(),
            user.getName(),
            user.getEmail(),
            user.getProgram(),
            user.getYearLevel(),
            "Login successful",
            token,
            refreshToken
        );
    }

    public String changePassword(ChangePasswordRequest request) {
        if (request.getUserId() == null) {
            return "User ID is required";
        }
        if (request.getCurrentPassword() == null || request.getCurrentPassword().isBlank()) {
            return "Current password is required";
        }
        if (request.getNewPassword() == null || request.getNewPassword().length() < 6) {
            return "New password must be at least 6 characters";
        }

        Optional<User> userOptional = userRepository.findById(request.getUserId());
        if (userOptional.isEmpty()) {
            return "User not found";
        }
        User user = userOptional.get();
        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            return "Current password is incorrect";
        }
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
        return null; // null means success
    }
    
    public AuthResponse refreshAccessToken(String refreshToken) {
        try {
            // Validate refresh token
            if (!jwtUtil.validateToken(refreshToken)) {
                return new AuthResponse(null, null, null, null, null, "Invalid refresh token");
            }
            
            // Extract email from refresh token
            String email = jwtUtil.getEmailFromToken(refreshToken);
            
            // Find user
            Optional<User> userOptional = userRepository.findByEmail(email);
            if (userOptional.isEmpty()) {
                return new AuthResponse(null, null, null, null, null, "User not found");
            }
            
            User user = userOptional.get();
            
            // Verify refresh token matches stored token and is not expired
            if (user.getRefreshToken() == null || !user.getRefreshToken().equals(refreshToken)) {
                return new AuthResponse(null, null, null, null, null, "Invalid refresh token");
            }
            
            if (user.getRefreshTokenExpiry() == null || user.getRefreshTokenExpiry().isBefore(java.time.LocalDateTime.now())) {
                return new AuthResponse(null, null, null, null, null, "Refresh token expired");
            }
            
            // Generate new access token
            String newAccessToken = jwtUtil.generateToken(user);
            
            return new AuthResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getProgram(),
                user.getYearLevel(),
                "Token refreshed successfully",
                newAccessToken,
                refreshToken  // Return same refresh token
            );
        } catch (Exception e) {
            return new AuthResponse(null, null, null, null, null, "Token refresh failed: " + e.getMessage());
        }
    }
}
