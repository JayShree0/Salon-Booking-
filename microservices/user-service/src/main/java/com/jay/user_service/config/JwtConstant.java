package com.jay.user_service.config;

public class JwtConstant {

    public static final String DEFAULT_SECRET_KEY =
            "SalonBookingSecretKeyForJwtTokenSigningAndValidation2026WithMinimum256BitsLength";

    public static final String JWT_HEADER = "Authorization";

    public static final String ISSUER = "salon-booking-system";

    // 24 hours access token expiration
    public static final long ACCESS_TOKEN_EXPIRATION_MS = 24 * 60 * 60 * 1000L;

    // 7 days refresh token expiration
    public static final long REFRESH_TOKEN_EXPIRATION_MS = 7 * 24 * 60 * 60 * 1000L;
}

