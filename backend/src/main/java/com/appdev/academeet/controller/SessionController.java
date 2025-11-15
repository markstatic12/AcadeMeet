package com.appdev.academeet.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.appdev.academeet.dto.CreateSessionRequest;
import com.appdev.academeet.dto.SessionResponse;
import com.appdev.academeet.service.SessionService;

@RestController
@RequestMapping("/api/sessions")
@CrossOrigin(origins = "http://localhost:5173") // Your React app's URL
public class SessionController {

    // 1. Inject the service (the "brain")
    @Autowired
    private SessionService sessionService;

    // 2. Define the POST endpoint
    @PostMapping
    public ResponseEntity<SessionResponse> createSession(
        @RequestBody CreateSessionRequest request
    ) {
        // 3. Delegate all logic to the service layer
        // The service will handle validation, date conversion, and saving
        SessionResponse response = sessionService.createSession(request);

        // 4. Return the response
        // We'll add error handling (try/catch) in the service later
        return ResponseEntity.ok(response);
    }
    
    // We will add the "get all sessions" endpoint here later
}