package com.jay.user_service.controller;

import com.jay.user_service.model.User;
import com.jay.user_service.payload.dto.LoginDTO;
import com.jay.user_service.payload.dto.SignupDTO;
import com.jay.user_service.payload.response.AuthResponse;
import com.jay.user_service.payload.response.UserResponseDto;
import com.jay.user_service.service.AuthService;
import com.jay.user_service.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RequiredArgsConstructor
@RestController
public class AuthController {

    private final AuthService authService;
    private final UserService userService;

    // Supports both /auth/signup and standard /api/auth/register
    @PostMapping({"/auth/signup", "/auth/register", "/api/auth/register", "/api/auth/signup"})
    public ResponseEntity<AuthResponse> signup(@jakarta.validation.Valid @RequestBody SignupDTO req) throws Exception {
        AuthResponse res = authService.signup(req);
        return ResponseEntity.ok(res);
    }

    // Supports both /auth/login and standard /api/auth/login
    @PostMapping({"/auth/login", "/api/auth/login"})
    public ResponseEntity<AuthResponse> login(@RequestBody LoginDTO req) throws Exception {
        AuthResponse res = authService.login(req.getEmail(), req.getPassword());
        return ResponseEntity.ok(res);
    }

    // Existing GET refresh token endpoint
    @GetMapping({"/auth/access-token/refresh-token/{refreshToken}", "/api/auth/refresh-token/{refreshToken}"})
    public ResponseEntity<AuthResponse> getAccessToken(@PathVariable String refreshToken) throws Exception {
        AuthResponse res = authService.getAccessTokenFromRefreshToken(refreshToken);
        return ResponseEntity.ok(res);
    }

    // Standard POST /api/auth/refresh-token
    @PostMapping({"/auth/refresh-token", "/api/auth/refresh-token"})
    public ResponseEntity<AuthResponse> refreshTokenPost(@RequestBody Map<String, String> body) throws Exception {
        String token = body.get("refreshToken");
        if (token == null) token = body.get("refresh_token");
        AuthResponse res = authService.getAccessTokenFromRefreshToken(token);
        return ResponseEntity.ok(res);
    }

    // Standard /api/auth/me endpoint for current user profile
    @GetMapping({"/api/auth/me", "/auth/me"})
    public ResponseEntity<UserResponseDto> getCurrentUser(@RequestHeader("Authorization") String jwt) throws Exception {
        User user = userService.getUserFromJwt(jwt);
        UserResponseDto response = new UserResponseDto();
        response.setId(user.getId());
        response.setFullName(user.getFullName());
        response.setEmail(user.getEmail());
        response.setPhone(user.getPhone());
        response.setUsername(user.getUsername());
        response.setRole(user.getRole());
        response.setCreatedAt(user.getCreatedAt());
        response.setUpdatedAt(user.getUpdatedAt());
        return ResponseEntity.ok(response);
    }

    // Logout endpoint
    @PostMapping({"/auth/logout", "/api/auth/logout"})
    public ResponseEntity<Map<String, String>> logout(@RequestBody(required = false) Map<String, String> body) {
        String token = null;
        if (body != null) {
            token = body.get("refreshToken");
            if (token == null) token = body.get("refresh_token");
        }
        authService.logout(token);
        return ResponseEntity.ok(Map.of("message", "Logged out successfully"));
    }
}
