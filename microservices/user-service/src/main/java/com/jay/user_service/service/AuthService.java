package com.jay.user_service.service;

import com.jay.user_service.payload.dto.SignupDTO;
import com.jay.user_service.payload.response.AuthResponse;

public interface AuthService {

    AuthResponse login(String username, String password) throws Exception;
    AuthResponse signup(SignupDTO req) throws Exception;
    AuthResponse getAccessTokenFromRefreshToken(String refreshToken) throws Exception;

}
