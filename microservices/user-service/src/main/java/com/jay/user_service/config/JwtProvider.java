package com.jay.user_service.config;

import com.jay.user_service.model.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.List;

@Component
public class JwtProvider {

    private final SecretKey secretKey;

    public JwtProvider(@Value("${jwt.secret:" + JwtConstant.DEFAULT_SECRET_KEY + "}") String secret) {
        this.secretKey = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
    }

    public String generateToken(User user) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + JwtConstant.ACCESS_TOKEN_EXPIRATION_MS);

        String roleName = user.getRole() != null ? user.getRole().name() : "CUSTOMER";
        List<String> roles = List.of("ROLE_" + roleName);

        return Jwts.builder()
                .subject(user.getEmail())
                .issuer(JwtConstant.ISSUER)
                .issuedAt(now)
                .expiration(expiryDate)
                .claim("userId", user.getId())
                .claim("email", user.getEmail())
                .claim("username", user.getUsername())
                .claim("role", roleName)
                .claim("roles", roles)
                .signWith(secretKey, Jwts.SIG.HS256)
                .compact();
    }

    public Claims getClaimsFromJwt(String jwt) {
        if (jwt != null && jwt.startsWith("Bearer ")) {
            jwt = jwt.substring(7).trim();
        }
        return Jwts.parser()
                .verifyWith(secretKey)
                .requireIssuer(JwtConstant.ISSUER)
                .build()
                .parseSignedClaims(jwt)
                .getPayload();
    }

    public String getEmailFromJwt(String jwt) {
        return getClaimsFromJwt(jwt).getSubject();
    }

    public Long getUserIdFromJwt(String jwt) {
        Claims claims = getClaimsFromJwt(jwt);
        Object userIdObj = claims.get("userId");
        if (userIdObj instanceof Number number) {
            return number.longValue();
        } else if (userIdObj instanceof String str) {
            return Long.parseLong(str);
        }
        return null;
    }

    public String getRoleFromJwt(String jwt) {
        return (String) getClaimsFromJwt(jwt).get("role");
    }

    public boolean validateToken(String jwt) {
        try {
            getClaimsFromJwt(jwt);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }
}

