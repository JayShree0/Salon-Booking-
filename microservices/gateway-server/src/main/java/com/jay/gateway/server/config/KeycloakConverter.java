package com.jay.gateway.server.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.convert.converter.Converter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;

import java.util.*;

public class KeycloakConverter implements Converter<Jwt, Collection<GrantedAuthority>> {
    private static final Logger log = LoggerFactory.getLogger(KeycloakConverter.class);

    @Override
    public Collection<GrantedAuthority> convert(Jwt jwt) {
        Set<GrantedAuthority> authorities = new HashSet<>();
        log.info("Converting JWT claims for subject: {}", jwt.getSubject());

        // 1. Extract from standard Keycloak realm_access.roles
        Map<String, Object> realmAccess = jwt.getClaimAsMap("realm_access");
        if (realmAccess != null) {
            Object realmRoles = realmAccess.get("roles");
            if (realmRoles instanceof Collection<?> roles) {
                roles.stream()
                        .filter(Objects::nonNull)
                        .map(String::valueOf)
                        .forEach(role -> addAuthority(authorities, role, "realm"));
            }
        }

        // 2. Extract from standard Keycloak resource_access.<client>.roles
        Map<String, Object> resourceAccess = jwt.getClaimAsMap("resource_access");
        if (resourceAccess != null) {
            for (Object clientDetails : resourceAccess.values()) {
                if (!(clientDetails instanceof Map<?, ?> clientRolesMap)) {
                    continue;
                }

                Object roles = clientRolesMap.get("roles");
                if (roles instanceof Collection<?> roleList) {
                    roleList.stream()
                            .filter(Objects::nonNull)
                            .map(String::valueOf)
                            .forEach(role -> addAuthority(authorities, role, "client"));
                }
            }
        }

        // 3. Extract from custom top-level "role" claim (handles {"role": "CUSTOMER"})
        Object customRole = jwt.getClaims().get("role");
        if (customRole instanceof String roleStr) {
            addAuthority(authorities, roleStr, "custom-claim");
        } else if (customRole instanceof Collection<?> roles) {
            roles.stream()
                    .filter(Objects::nonNull)
                    .map(String::valueOf)
                    .forEach(role -> addAuthority(authorities, role, "custom-claim-list"));
        }

        // 4. Extract from custom top-level "roles" array if present
        Object customRoles = jwt.getClaims().get("roles");
        if (customRoles instanceof Collection<?> rolesList) {
            rolesList.stream()
                    .filter(Objects::nonNull)
                    .map(String::valueOf)
                    .forEach(role -> addAuthority(authorities, role, "custom-roles-array"));
        }

        log.info("Total authorities granted for subject {}: {}", jwt.getSubject(), authorities.size());
        authorities.forEach(a -> log.info("  - {}", a.getAuthority()));

        return authorities;
    }

    private void addAuthority(Set<GrantedAuthority> authorities, String role, String source) {
        String cleanRole = role.trim().toUpperCase();
        // Prevent double prefixing (e.g., avoid ROLE_ROLE_CUSTOMER)
        String authority = cleanRole.startsWith("ROLE_") ? cleanRole : "ROLE_" + cleanRole;
        log.info("Adding authority [{}] from source [{}]", authority, source);
        authorities.add(new SimpleGrantedAuthority(authority));
    }
}



//package com.jay.gateway.server.config;
//
//import org.springframework.core.convert.converter.Converter;
//import org.springframework.security.core.GrantedAuthority;
//import org.springframework.security.core.authority.SimpleGrantedAuthority;
//import org.springframework.security.oauth2.jwt.Jwt;
//import org.slf4j.Logger;
//import org.slf4j.LoggerFactory;
//
//import java.util.ArrayList;
//import java.util.Collection;
//import java.util.List;
//import java.util.Map;
//
//public class KeycloakConverter implements Converter<Jwt, Collection<GrantedAuthority>> {
//    private static final Logger log = LoggerFactory.getLogger(KeycloakConverter.class);
//
//    @Override
//    public Collection<GrantedAuthority> convert(Jwt jwt) {
//        Collection<GrantedAuthority> authorities = new ArrayList<>();
//        log.info("Converting JWT claims for subject: {}", jwt.getSubject());
//
//        Map<String, Object> realmAccess = jwt.getClaimAsMap("realm_access");
//        if (realmAccess != null) {
//            Object realmRoles = realmAccess.get("roles");
//            if (realmRoles instanceof Collection<?> roles) {
//                roles.stream()
//                        .filter(java.util.Objects::nonNull)
//                        .map(String::valueOf)
//                        .forEach(role -> {
//                            String authority = "ROLE_" + role.toUpperCase();
//                            log.info("Adding realm role authority: {}", authority);
//                            authorities.add(new SimpleGrantedAuthority(authority));
//                        });
//            }
//        }
//
//        Map<String, Object> resourceAccess = jwt.getClaimAsMap("resource_access");
//        if (resourceAccess != null) {
//            log.info("Found resource_access claims: {}", resourceAccess.keySet());
//            for (Object clientDetails : resourceAccess.values()) {
//                if (!(clientDetails instanceof Map<?, ?> clientRolesMap)) {
//                    continue;
//                }
//
//                Object roles = clientRolesMap.get("roles");
//                if (!(roles instanceof Collection<?> roleList)) {
//                    continue;
//                }
//
//                roleList.stream()
//                        .filter(java.util.Objects::nonNull)
//                        .map(String::valueOf)
//                        .forEach(role -> {
//                            String authority = "ROLE_" + role.toUpperCase();
//                            log.info("Adding client role authority: {}", authority);
//                            authorities.add(new SimpleGrantedAuthority(authority));
//                        });
//            }
//        }
//
//        log.info("Total authorities granted: {}", authorities.size());
//        authorities.forEach(a -> log.info("  - {}", a.getAuthority()));
//        return authorities;
//    }
//}
