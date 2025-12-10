package com.appdev.academeet.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.appdev.academeet.dto.AuthResponse;
import com.appdev.academeet.dto.LoginRequest;
import com.appdev.academeet.dto.SignupRequest;
import com.appdev.academeet.service.AuthService;
import com.appdev.academeet.util.CookieUtil;

import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
public class AuthController extends BaseController {
    
    @Autowired
    private AuthService authService;
    
    @Autowired
    private CookieUtil cookieUtil;
    
    @PostMapping("/signup")
    public ResponseEntity<AuthResponse> signup(@Valid @RequestBody SignupRequest request, HttpServletResponse response) {
        AuthResponse authResponse = authService.signup(request);
        cookieUtil.setAuthTokenCookies(response, authResponse.getToken(), authResponse.getRefreshToken());
        return ResponseEntity.ok(authResponse);
    }
    
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request, HttpServletResponse response) {
        AuthResponse authResponse = authService.login(request);
        cookieUtil.setAuthTokenCookies(response, authResponse.getToken(), authResponse.getRefreshToken());
        return ResponseEntity.ok(authResponse);
    }
    
    @PostMapping("/refresh")
    public ResponseEntity<AuthResponse> refreshToken(@RequestBody java.util.Map<String, String> request, HttpServletResponse response) {
        String refreshToken = request.get("refreshToken");
        AuthResponse authResponse = authService.refreshAccessToken(refreshToken);
        cookieUtil.setAuthTokenCookies(response, authResponse.getToken(), authResponse.getRefreshToken());
        return ResponseEntity.ok(authResponse);
    }
    
    @PostMapping("/logout")
    public ResponseEntity<java.util.Map<String, String>> logout(HttpServletResponse response) {
        cookieUtil.clearAuthCookies(response);
        return ResponseEntity.ok(java.util.Map.of("message", "Logged out successfully"));
    }
}
