package com.jay.notification_service.service.impl;

import com.jay.notification_service.payload.dto.BookingDTO;
import com.jay.notification_service.mapper.NotificationMapper;
import com.jay.notification_service.model.Notification;
import com.jay.notification_service.payload.dto.NotificationDTO;
import com.jay.notification_service.repository.NotificationRepository;
import com.jay.notification_service.service.NotificationService;
import com.jay.notification_service.service.client.BookingFeignClient;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepository;
    private final BookingFeignClient bookingFeignClient;

    @Override
    public NotificationDTO createNotification(Notification notification) throws Exception {
        Notification savedNotification = notificationRepository.save(notification);

        System.out.println(">>>>> Booking ID received from request: " + savedNotification.getBookingId());

        BookingDTO bookingDTO = bookingFeignClient.getBookingsById(
                savedNotification.getBookingId())
                .getBody();

        NotificationDTO notificationDTO = NotificationMapper.toDTO(
                savedNotification,
                bookingDTO);


        // when we integrate websocket we can send the notification to the user in real time using web socket
        return notificationDTO;
    }

    @Override
    public List<Notification> getAllNotificationsByUserId(Long userId) {
        return notificationRepository.findByUserId(userId);
    }

    @Override
    public List<Notification> getAllNotificationsBySalonId(Long salonId) {
        return notificationRepository.findBySalonId(salonId);

    }

    @Override
    public Notification markNotificationAsRead(Long notificationId) throws Exception {

        return notificationRepository.findById(notificationId).map(
                notification -> {
                    notification.setIsRead(true);
                    return notificationRepository.save(notification);
                }
        ).orElseThrow(() -> new Exception("Notification not found"));
    }
}
