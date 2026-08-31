package com.jay.user_service.service;

import com.jay.user_service.model.User;
import com.jay.user_service.payload.dto.UserRequestDto;
import com.jay.user_service.payload.response.UserResponseDto;

import java.util.List;

public interface UserService {

    UserResponseDto createUser(UserRequestDto requestDto);

    UserResponseDto getUserById(Long id);

    List<UserResponseDto> getAllUsers();

    UserResponseDto updateUser(Long id, UserRequestDto request);

    void deleteUser(Long id);

    User getUserFromJwt(String jwt) throws Exception;
}