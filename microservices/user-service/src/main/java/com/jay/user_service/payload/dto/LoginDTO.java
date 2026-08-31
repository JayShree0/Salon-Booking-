package com.jay.user_service.payload.dto;

import lombok.Data;

@Data
public class LoginDTO {
    private String email;
    private String password;
}
