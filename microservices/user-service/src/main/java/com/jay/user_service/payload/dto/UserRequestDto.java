package com.jay.user_service.payload.dto;

import com.jay.user_service.domain.UserRole;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class UserRequestDto {

    private String fullName;

    @NotBlank(message = "Email is mandatory")
    @Email(message = "Invalid email format")
    private String email;

    private String phone;

    @NotBlank(message = "username is mandatory")
    private String username;

    private UserRole role;

    // Optional for profile updates; account creation uses SignupDTO with full credential validation
    private String password;
}
