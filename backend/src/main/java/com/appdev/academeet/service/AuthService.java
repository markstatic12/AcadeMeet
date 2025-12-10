package com.appdev.academeet.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.appdev.academeet.dto.AuthResponse;
import com.appdev.academeet.dto.LoginRequest;
import com.appdev.academeet.dto.SignupRequest;
import com.appdev.academeet.exception.UnauthorizedException;
import com.appdev.academeet.exception.ValidationException;
import com.appdev.academeet.model.User;
import com.appdev.academeet.repository.UserRepository;
import com.appdev.academeet.security.JwtUtil;

@Service
public class AuthService {
    
    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    
    @Autowired
    public AuthService(UserRepository userRepository, BCryptPasswordEncoder passwordEncoder, JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }
    
    public AuthResponse signup(SignupRequest request) {
        // Check if email already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new ValidationException("Email already exists");
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
        // Find user by email
        Optional<User> userOptional = userRepository.findByEmail(request.getEmail());
        
        if (userOptional.isEmpty()) {
            throw new UnauthorizedException("Invalid email or password");
        }
        
        User user = userOptional.get();
        
        // Check password
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new UnauthorizedException("Invalid email or password");
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
    
    public AuthResponse refreshAccessToken(String refreshToken) {
        // Validate refresh token
        if (refreshToken == null || refreshToken.trim().isEmpty()) {
            throw new ValidationException("Refresh token is required");
        }
        
        if (!jwtUtil.validateToken(refreshToken)) {
            throw new UnauthorizedException("Invalid refresh token");
        }
        
        // Extract email from refresh token
        String email = jwtUtil.getEmailFromToken(refreshToken);
        
        // Find user
        Optional<User> userOptional = userRepository.findByEmail(email);
        if (userOptional.isEmpty()) {
            throw new UnauthorizedException("User not found");
        }
        
        User user = userOptional.get();
        
        // Verify refresh token matches stored token and is not expired
        if (user.getRefreshToken() == null || !user.getRefreshToken().equals(refreshToken)) {
            throw new UnauthorizedException("Invalid refresh token");
        }
        
        if (user.getRefreshTokenExpiry() == null || user.getRefreshTokenExpiry().isBefore(java.time.LocalDateTime.now())) {
            throw new UnauthorizedException("Refresh token expired");
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
    }
}
