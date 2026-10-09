package com.jay.user_service.service.imp;

import com.jay.user_service.config.JwtProvider;
import com.jay.user_service.domain.UserRole;
import com.jay.user_service.exception.ResourceAlreadyExistsException;
import com.jay.user_service.model.RefreshToken;
import com.jay.user_service.model.User;
import com.jay.user_service.payload.dto.SignupDTO;
import com.jay.user_service.payload.response.AuthResponse;
import com.jay.user_service.repository.UserRepository;
import com.jay.user_service.service.AuthService;
import com.jay.user_service.service.RefreshTokenService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtProvider jwtProvider;
    private final RefreshTokenService refreshTokenService;

    @Override
    @Transactional
    public AuthResponse login(String email, String password) throws Exception {
        User user = userRepository.findByEmail(email);
        if (user == null) {
            // Also allow username login fallback
            user = userRepository.findByUsername(email);
        }

        if (user == null) {
            throw new BadCredentialsException("Account not found for this email or username");
        }

        boolean matches = false;
        String storedPassword = user.getPassword();

        if (storedPassword != null) {
            // Check if password was already hashed with BCrypt
            if (storedPassword.startsWith("$2a$") || storedPassword.startsWith("$2b$") || storedPassword.startsWith("$2y$")) {
                matches = passwordEncoder.matches(password, storedPassword);
            } else if (password.equals(storedPassword)) {
                // Legacy plaintext password matched: seamlessly upgrade to BCrypt
                matches = true;
                user.setPassword(passwordEncoder.encode(password));
                userRepository.save(user);
            }
        }

        if (!matches) {
            throw new BadCredentialsException("Invalid password");
        }

        String jwt = jwtProvider.generateToken(user);
        RefreshToken refreshToken = refreshTokenService.createRefreshToken(user.getId());

        AuthResponse authResponse = new AuthResponse();
        authResponse.setJwt(jwt);
        authResponse.setRefresh_token(refreshToken.getToken());
        authResponse.setRole(user.getRole());
        authResponse.setMessage("Login success");

        return authResponse;
    }

    @Override
    @Transactional
    public AuthResponse signup(SignupDTO req) throws Exception {
        if (userRepository.existsByEmail(req.getEmail())) {
            throw new ResourceAlreadyExistsException("Email already exists: " + req.getEmail());
        }

        if (userRepository.existsByUsername(req.getUsername())) {
            throw new ResourceAlreadyExistsException("Username already exists: " + req.getUsername());
        }

        // Public registration is customer-only. Privileged roles require an
        // independently authorized workflow; accepting a request-body role is unsafe.
        if (req.getRole() != null && req.getRole() != UserRole.CUSTOMER) {
            throw new IllegalArgumentException("Only customer registration is available publicly");
        }

        User user = new User();
        user.setUsername(req.getUsername());
        user.setPassword(passwordEncoder.encode(req.getPassword()));
        user.setEmail(req.getEmail());
        user.setRole(UserRole.CUSTOMER);
        user.setFullName(req.getFullName());
        user.setCreatedAt(LocalDateTime.now());

        User savedUser = userRepository.save(user);

        String jwt = jwtProvider.generateToken(savedUser);
        RefreshToken refreshToken = refreshTokenService.createRefreshToken(savedUser.getId());

        AuthResponse authResponse = new AuthResponse();
        authResponse.setJwt(jwt);
        authResponse.setRefresh_token(refreshToken.getToken());
        authResponse.setRole(savedUser.getRole());
        authResponse.setMessage("Register success");

        return authResponse;
    }

    @Override
    @Transactional
    public AuthResponse getAccessTokenFromRefreshToken(String refreshTokenStr) throws Exception {
        if (refreshTokenStr == null || refreshTokenStr.isBlank()) {
            throw new BadCredentialsException("Refresh token is required");
        }

        RefreshToken refreshToken = refreshTokenService.findByToken(refreshTokenStr);
        refreshTokenService.verifyExpiration(refreshToken);

        User user = userRepository.findById(refreshToken.getUserId())
                .orElseThrow(() -> new BadCredentialsException("User not found for refresh token"));

        String newJwt = jwtProvider.generateToken(user);

        AuthResponse authResponse = new AuthResponse();
        authResponse.setJwt(newJwt);
        authResponse.setRefresh_token(refreshToken.getToken());
        authResponse.setRole(user.getRole());
        authResponse.setMessage("Access token success");

        return authResponse;
    }

    @Override
    public void logout(String refreshToken) {
        if (refreshToken != null && !refreshToken.isBlank()) {
            refreshTokenService.revokeToken(refreshToken);
        }
    }
}
