package com.jay.user_service.service.imp;

import com.jay.user_service.config.JwtProvider;
import com.jay.user_service.exception.ResourceAlreadyExistsException;
import com.jay.user_service.exception.UserNotFoundException;
import com.jay.user_service.model.User;
import com.jay.user_service.payload.dto.UserRequestDto;
import com.jay.user_service.payload.response.UserResponseDto;
import com.jay.user_service.repository.UserRepository;
import com.jay.user_service.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserServiceImp implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtProvider jwtProvider;

    @Override
    public UserResponseDto createUser(UserRequestDto requestDto) {

        validateUser(requestDto, null);

        User user = mapToEntity(requestDto);
        return mapToDto(userRepository.save(user));
    }

    @Override
    public UserResponseDto getUserById(Long id) {
        return mapToDto(getUser(id));
    }

    @Override
    public List<UserResponseDto> getAllUsers() {
        return userRepository.findAll().stream().map(this::mapToDto).toList();
    }

    @Override
    public UserResponseDto updateUser(Long id, UserRequestDto request) {

        User user = getUser(id);

        validateUser(request, user);

        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setPhone(request.getPhone());
        user.setUsername(request.getUsername());
        // A profile update must never grant or remove account authority.
        if (request.getPassword() != null && !request.getPassword().isBlank()) {
            user.setPassword(passwordEncoder.encode(request.getPassword()));
        }

        return mapToDto(userRepository.save(user));
    }

    public boolean isCurrentUser(Long id) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) return false;
        return userRepository.findById(id)
                .map(user -> user.getEmail().equalsIgnoreCase(authentication.getName()))
                .orElse(false);
    }

    @Override
    public void deleteUser(Long id) {
        userRepository.delete(getUser(id));
    }

    @Override
    public User getUserFromJwt(String jwt) throws Exception {
        if (jwt != null && jwt.startsWith("Bearer ")) {
            jwt = jwt.substring(7).trim();
        }
        String email = jwtProvider.getEmailFromJwt(jwt);
        User user = userRepository.findByEmail(email);
        if (user == null) {
            throw new UserNotFoundException("User not found with email: " + email);
        }
        return user;
    }

    private User getUser(Long id) {
        return userRepository.findById(id).orElseThrow(() -> new UserNotFoundException("User not found with id " + id));
    }

    private void validateUser(UserRequestDto requestDto, User existingUser) {

        // Email check
        if (existingUser == null || !existingUser.getEmail().equals(requestDto.getEmail())) {
            if (userRepository.existsByEmail(requestDto.getEmail())) {
                throw new ResourceAlreadyExistsException("Email already exists");
            }
        }

        // Username check
        if (existingUser == null || !existingUser.getUsername().equals(requestDto.getUsername())) {
            if (userRepository.existsByUsername(requestDto.getUsername())) {
                throw new ResourceAlreadyExistsException("Username already exists");
            }
        }

        // Phone check
        if (requestDto.getPhone() != null && (existingUser == null || !requestDto.getPhone().equals(existingUser.getPhone()))) {

            if (userRepository.existsByPhone(requestDto.getPhone())) {
                throw new ResourceAlreadyExistsException("Phone already exists");
            }
        }
    }

    private User mapToEntity(UserRequestDto requestDto) {
        User user = new User();

        user.setFullName(requestDto.getFullName());
        user.setEmail(requestDto.getEmail());
        user.setPhone(requestDto.getPhone());
        user.setUsername(requestDto.getUsername());
        user.setRole(requestDto.getRole());
        user.setPassword(passwordEncoder.encode(requestDto.getPassword()));

        return user;
    }

    private UserResponseDto mapToDto(User user) {
        UserResponseDto responseDto = new UserResponseDto();

        responseDto.setId(user.getId());
        responseDto.setFullName(user.getFullName());
        responseDto.setEmail(user.getEmail());
        responseDto.setPhone(user.getPhone());
        responseDto.setUsername(user.getUsername());
        responseDto.setRole(user.getRole());
        responseDto.setCreatedAt(user.getCreatedAt());
        responseDto.setUpdatedAt(user.getUpdatedAt());

        return responseDto;
    }
}
