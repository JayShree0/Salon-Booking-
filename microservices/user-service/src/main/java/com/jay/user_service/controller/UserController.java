package com.jay.user_service.controller;

import com.jay.user_service.model.User;
import com.jay.user_service.payload.dto.UserRequestDto;
import com.jay.user_service.payload.response.UserResponseDto;
import com.jay.user_service.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
//@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    //  Create User
    @PostMapping("/api/users")
    public ResponseEntity<UserResponseDto> createUser(
            @Valid @RequestBody UserRequestDto request) {

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(userService.createUser(request));
    }

    @GetMapping("/api/users/profile")
    public ResponseEntity<User> getUserProfile(
            @RequestHeader("Authorization") String jwt) throws Exception {

        User user = userService.getUserFromJwt(jwt);
        return ResponseEntity.ok(user);
    }

    //  Get All Users
    @GetMapping("/api/users")
    public ResponseEntity<List<UserResponseDto>> getUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    //  Get User By ID
    @GetMapping("/api/users/{userId}")
    public ResponseEntity<UserResponseDto> getUserById(@PathVariable("userId") Long id) {
        return ResponseEntity.ok(userService.getUserById(id));
    }

    //  Update User
    @PutMapping("/api/users/{id}")
    public ResponseEntity<UserResponseDto> updateUser(
            @Valid @RequestBody UserRequestDto request,
            @PathVariable Long id) {

        return ResponseEntity.ok(userService.updateUser(id, request));
    }

    //  Delete User
    @DeleteMapping("/api/users/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }
}