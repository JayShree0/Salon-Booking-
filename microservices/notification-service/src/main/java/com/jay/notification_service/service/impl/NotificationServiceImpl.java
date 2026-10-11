package com.jay.notification_service.service.impl;

import com.jay.notification_service.payload.dto.BookingDTO;
import com.jay.notification_service.mapper.NotificationMapper;
import com.jay.notification_service.model.Notification;
import com.jay.notification_service.payload.dto.NotificationDTO;
import com.jay.notification_service.repository.NotificationRepository;
import com.jay.notification_service.service.NotificationService;
import com.jay.notification_service.service.client.BookingFeignClient;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepository;
    private final BookingFeignClient bookingFeignClient;

    private NotificationDTO getNotificationDTO(Notification notification) {
        BookingDTO bookingDTO = null;
        if (notification.getBookingId() != null) {
            try {
                bookingDTO = bookingFeignClient.getBookingsById(notification.getBookingId()).getBody();
            } catch (Exception ignored) {
                // Booking-service might be restarting or booking id is unmapped; gracefully fallback
            }
        }
        return NotificationMapper.toDTO(notification, bookingDTO);
    }

    @Override
    public NotificationDTO createNotification(Notification notification) throws Exception {
        // Prevent duplicate notifications when events are retried
        if (notification.getUserId() != null && notification.getBookingId() != null && notification.getType() != null) {
            boolean exists = notificationRepository.existsByUserIdAndBookingIdAndType(
                    notification.getUserId(),
                    notification.getBookingId(),
                    notification.getType()
            );
            if (exists) {
                List<Notification> existing = notificationRepository.findByUserId(notification.getUserId());
                for (Notification n : existing) {
                    if (notification.getBookingId().equals(n.getBookingId()) && notification.getType().equals(n.getType())) {
                        return getNotificationDTO(n);
                    }
                }
            }
        }

        if (notification.getCreatedAt() == null) {
            notification.setCreatedAt(LocalDateTime.now());
        }
        if (notification.getIsRead() == null) {
            notification.setIsRead(false);
        }

        Notification savedNotification = notificationRepository.save(notification);
        return getNotificationDTO(savedNotification);
    }

    @Override
    public List<NotificationDTO> getAllNotificationsByUserId(Long userId) {
        List<Notification> notifications = notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);
        return notifications.stream()
                .map(this::getNotificationDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<NotificationDTO> getAllNotificationsBySalonId(Long salonId) {
        List<Notification> notifications = notificationRepository.findBySalonIdOrderByCreatedAtDesc(salonId);
        return notifications.stream()
                .map(this::getNotificationDTO)
                .collect(Collectors.toList());
    }

    @Override
    public NotificationDTO markNotificationAsRead(Long notificationId, Long authenticatedUserId) throws Exception {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Notification not found"));

        if (authenticatedUserId != null && notification.getUserId() != null) {
            if (!authenticatedUserId.equals(notification.getUserId())) {
                throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access denied to mark another user's notification as read.");
            }
        }

        notification.setIsRead(true);
        Notification saved = notificationRepository.save(notification);
        return getNotificationDTO(saved);
    }

    @Override
    public int markAllNotificationsAsRead(Long userId) {
        return notificationRepository.markAllAsReadByUserId(userId);
    }

    @Override
    public long getUnreadCount(Long userId) {
        return notificationRepository.countByUserIdAndIsReadFalse(userId);
    }
}
