package com.jay.notification_service.mapper;

import com.jay.notification_service.payload.dto.BookingDTO;
import com.jay.notification_service.model.Notification;
import com.jay.notification_service.payload.dto.NotificationDTO;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class NotificationMapper {

    private static final Pattern AMOUNT_PATTERN = Pattern.compile("₹\\s*(\\d+)");

    public static NotificationDTO toDTO(Notification notification, BookingDTO bookingDTO) {

        NotificationDTO dto = new NotificationDTO();
        dto.setId(notification.getId());
        dto.setType(notification.getType());
        dto.setIsRead(notification.getIsRead());
        dto.setUserId(notification.getUserId());
        dto.setBookingId(bookingDTO != null ? bookingDTO.getId() : notification.getBookingId());
        dto.setBooking(bookingDTO);
        dto.setSalonId(notification.getSalonId());
        dto.setCreatedAt(notification.getCreatedAt());

        String serviceName = bookingDTO != null && bookingDTO.getServiceName() != null && !bookingDTO.getServiceName().isBlank()
                ? bookingDTO.getServiceName()
                : null;
        dto.setServiceName(serviceName);

        String description = notification.getDescription();
        if (serviceName != null && description != null) {
            description = formatServiceDescription(description, notification.getType(), serviceName, bookingDTO);
        }
        dto.setDescription(description);

        return dto;
    }

    public static String formatServiceDescription(String desc, String type, String serviceName, BookingDTO booking) {
        if (desc == null || serviceName == null || serviceName.isBlank()) {
            return desc;
        }

        // If the description does not mention an internal ID or booking number, return as is
        if (!desc.contains("#") && !desc.toLowerCase().contains("with id:") && !desc.toLowerCase().contains("booking id")) {
            return desc;
        }

        String normalizedType = type != null ? type.toUpperCase() : "";

        // Extract amount if present in desc or booking
        String amount = null;
        Matcher m = AMOUNT_PATTERN.matcher(desc);
        if (m.find()) {
            amount = m.group(1);
        } else if (booking != null && booking.getTotalPrice() > 0) {
            amount = String.valueOf(booking.getTotalPrice());
        }

        // 1. Refunds
        if (normalizedType.contains("REFUND")) {
            if (amount != null) {
                return "Payment of ₹" + amount + " for " + serviceName + " has been refunded.";
            }
            return "Payment for " + serviceName + " has been refunded.";
        }

        // 2. Payment Failure
        if (normalizedType.equals("PAYMENT_FAILED") || desc.toLowerCase().contains("unsuccessful") || desc.toLowerCase().contains("payment failed")) {
            if (amount != null) {
                return "Payment of ₹" + amount + " for " + serviceName + " failed. Please retry payment.";
            }
            return "Payment for " + serviceName + " failed. Please retry payment.";
        }

        // 3. Payment Success
        if (normalizedType.equals("PAYMENT_SUCCESS")) {
            if (amount != null) {
                return "Payment of ₹" + amount + " for " + serviceName + " was successful.";
            }
            return "Payment for " + serviceName + " was successful.";
        }

        // 4. Payment Pending
        if (normalizedType.equals("PAYMENT_PENDING")) {
            if (amount != null) {
                return "Payment of ₹" + amount + " for " + serviceName + " is pending.";
            }
            return "Payment for " + serviceName + " is pending.";
        }

        // 5. Replace structured booking patterns
        String formatted = desc;
        formatted = formatted.replaceAll("(?i)for booking #\\d+", "for " + serviceName);
        formatted = formatted.replaceAll("(?i)booking request #\\d+", "booking request for " + serviceName);
        formatted = formatted.replaceAll("(?i)upcoming appointment #\\d+", "upcoming " + serviceName + " appointment");
        formatted = formatted.replaceAll("(?i)appointment #\\d+", serviceName + " appointment");
        formatted = formatted.replaceAll("(?i)booking #\\d+", serviceName);
        formatted = formatted.replaceAll("(?i)with ID: \\d+", "for " + serviceName);
        formatted = formatted.replaceAll("#\\d+", serviceName);

        // Clean up accidental duplicate periods e.g. ".."
        formatted = formatted.replaceAll("\\.{2,}", ".");

        return formatted;
    }
}
