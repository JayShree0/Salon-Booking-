package com.jay.notification_service.controller;


import com.jay.notification_service.mapper.NotificationMapper;
import com.jay.notification_service.model.Notification;
import com.jay.notification_service.payload.dto.BookingDTO;
import com.jay.notification_service.payload.dto.NotificationDTO;
import com.jay.notification_service.payload.dto.UserDTO;
import com.jay.notification_service.service.NotificationService;
import com.jay.notification_service.service.client.BookingFeignClient;
import com.jay.notification_service.service.client.UserFeignClient;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/notifications")
public class NotificationController {

    public final NotificationService notificationService;
    public final BookingFeignClient bookingFeignClient;
    public final UserFeignClient userFeignClient;

    @PostMapping
    public ResponseEntity<NotificationDTO> createNotification(
            @RequestBody Notification notification
            ) throws Exception {
        return ResponseEntity.ok(notificationService.createNotification(notification));

    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<NotificationDTO>> getNotificationsByUserId(
            @PathVariable Long userId) {
        List<Notification> notifications = notificationService.getAllNotificationsByUserId(userId);

        List<NotificationDTO> notificationDTOS = notifications.stream()
                .map(notification -> {
                    BookingDTO bookingDTO = null;
                    try {
                        bookingDTO = bookingFeignClient.getBookingsById(
                                notification.getBookingId()).getBody();
                    } catch (Exception e) {
                        throw new RuntimeException(e);
                    }
                    return NotificationMapper.toDTO(notification, bookingDTO);
                }).collect(Collectors.toList());

        return ResponseEntity.ok(notificationDTOS);
    }

    @PutMapping("/{notificationId}/read")
    public ResponseEntity<NotificationDTO> markNotificationAsRead(
            @PathVariable Long notificationId
    ) throws Exception {
        Notification notification1 = notificationService.markNotificationAsRead(notificationId);

        BookingDTO bookingDTO = bookingFeignClient.getBookingsById(
                notification1.getBookingId()).getBody();
        return ResponseEntity.ok(NotificationMapper.toDTO(notification1, bookingDTO));

    }

    @GetMapping("/unread-count")
    public ResponseEntity<Long> getUnreadCount(
            @RequestHeader("Authorization") String jwt) throws Exception {
        UserDTO user = userFeignClient.getUserProfile(jwt).getBody();
        if (user == null) {
            throw new Exception("User not found from jwt");
        }
        long count = notificationService.getAllNotificationsByUserId(user.getId())
                .stream()
                .filter(n -> Boolean.FALSE.equals(n.getIsRead()))
                .count();
        return ResponseEntity.ok(count);
    }




}
