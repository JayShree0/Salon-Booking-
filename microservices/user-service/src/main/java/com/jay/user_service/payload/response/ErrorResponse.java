package com.jay.user_service.payload.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ErrorResponse {

    private String message;
    private List<String> errors;
    private int status;
    private String error;
    private LocalDateTime timeStamp;
    private String path;
}
