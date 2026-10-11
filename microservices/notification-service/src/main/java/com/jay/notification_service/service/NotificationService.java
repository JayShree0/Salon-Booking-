package com.jay.notification_service.service;

import com.jay.notification_service.model.Notification;
import com.jay.notification_service.payload.dto.NotificationDTO;

import java.util.List;

public interface NotificationService {

    NotificationDTO createNotification(Notification notification) throws Exception;
    List<NotificationDTO> getAllNotificationsByUserId(Long userId);
    List<NotificationDTO> getAllNotificationsBySalonId(Long salonId);
    NotificationDTO markNotificationAsRead(Long notificationId, Long authenticatedUserId) throws Exception;
    int markAllNotificationsAsRead(Long userId);
    long getUnreadCount(Long userId);
}
