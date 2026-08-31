package com.jay.user_service.payload.dto;

import lombok.Data;

@Data
public class Credential {

    private String type;
    private String value;
    private boolean temporary;
}
