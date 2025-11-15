package com.appdev.academeet.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping; // NEW
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.appdev.academeet.dto.CreateSessionRequest;
import com.appdev.academeet.dto.SessionDetailsDto; // NEW
import com.appdev.academeet.dto.SessionResponse;
import com.appdev.academeet.service.SessionService;

import java.util.List; // NEW

@RestController
@RequestMapping("/api/sessions")
@CrossOrigin(origins = "http://localhost:5173") 
public class SessionController {

    @Autowired
    private SessionService sessionService;

    @PostMapping
    public ResponseEntity<SessionResponse> createSession(
        @RequestBody CreateSessionRequest request
    ) {
        SessionResponse response = sessionService.createSession(request);

        // UPDATED: Check if the response message indicates an error
        if (response.getMessage().startsWith("Error:")) {
            // If it's an error, return a 400 Bad Request
            return ResponseEntity.badRequest().body(response);
        }
        
        // Otherwise, return 200 OK
        return ResponseEntity.ok(response);
    }
    
    // NEW: "get all sessions" endpoint
    @GetMapping
    public ResponseEntity<List<SessionDetailsDto>> getAllSessions() {
        List<SessionDetailsDto> sessions = sessionService.getAllSessions();
        return ResponseEntity.ok(sessions);
    }
}