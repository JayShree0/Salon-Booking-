package com.jay.gateway.server.config;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;

import java.time.Instant;
import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import static org.junit.jupiter.api.Assertions.*;

class JwtRoleConverterTest {

    private JwtRoleConverter converter;

    @BeforeEach
    void setUp() {
        converter = new JwtRoleConverter();
    }

    @Test
    void testConvertTopLevelRoleClaim() {
        Jwt jwt = new Jwt(
                "mock-token-value",
                Instant.now(),
                Instant.now().plusSeconds(3600),
                Map.of("alg", "HS256"),
                Map.of(
                        "sub", "test@example.com",
                        "role", "SALON_OWNER"
                )
        );

        Collection<GrantedAuthority> authorities = converter.convert(jwt);
        assertNotNull(authorities);
        Set<String> authNames = authorities.stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toSet());

        assertTrue(authNames.contains("ROLE_SALON_OWNER"));
    }

    @Test
    void testConvertTopLevelRolesListClaim() {
        Jwt jwt = new Jwt(
                "mock-token-value",
                Instant.now(),
                Instant.now().plusSeconds(3600),
                Map.of("alg", "HS256"),
                Map.of(
                        "sub", "test@example.com",
                        "roles", List.of("ROLE_ADMIN", "CUSTOMER")
                )
        );

        Collection<GrantedAuthority> authorities = converter.convert(jwt);
        assertNotNull(authorities);
        Set<String> authNames = authorities.stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toSet());

        assertTrue(authNames.contains("ROLE_ADMIN"));
        assertTrue(authNames.contains("ROLE_CUSTOMER"));
    }

    @Test
    void testNoDoublePrefixing() {
        Jwt jwt = new Jwt(
                "mock-token-value",
                Instant.now(),
                Instant.now().plusSeconds(3600),
                Map.of("alg", "HS256"),
                Map.of(
                        "sub", "test@example.com",
                        "role", "ROLE_CUSTOMER"
                )
        );

        Collection<GrantedAuthority> authorities = converter.convert(jwt);
        assertNotNull(authorities);
        Set<String> authNames = authorities.stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toSet());

        assertTrue(authNames.contains("ROLE_CUSTOMER"));
        assertFalse(authNames.contains("ROLE_ROLE_CUSTOMER"));
    }
}

