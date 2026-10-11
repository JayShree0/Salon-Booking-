package com.jay.notification_service.mapper;

import com.jay.notification_service.model.Notification;
import com.jay.notification_service.payload.dto.BookingDTO;
import com.jay.notification_service.payload.dto.NotificationDTO;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

class NotificationMapperTest {

    @Test
    void shouldFormatPaymentSuccessNotificationWithServiceName() {
        Notification notif = new Notification();
        notif.setId(1L);
        notif.setType("PAYMENT_SUCCESS");
        notif.setDescription("Payment of ₹349 for booking #28 was successful.");
        notif.setBookingId(28L);

        BookingDTO booking = new BookingDTO();
        booking.setId(28L);
        booking.setServiceName("Hair Cut");
        booking.setTotalPrice(349);

        NotificationDTO dto = NotificationMapper.toDTO(notif, booking);

        assertNotNull(dto);
        assertEquals("Hair Cut", dto.getServiceName());
        assertEquals("Payment of ₹349 for Hair Cut was successful.", dto.getDescription());
    }

    @Test
    void shouldFormatBookingConfirmationNotificationWithServiceName() {
        Notification notif = new Notification();
        notif.setId(2L);
        notif.setType("BOOKING_CONFIRMED");
        notif.setDescription("Your appointment #28 has been confirmed by The Grooming Co..");
        notif.setBookingId(28L);

        BookingDTO booking = new BookingDTO();
        booking.setId(28L);
        booking.setServiceName("Hair Cut");

        NotificationDTO dto = NotificationMapper.toDTO(notif, booking);

        assertEquals("Hair Cut", dto.getServiceName());
        assertEquals("Your Hair Cut appointment has been confirmed by The Grooming Co.", dto.getDescription());
    }

    @Test
    void shouldFormatBookingCreatedNotificationWithServiceName() {
        Notification notif = new Notification();
        notif.setId(3L);
        notif.setType("BOOKING_CREATED");
        notif.setDescription("Your booking request #28 at The Grooming Co. has been placed successfully.");
        notif.setBookingId(28L);

        BookingDTO booking = new BookingDTO();
        booking.setId(28L);
        booking.setServiceName("Hair Cut");

        NotificationDTO dto = NotificationMapper.toDTO(notif, booking);

        assertEquals("Your booking request for Hair Cut at The Grooming Co. has been placed successfully.", dto.getDescription());
    }

    @Test
    void shouldFormatRefundNotificationWithServiceName() {
        Notification notif = new Notification();
        notif.setId(4L);
        notif.setType("REFUND_INITIATED");
        notif.setDescription("Refund initiated for cancelled booking #26 (₹1499). The amount will be credited to your original payment method.");
        notif.setBookingId(26L);

        BookingDTO booking = new BookingDTO();
        booking.setId(26L);
        booking.setServiceName("Hair Cut, Facial Treatment");
        booking.setTotalPrice(1499);

        NotificationDTO dto = NotificationMapper.toDTO(notif, booking);

        assertEquals("Payment of ₹1499 for Hair Cut, Facial Treatment has been refunded.", dto.getDescription());
    }

    @Test
    void shouldFormatReminderNotificationWithServiceName() {
        Notification notif = new Notification();
        notif.setId(5L);
        notif.setType("APPOINTMENT_REMINDER");
        notif.setDescription("Reminder: Your upcoming appointment #27 at The Grooming Co. is scheduled for 2026-10-11T11:00.");
        notif.setBookingId(27L);

        BookingDTO booking = new BookingDTO();
        booking.setId(27L);
        booking.setServiceName("Classic Executive Haircut");

        NotificationDTO dto = NotificationMapper.toDTO(notif, booking);

        assertEquals("Reminder: Your upcoming Classic Executive Haircut appointment at The Grooming Co. is scheduled for 2026-10-11T11:00.", dto.getDescription());
    }

    @Test
    void shouldPreserveOriginalDescriptionWhenServiceNameIsMissing() {
        Notification notif = new Notification();
        notif.setId(6L);
        notif.setType("BOOKING_CREATED");
        notif.setDescription("Your booking request #99 has been placed.");

        NotificationDTO dto = NotificationMapper.toDTO(notif, null);

        assertEquals("Your booking request #99 has been placed.", dto.getDescription());
    }
}

