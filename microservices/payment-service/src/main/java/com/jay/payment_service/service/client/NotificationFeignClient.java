package com.jay.payment_service.service.client;

import com.jay.payment_service.dto.NotificationDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(name = "NOTIFICATION-SERVICE")
public interface NotificationFeignClient {

    @PostMapping("/api/notifications")
    ResponseEntity<NotificationDTO> createNotification(@RequestBody NotificationDTO notification);
}

