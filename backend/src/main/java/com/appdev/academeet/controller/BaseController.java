package com.appdev.academeet.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import com.appdev.academeet.exception.UnauthorizedException;
import com.appdev.academeet.model.User;
import com.appdev.academeet.repository.UserRepository;

public abstract class BaseController {

    @Autowired
    protected UserRepository userRepository;

    /**
     * Get the currently authenticated user from the security context.
     * @return the authenticated User entity
     * @throws UnauthorizedException if user is not authenticated or not found
     */
    protected User getAuthenticatedUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new UnauthorizedException("User is not authenticated");
        }
        
        String email = authentication.getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UnauthorizedException("Authenticated user not found"));
    }
}
