package com.appdev.academeet.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.appdev.academeet.dto.AuthResponse;
import com.appdev.academeet.dto.LoginRequest;
import com.appdev.academeet.dto.SignupRequest;
import com.appdev.academeet.model.User;
import com.appdev.academeet.repository.UserRepository;

@Service
public class AuthService {
    
    @Autowired
    private UserRepository userRepository;
    
    private BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
    
    public AuthResponse signup(SignupRequest request) {
        // Check if email already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            return new AuthResponse(null, null, null, "Email already exists");
        }
        
        // Validate input
        if (request.getName() == null || request.getName().trim().isEmpty()) {
            return new AuthResponse(null, null, null, "Name is required");
        }
        
        if (request.getEmail() == null || request.getEmail().trim().isEmpty()) {
            return new AuthResponse(null, null, null, "Email is required");
        }
        
        if (request.getPassword() == null || request.getPassword().length() < 6) {
            return new AuthResponse(null, null, null, "Password must be at least 6 characters");
        }
        
        if (request.getProgram() == null || request.getProgram().trim().isEmpty()) {
            return new AuthResponse(null, null, null, "Program is required");
        }
        
        if (request.getYearLevel() == null || request.getYearLevel() < 1 || request.getYearLevel() > 4) {
            return new AuthResponse(null, null, null, "Year level must be between 1 and 4");
        }
        
        // Create new user with encrypted password
        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setProgram(request.getProgram());
        user.setYearLevel(request.getYearLevel());
        
        User savedUser = userRepository.save(user);
        
        return new AuthResponse(
            savedUser.getId(),
            savedUser.getName(),
            savedUser.getEmail(),
            "Signup successful"
        );
    }
    
    public AuthResponse login(LoginRequest request) {
        // Validate input
        if (request.getEmail() == null || request.getEmail().trim().isEmpty()) {
            return new AuthResponse(null, null, null, "Email is required");
        }
        
        if (request.getPassword() == null || request.getPassword().trim().isEmpty()) {
            return new AuthResponse(null, null, null, "Password is required");
        }
        
        // Find user by email
        Optional<User> userOptional = userRepository.findByEmail(request.getEmail());
        
        if (userOptional.isEmpty()) {
            return new AuthResponse(null, null, null, "Invalid email or password");
        }
        
        User user = userOptional.get();
        
        // Check password
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            return new AuthResponse(null, null, null, "Invalid email or password");
        }
        
        return new AuthResponse(
            user.getId(),
            user.getName(),
            user.getEmail(),
            "Login successful"
        );
    }
}
