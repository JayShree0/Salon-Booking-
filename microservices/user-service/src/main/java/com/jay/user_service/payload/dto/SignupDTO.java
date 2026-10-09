package com.jay.user_service.payload.dto;

import com.jay.user_service.domain.UserRole;
import lombok.Data;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

@Data
public class SignupDTO {

    @NotBlank
    private String fullName;
    @NotBlank
    @Email
    private String email;
    @NotBlank
    private String password;
    @NotBlank
    private String username;
    private UserRole role;

    
}
