package com.jay.user_service.service;

import com.jay.user_service.model.RefreshToken;

public interface RefreshTokenService {

    RefreshToken createRefreshToken(Long userId);

    RefreshToken verifyExpiration(RefreshToken token);

    RefreshToken findByToken(String token);

    void revokeToken(String token);

    void revokeTokensByUserId(Long userId);
}

