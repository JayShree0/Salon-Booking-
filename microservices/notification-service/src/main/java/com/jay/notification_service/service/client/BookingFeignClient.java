package com.jay.notification_service.service.client;

import com.jay.notification_service.payload.dto.BookingDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "BOOKING-SERVICE")
public interface BookingFeignClient {

    @GetMapping("/api/bookings/{bookingId}")
    ResponseEntity<BookingDTO> getBookingsById(
            @PathVariable("bookingId") Long bookingId);
}