package com.jay.user_service.service.imp;

import com.jay.user_service.dto.UserRequestDto;
import com.jay.user_service.dto.UserResponseDto;
import com.jay.user_service.exception.ResourceAlreadyExistsException;
import com.jay.user_service.exception.UserNotFoundException;
import com.jay.user_service.model.User;
import com.jay.user_service.repository.UserRepository;
import com.jay.user_service.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserServiceImp implements UserService {

    private final UserRepository userRepository;

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
        return userRepository.findAll()
                .stream()
                .map(this::mapToDto)
                .toList();
    }

    @Override
    public UserResponseDto updateUser(Long id, UserRequestDto request) {

        User user = getUser(id);

        validateUser(request, user);

        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setPhone(request.getPhone());
        user.setUsername(request.getUsername());
        user.setRole(request.getRole());

        return mapToDto(userRepository.save(user));
    }

    @Override
    public void deleteUser(Long id) {
        userRepository.delete(getUser(id));
    }

    private User getUser(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() ->
                        new UserNotFoundException("User not found with id " + id)
                );
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
        if (requestDto.getPhone() != null &&
                (existingUser == null || !requestDto.getPhone().equals(existingUser.getPhone()))) {

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
        user.setPassword(requestDto.getPassword());

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