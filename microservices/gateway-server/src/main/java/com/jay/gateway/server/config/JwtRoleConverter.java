package com.jay.gateway.server.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.convert.converter.Converter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;

import java.util.*;

public class JwtRoleConverter implements Converter<Jwt, Collection<GrantedAuthority>> {
    private static final Logger log = LoggerFactory.getLogger(JwtRoleConverter.class);

    @Override
    public Collection<GrantedAuthority> convert(Jwt jwt) {
        Set<GrantedAuthority> authorities = new HashSet<>();
        log.debug("Converting JWT claims for subject: {}", jwt.getSubject());

        // 1. Extract from top-level "role" claim (e.g., "CUSTOMER", "SALON_OWNER", "ADMIN")
        Object customRole = jwt.getClaims().get("role");
        if (customRole instanceof String roleStr) {
            addAuthority(authorities, roleStr);
        } else if (customRole instanceof Collection<?> roles) {
            roles.stream()
                    .filter(Objects::nonNull)
                    .map(String::valueOf)
                    .forEach(r -> addAuthority(authorities, r));
        }

        // 2. Extract from top-level "roles" claim (e.g., ["ROLE_CUSTOMER"])
        Object customRoles = jwt.getClaims().get("roles");
        if (customRoles instanceof Collection<?> rolesList) {
            rolesList.stream()
                    .filter(Objects::nonNull)
                    .map(String::valueOf)
                    .forEach(r -> addAuthority(authorities, r));
        }

        log.debug("Total authorities granted for subject {}: {}", jwt.getSubject(), authorities.size());
        return authorities;
    }

    private void addAuthority(Set<GrantedAuthority> authorities, String role) {
        if (role == null || role.isBlank()) return;
        String cleanRole = role.trim().toUpperCase();
        // Prevent double prefixing (e.g., avoid ROLE_ROLE_CUSTOMER)
        String authority = cleanRole.startsWith("ROLE_") ? cleanRole : "ROLE_" + cleanRole;
        authorities.add(new SimpleGrantedAuthority(authority));
    }
}

