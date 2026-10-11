package com.jay.booking_service.dto;

import com.jay.booking_service.domain.BookingStatus;
import com.jay.booking_service.domain.PaymentMethod;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.Set;

@Data
public class BookingDTO {

    private Long id;
    private Long salonId;
    private Long customerId;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private Set<Long> serviceIds;
    private BookingStatus status = BookingStatus.PENDING;
    private int totalPrice;
    private String serviceName;
    private PaymentMethod paymentMethod;
    private String salonName;
    private String salonAddress;
    private String customerName;
    private String customerEmail;
    private String customerPhone;
    private java.time.LocalDate bookingDate;
}
