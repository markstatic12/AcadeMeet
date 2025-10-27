package com.appdev.academeet.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.appdev.academeet.dto.AuthResponse;
import com.appdev.academeet.dto.LoginRequest;
import com.appdev.academeet.dto.SignupRequest;
import com.appdev.academeet.model.Student;
import com.appdev.academeet.repository.StudentRepository;

@Service
public class AuthService {
    
    @Autowired
    private StudentRepository studentRepository;
    
    private BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
    
    public AuthResponse signup(SignupRequest request) {
        // Check if email already exists
        if (studentRepository.existsByEmail(request.getEmail())) {
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
        
        // Create new student with encrypted password
        Student student = new Student();
        student.setName(request.getName());
        student.setEmail(request.getEmail());
        student.setPassword(passwordEncoder.encode(request.getPassword()));
        student.setProgram(request.getProgram());
        student.setYearLevel(request.getYearLevel());
        
        Student savedStudent = studentRepository.save(student);
        
        return new AuthResponse(
            savedStudent.getId(),
            savedStudent.getName(),
            savedStudent.getEmail(),
            savedStudent.getProgram(),
            savedStudent.getYearLevel(),
            "Signup successful"
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
        
        // Find student by email
        Optional<Student> studentOptional = studentRepository.findByEmail(request.getEmail());
        
        if (studentOptional.isEmpty()) {
            return new AuthResponse(null, null, null, null, null, "Invalid email or password");
        }
        
        Student student = studentOptional.get();
        
        // Check password
        if (!passwordEncoder.matches(request.getPassword(), student.getPassword())) {
            return new AuthResponse(null, null, null, null, null, "Invalid email or password");
        }
        
        return new AuthResponse(
            student.getId(),
            student.getName(),
            student.getEmail(),
            student.getProgram(),
            student.getYearLevel(),
            "Login successful"
        );
    }
}
