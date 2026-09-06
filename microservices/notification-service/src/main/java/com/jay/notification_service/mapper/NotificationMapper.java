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
        dto.setSalonId(notification.getSalonId());
        dto.setCreatedAt(notification.getCreatedAt());
        return dto;
    }
}
