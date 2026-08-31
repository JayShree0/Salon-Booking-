package com.jay.user_service.payload.dto;

import com.jay.user_service.domain.UserRole;
import lombok.Data;

@Data
public class SignupDTO {

    private String fullName;
    private String email;
    private String password;
    private String username;
    private UserRole role;

    
}
