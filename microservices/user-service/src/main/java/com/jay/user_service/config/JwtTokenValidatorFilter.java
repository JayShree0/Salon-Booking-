package com.jay.user_service.config;

import io.jsonwebtoken.Claims;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Component
@RequiredArgsConstructor
public class JwtTokenValidatorFilter extends OncePerRequestFilter {

    private final JwtProvider jwtProvider;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        String jwt = request.getHeader(JwtConstant.JWT_HEADER);

        if (jwt != null && jwt.startsWith("Bearer ")) {
            jwt = jwt.substring(7).trim();

            try {
                if (jwtProvider.validateToken(jwt)) {
                    Claims claims = jwtProvider.getClaimsFromJwt(jwt);
                    String email = claims.getSubject();
                    String role = (String) claims.get("role");

                    List<GrantedAuthority> authorities = new ArrayList<>();
                    if (role != null) {
                        String cleanRole = role.toUpperCase().startsWith("ROLE_")
                                ? role.toUpperCase()
                                : "ROLE_" + role.toUpperCase();
                        authorities.add(new SimpleGrantedAuthority(cleanRole));
                    }

                    Authentication authentication =
                            new UsernamePasswordAuthenticationToken(email, null, authorities);

                    SecurityContextHolder.getContext().setAuthentication(authentication);
                }
            } catch (Exception ignored) {
                SecurityContextHolder.clearContext();
            }
        }

        filterChain.doFilter(request, response);
    }
}

