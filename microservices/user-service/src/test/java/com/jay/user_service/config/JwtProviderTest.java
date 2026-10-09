package com.jay.user_service.config;

import com.jay.user_service.domain.UserRole;
import com.jay.user_service.model.User;
import io.jsonwebtoken.Claims;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class JwtProviderTest {

    private JwtProvider jwtProvider;

    @BeforeEach
    void setUp() {
        jwtProvider = new JwtProvider(JwtConstant.DEFAULT_SECRET_KEY);
    }

    @Test
    void testGenerateTokenAndExtractClaims() {
        User user = new User();
        user.setId(5L);
        user.setEmail("prem@gmail.com");
        user.setUsername("prem12");
        user.setFullName("Prem Kumar");
        user.setRole(UserRole.SALON_OWNER);

        String token = jwtProvider.generateToken(user);
        assertNotNull(token);
        assertFalse(token.isBlank());

        // Validate token
        assertTrue(jwtProvider.validateToken(token));

        // Validate claims
        assertEquals("prem@gmail.com", jwtProvider.getEmailFromJwt(token));
        assertEquals(5L, jwtProvider.getUserIdFromJwt(token));
        assertEquals("SALON_OWNER", jwtProvider.getRoleFromJwt(token));

        Claims claims = jwtProvider.getClaimsFromJwt(token);
        assertEquals("prem12", claims.get("username"));
        assertEquals(JwtConstant.ISSUER, claims.getIssuer());
    }

    @Test
    void testBearerPrefixStripping() {
        User user = new User();
        user.setId(8L);
        user.setEmail("customer@test.com");
        user.setRole(UserRole.CUSTOMER);

        String rawToken = jwtProvider.generateToken(user);
        String bearerToken = "Bearer " + rawToken;

        assertTrue(jwtProvider.validateToken(bearerToken));
        assertEquals("customer@test.com", jwtProvider.getEmailFromJwt(bearerToken));
        assertEquals(8L, jwtProvider.getUserIdFromJwt(bearerToken));
        assertEquals("CUSTOMER", jwtProvider.getRoleFromJwt(bearerToken));
    }

    @Test
    void testInvalidTokenReturnsFalse() {
        assertFalse(jwtProvider.validateToken("invalid.jwt.token"));
        assertFalse(jwtProvider.validateToken(null));
        assertFalse(jwtProvider.validateToken(""));
    }
}

