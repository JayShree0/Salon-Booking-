package com.jay.notification_service.controller;


import com.jay.notification_service.model.Notification;
import com.jay.notification_service.payload.dto.NotificationDTO;
import com.jay.notification_service.payload.dto.UserDTO;
import com.jay.notification_service.service.NotificationService;
import com.jay.notification_service.service.client.UserFeignClient;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.Collections;
import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/notifications")
public class NotificationController {

    private final NotificationService notificationService;
    private final UserFeignClient userFeignClient;

    // 1. Internal & Microservice notification creation (e.g., from booking or payment services)
    @PostMapping
    public ResponseEntity<NotificationDTO> createNotification(
            @RequestBody Notification notification
    ) throws Exception {
        return ResponseEntity.ok(notificationService.createNotification(notification));
    }

    // 2. Token-identified Customer Notifications
    @GetMapping({"", "/", "/customer"})
    public ResponseEntity<List<NotificationDTO>> getCustomerNotifications(
            @RequestHeader("Authorization") String jwt
    ) throws Exception {
        UserDTO user = userFeignClient.getUserProfile(jwt).getBody();
        if (user == null || user.getId() == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User authentication required.");
        }
        return ResponseEntity.ok(notificationService.getAllNotificationsByUserId(user.getId()));
    }

    // 3. User notifications with strict ownership verification
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<NotificationDTO>> getNotificationsByUserId(
            @PathVariable Long userId,
            @RequestHeader(value = "Authorization", required = false) String jwt
    ) throws Exception {
        if (jwt != null && !jwt.isBlank()) {
            UserDTO user = userFeignClient.getUserProfile(jwt).getBody();
            if (user != null && user.getId() != null) {
                if (!userId.equals(user.getId()) && !"ADMIN".equalsIgnoreCase(user.getRole())) {
                    throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access denied to other user's notifications.");
                }
            }
        }
        return ResponseEntity.ok(notificationService.getAllNotificationsByUserId(userId));
    }

    // 4. Mark single notification as read with ownership verification
    @PutMapping("/{notificationId}/read")
    public ResponseEntity<NotificationDTO> markNotificationAsRead(
            @PathVariable Long notificationId,
            @RequestHeader(value = "Authorization", required = false) String jwt
    ) throws Exception {
        Long authenticatedUserId = null;
        if (jwt != null && !jwt.isBlank()) {
            UserDTO user = userFeignClient.getUserProfile(jwt).getBody();
            if (user != null) {
                authenticatedUserId = user.getId();
            }
        }
        return ResponseEntity.ok(notificationService.markNotificationAsRead(notificationId, authenticatedUserId));
    }

    // 5. Mark all notifications as read for currently authenticated customer
    @PutMapping("/read-all")
    public ResponseEntity<Map<String, Object>> markAllAsRead(
            @RequestHeader("Authorization") String jwt
    ) throws Exception {
        UserDTO user = userFeignClient.getUserProfile(jwt).getBody();
        if (user == null || user.getId() == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User authentication required.");
        }
        int updatedCount = notificationService.markAllNotificationsAsRead(user.getId());
        return ResponseEntity.ok(Map.of(
                "success", true,
                "markedCount", updatedCount
        ));
    }

    // 6. Fast unread notification count for currently authenticated user
    @GetMapping("/unread-count")
    public ResponseEntity<Long> getUnreadCount(
            @RequestHeader("Authorization") String jwt
    ) throws Exception {
        UserDTO user = userFeignClient.getUserProfile(jwt).getBody();
        if (user == null || user.getId() == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User authentication required.");
        }
        return ResponseEntity.ok(notificationService.getUnreadCount(user.getId()));
    }
}
