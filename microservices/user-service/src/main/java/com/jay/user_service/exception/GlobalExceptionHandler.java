package com.jay.user_service.exception;

import com.jay.user_service.payload.response.ErrorResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;

import java.time.LocalDateTime;
import java.util.List;

@ControllerAdvice
public class GlobalExceptionHandler {

    // COMMON METHOD
    private ResponseEntity<ErrorResponse> buildResponse(
            String message,
            List<String> errors,
            HttpStatus status,
            WebRequest request
    ) {
        ErrorResponse error = new ErrorResponse(
                message,
                errors,
                status.value(),
                status.getReasonPhrase(),
                LocalDateTime.now(),
                request.getDescription(false).replace("uri=", "")
        );

        return new ResponseEntity<>(error, status);
    }

    //  User Not Found
    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleUserNotFound(
            UserNotFoundException ex, WebRequest request) {

        return buildResponse(
                ex.getMessage(),
                List.of(ex.getMessage()),
                HttpStatus.NOT_FOUND,
                request
        );
    }

    //  Already Exists
    @ExceptionHandler(ResourceAlreadyExistsException.class)
    public ResponseEntity<ErrorResponse> handleExists(
            ResourceAlreadyExistsException ex, WebRequest request) {

        return buildResponse(
                ex.getMessage(),
                List.of(ex.getMessage()),
                HttpStatus.CONFLICT,
                request
        );
    }

    //  Validation Error
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidation(
            MethodArgumentNotValidException ex, WebRequest request) {

        List<String> errors = ex.getBindingResult()
                .getFieldErrors()
                .stream()
                .map(FieldError::getDefaultMessage)
                .toList();

        String message = errors.isEmpty() ? "Validation failed" : errors.get(0);

        return buildResponse(
                message,
                errors,
                HttpStatus.BAD_REQUEST,
                request
        );
    }

    //  Global Exception
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGlobal(
            Exception ex, WebRequest request) {

        return buildResponse(
                ex.getMessage(),
                List.of(ex.getMessage()),
                HttpStatus.INTERNAL_SERVER_ERROR,
                request
        );
    }
}