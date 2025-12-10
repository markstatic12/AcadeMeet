package com.appdev.academeet.dto;

/**
 * Response DTO for authentication endpoints (login/signup)
 * Immutable after construction
 */
public class AuthResponse {
    private final Long id;
    private final String name;
    private final String email;
    private final String program;
    private final Integer yearLevel;
    private final String message;
    private final String token;
    private final String refreshToken;
    
    public AuthResponse(Long id, String name, String email, String program, Integer yearLevel, 
                       String message, String token, String refreshToken) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.program = program;
        this.yearLevel = yearLevel;
        this.message = message;
        this.token = token;
        this.refreshToken = refreshToken;
    }
    
    // Getters only (immutable)
    public Long getId() { return id; }
    public String getName() { return name; }
    public String getEmail() { return email; }
    public String getProgram() { return program; }
    public Integer getYearLevel() { return yearLevel; }
    public String getMessage() { return message; }
    public String getToken() { return token; }
    public String getRefreshToken() { return refreshToken; }
}
