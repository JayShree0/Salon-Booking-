package com.jay.booking_service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class NotificationDTO {

    private Long id;
    private String type;
    private String description;
    private Boolean isRead = false;
    private Long userId;
    private Long bookingId;
    private Long salonId;
    private LocalDateTime createdAt;
    private BookingDTO booking;
    private String serviceName;
}

