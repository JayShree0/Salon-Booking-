package com.jay.payment_service.service.client;

import com.jay.payment_service.dto.BookingDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(name = "BOOKING-SERVICE")
public interface BookingFeignClient {

    @PutMapping("/api/bookings/{bookingId}/status")
    ResponseEntity<BookingDTO> updateBookingStatus(
            @PathVariable("bookingId") Long bookingId,
            @RequestParam("status") String status
    );

    @org.springframework.web.bind.annotation.GetMapping("/api/bookings/{bookingId}")
    ResponseEntity<BookingDTO> getBookingById(
            @PathVariable("bookingId") Long bookingId
    );
}

