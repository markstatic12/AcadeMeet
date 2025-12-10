package com.appdev.academeet.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.appdev.academeet.dto.AuthResponse;
import com.appdev.academeet.dto.LoginRequest;
import com.appdev.academeet.dto.SignupRequest;
import com.appdev.academeet.service.AuthService;

import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
public class AuthController extends BaseController {
    
    @Autowired
    private AuthService authService;
    
    /**
     * Helper to set HttpOnly cookies for tokens (development-safe: Secure=false, SameSite=Lax)
     */
    private void setTokenCookies(HttpServletResponse response, String accessToken, String refreshToken) {
        // Access token cookie (short-lived)
        ResponseCookie accessCookie = ResponseCookie.from("token", accessToken)
            .httpOnly(true)
            .secure(false)  // Set to true if using HTTPS in dev
            .sameSite("Lax")
            .path("/")
            .maxAge(3600)  // 1 hour
            .build();
        response.addHeader("Set-Cookie", accessCookie.toString());
        
        // Refresh token cookie (longer-lived)
        if (refreshToken != null && !refreshToken.isEmpty()) {
            ResponseCookie refreshCookie = ResponseCookie.from("refreshToken", refreshToken)
                .httpOnly(true)
                .secure(false)
                .sameSite("Lax")
                .path("/")
                .maxAge(7 * 24 * 3600)  // 7 days
                .build();
            response.addHeader("Set-Cookie", refreshCookie.toString());
        }
    }
    
    @PostMapping("/signup")
    public ResponseEntity<AuthResponse> signup(@Valid @RequestBody SignupRequest request, HttpServletResponse response) {
        AuthResponse authResponse = authService.signup(request);
        setTokenCookies(response, authResponse.getToken(), authResponse.getRefreshToken());
        return ResponseEntity.ok(authResponse);
    }
    
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request, HttpServletResponse response) {
        AuthResponse authResponse = authService.login(request);
        setTokenCookies(response, authResponse.getToken(), authResponse.getRefreshToken());
        return ResponseEntity.ok(authResponse);
    }
    
    @PostMapping("/refresh")
    public ResponseEntity<AuthResponse> refreshToken(@RequestBody java.util.Map<String, String> request, HttpServletResponse response) {
        String refreshToken = request.get("refreshToken");
        AuthResponse authResponse = authService.refreshAccessToken(refreshToken);
        setTokenCookies(response, authResponse.getToken(), authResponse.getRefreshToken());
        return ResponseEntity.ok(authResponse);
    }
    
    @PostMapping("/logout")
    public ResponseEntity<java.util.Map<String, String>> logout(HttpServletResponse response) {
        // Clear cookies by setting Max-Age=0
        ResponseCookie clearAccessCookie = ResponseCookie.from("token", "")
            .httpOnly(true)
            .secure(false)
            .sameSite("Lax")
            .path("/")
            .maxAge(0)
            .build();
        ResponseCookie clearRefreshCookie = ResponseCookie.from("refreshToken", "")
            .httpOnly(true)
            .secure(false)
            .sameSite("Lax")
            .path("/")
            .maxAge(0)
            .build();
        response.addHeader("Set-Cookie", clearAccessCookie.toString());
        response.addHeader("Set-Cookie", clearRefreshCookie.toString());
        
        return ResponseEntity.ok(java.util.Map.of("message", "Logged out successfully"));
    }
}
