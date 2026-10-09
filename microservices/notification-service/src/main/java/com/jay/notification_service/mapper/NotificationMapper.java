package com.jay.notification_service.mapper;


import com.jay.notification_service.payload.dto.BookingDTO;
import com.jay.notification_service.model.Notification;
import com.jay.notification_service.payload.dto.NotificationDTO;

public class NotificationMapper {

    public static NotificationDTO toDTO(Notification notification, BookingDTO bookingDTO) {

        NotificationDTO dto = new NotificationDTO();
        dto.setId(notification.getId());
        dto.setType(notification.getType());
        dto.setDescription(notification.getDescription());
        dto.setIsRead(notification.getIsRead());
        dto.setUserId(notification.getUserId());
        dto.setBookingId(bookingDTO.getId());

        // CHANGED: The frontend notification card shows the booking status
        // and the start time, so the booking is now part of the response.
        dto.setBooking(bookingDTO);

        dto.setSalonId(notification.getSalonId());
        dto.setCreatedAt(notification.getCreatedAt());
        return dto;
    }
}
