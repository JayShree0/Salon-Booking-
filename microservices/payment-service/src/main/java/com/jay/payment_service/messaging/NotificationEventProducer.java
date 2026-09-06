package com.jay.payment_service.messaging;

import com.jay.payment_service.dto.NotificationDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class NotificationEventProducer {

    private final RabbitTemplate  rabbitTemplate;

    public void sentNotification(Long bookingId,
                                 Long userId,
                                 Long salonId) {

        NotificationDTO notificationDTO = new NotificationDTO();
        notificationDTO.setBookingId(bookingId);
        notificationDTO.setUserId(userId);
        notificationDTO.setSalonId(salonId);
        notificationDTO.setDescription("New booking created with ID: " + bookingId);
        notificationDTO.setType("BOOKING");

        rabbitTemplate.convertAndSend("notification-queue", notificationDTO);
    }
}
