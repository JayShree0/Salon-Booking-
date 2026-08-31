package com.jay.user_service.payload.response;

import com.jay.user_service.domain.UserRole;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class UserResponseDto {

    private Long id;
    private String fullName;
    private String email;
    private String phone;
    private String username;
    private UserRole role;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
