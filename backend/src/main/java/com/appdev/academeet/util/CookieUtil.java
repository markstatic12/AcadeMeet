package com.appdev.academeet.util;

import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Component;

import jakarta.servlet.http.HttpServletResponse;

/**
 * Utility class for managing HTTP cookies
 */
@Component
public class CookieUtil {
    
    /**
     * Set authentication tokens as HttpOnly cookies
     * @param response HttpServletResponse to add cookies to
     * @param accessToken JWT access token
     * @param refreshToken JWT refresh token (can be null)
     */
    public void setAuthTokenCookies(HttpServletResponse response, String accessToken, String refreshToken) {
        // Access token cookie (short-lived)
        ResponseCookie accessCookie = ResponseCookie.from("token", accessToken)
            .httpOnly(true)
            .secure(false)  // Set to true if using HTTPS in production
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
    
    /**
     * Clear authentication cookies on logout
     * @param response HttpServletResponse to clear cookies from
     */
    public void clearAuthCookies(HttpServletResponse response) {
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
    }
}
