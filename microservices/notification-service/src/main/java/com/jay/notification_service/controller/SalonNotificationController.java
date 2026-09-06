package com.jay.notification_service.controller;

import com.jay.notification_service.mapper.NotificationMapper;
import com.jay.notification_service.model.Notification;
import com.jay.notification_service.payload.dto.BookingDTO;
import com.jay.notification_service.payload.dto.NotificationDTO;
import com.jay.notification_service.service.NotificationService;
import com.jay.notification_service.service.client.BookingFeignClient;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/notifications/salon-owner")
public class SalonNotificationController {

    public final NotificationService notificationService;
    public final BookingFeignClient bookingFeignClient;


    @GetMapping("/salon/{salonId}")
    public ResponseEntity<List<NotificationDTO>> getNotificationsBySalonId(
            @PathVariable Long salonId) {
        List<Notification> notifications = notificationService.getAllNotificationsBySalonId(salonId);

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
}
