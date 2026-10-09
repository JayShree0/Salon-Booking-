package com.jay.notification_service.service.client;

import com.jay.notification_service.payload.dto.UserDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;

@FeignClient(name = "USER-SERVICE")
public interface UserFeignClient {

    @GetMapping("/api/users/profile")
    ResponseEntity<UserDTO> getUserProfile(@RequestHeader("Authorization") String jwt);
}

