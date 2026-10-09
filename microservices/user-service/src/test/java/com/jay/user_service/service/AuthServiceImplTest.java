package com.jay.user_service.service;

import com.jay.user_service.config.JwtConstant;
import com.jay.user_service.config.JwtProvider;
import com.jay.user_service.domain.UserRole;
import com.jay.user_service.exception.ResourceAlreadyExistsException;
import com.jay.user_service.model.RefreshToken;
import com.jay.user_service.model.User;
import com.jay.user_service.payload.dto.SignupDTO;
import com.jay.user_service.payload.response.AuthResponse;
import com.jay.user_service.repository.UserRepository;
import com.jay.user_service.service.imp.AuthServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.Instant;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceImplTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private RefreshTokenService refreshTokenService;

    private PasswordEncoder passwordEncoder;
    private JwtProvider jwtProvider;
    private AuthServiceImpl authService;

    @BeforeEach
    void setUp() {
        passwordEncoder = new BCryptPasswordEncoder();
        jwtProvider = new JwtProvider(JwtConstant.DEFAULT_SECRET_KEY);
        authService = new AuthServiceImpl(userRepository, passwordEncoder, jwtProvider, refreshTokenService);
    }

    @Test
    void testSignupSuccess() throws Exception {
        SignupDTO dto = new SignupDTO();
        dto.setEmail("newuser@gmail.com");
        dto.setUsername("newuser");
        dto.setPassword("Secret123!");
        dto.setFullName("New User");
        dto.setRole(UserRole.CUSTOMER);

        when(userRepository.existsByEmail("newuser@gmail.com")).thenReturn(false);
        when(userRepository.existsByUsername("newuser")).thenReturn(false);

        User savedUser = new User();
        savedUser.setId(10L);
        savedUser.setEmail(dto.getEmail());
        savedUser.setUsername(dto.getUsername());
        savedUser.setPassword(passwordEncoder.encode(dto.getPassword()));
        savedUser.setRole(UserRole.CUSTOMER);

        when(userRepository.save(any(User.class))).thenReturn(savedUser);

        RefreshToken refreshToken = new RefreshToken();
        refreshToken.setToken("mock-refresh-token");
        when(refreshTokenService.createRefreshToken(10L)).thenReturn(refreshToken);

        AuthResponse response = authService.signup(dto);

        assertNotNull(response);
        assertNotNull(response.getJwt());
        assertEquals("mock-refresh-token", response.getRefresh_token());
        assertEquals(UserRole.CUSTOMER, response.getRole());
        assertEquals("Register success", response.getMessage());

        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    void testSignupAdminRoleRejected() {
        SignupDTO dto = new SignupDTO();
        dto.setEmail("admin@hack.com");
        dto.setUsername("adminhack");
        dto.setPassword("Secret123!");
        dto.setRole(UserRole.ADMIN);

        assertThrows(IllegalArgumentException.class, () -> authService.signup(dto));
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void testSignupSalonOwnerRoleRejected() {
        SignupDTO dto = new SignupDTO();
        dto.setEmail("owner@new-salon.test");
        dto.setUsername("newowner");
        dto.setPassword("Secret123!");
        dto.setRole(UserRole.SALON_OWNER);

        assertThrows(IllegalArgumentException.class, () -> authService.signup(dto));
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void testSignupDuplicateEmailRejected() {
        SignupDTO dto = new SignupDTO();
        dto.setEmail("existing@gmail.com");
        dto.setUsername("newuser");
        dto.setPassword("Secret123!");

        when(userRepository.existsByEmail("existing@gmail.com")).thenReturn(true);

        assertThrows(ResourceAlreadyExistsException.class, () -> authService.signup(dto));
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void testLoginWithBcryptPasswordSuccess() throws Exception {
        User user = new User();
        user.setId(5L);
        user.setEmail("prem@gmail.com");
        user.setUsername("prem12");
        user.setPassword(passwordEncoder.encode("12345678"));
        user.setRole(UserRole.SALON_OWNER);

        when(userRepository.findByEmail("prem@gmail.com")).thenReturn(user);

        RefreshToken refreshToken = new RefreshToken();
        refreshToken.setToken("prem-refresh-token");
        when(refreshTokenService.createRefreshToken(5L)).thenReturn(refreshToken);

        AuthResponse response = authService.login("prem@gmail.com", "12345678");

        assertNotNull(response);
        assertNotNull(response.getJwt());
        assertEquals("prem-refresh-token", response.getRefresh_token());
        assertEquals(UserRole.SALON_OWNER, response.getRole());
    }

    @Test
    void testLoginAcceptsAndUpgradesLegacyPlaintextPassword() throws Exception {
        User user = new User();
        user.setId(5L);
        user.setEmail("prem@gmail.com");
        user.setUsername("prem12");
        user.setPassword("12345678"); // Legacy plaintext password
        user.setRole(UserRole.SALON_OWNER);

        when(userRepository.findByEmail("prem@gmail.com")).thenReturn(user);
        RefreshToken token = new RefreshToken();
        token.setToken("migrated-refresh-token");
        when(refreshTokenService.createRefreshToken(5L)).thenReturn(token);
        when(userRepository.save(any(User.class))).thenAnswer(inv -> inv.getArgument(0));

        AuthResponse res = authService.login("prem@gmail.com", "12345678");
        assertNotNull(res);
        assertNotNull(res.getJwt());
        assertEquals("migrated-refresh-token", res.getRefresh_token());
        assertEquals(UserRole.SALON_OWNER, res.getRole());
        assertTrue(passwordEncoder.matches("12345678", user.getPassword()));
        verify(userRepository).save(user);
    }

    @Test
    void testLoginInvalidPasswordThrowsException() {
        User user = new User();
        user.setId(5L);
        user.setEmail("prem@gmail.com");
        user.setPassword(passwordEncoder.encode("correctPassword"));

        when(userRepository.findByEmail("prem@gmail.com")).thenReturn(user);

        assertThrows(BadCredentialsException.class, () -> authService.login("prem@gmail.com", "wrongPassword"));
    }

    @Test
    void testLogoutRevokesToken() {
        authService.logout("test-refresh-token");
        verify(refreshTokenService, times(1)).revokeToken("test-refresh-token");
    }
}
