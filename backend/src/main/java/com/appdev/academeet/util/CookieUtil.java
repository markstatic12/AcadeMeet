package com.appdev.academeet.util;

import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Component;

import jakarta.servlet.http.HttpServletResponse;

@Component
public class CookieUtil {

    public void setAuthTokenCookies(HttpServletResponse response, String accessToken, String refreshToken) {
        ResponseCookie accessCookie = ResponseCookie.from("token", accessToken)
            .httpOnly(true)
            .secure(false)
            .sameSite("Lax")
            .path("/")
            .maxAge(3600)
            .build();
        response.addHeader("Set-Cookie", accessCookie.toString());

        if (refreshToken != null && !refreshToken.isEmpty()) {
            ResponseCookie refreshCookie = ResponseCookie.from("refreshToken", refreshToken)
                .httpOnly(true)
                .secure(false)
                .sameSite("Lax")
                .path("/")
                .maxAge(7 * 24 * 3600)
                .build();
            response.addHeader("Set-Cookie", refreshCookie.toString());
        }
    }

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
