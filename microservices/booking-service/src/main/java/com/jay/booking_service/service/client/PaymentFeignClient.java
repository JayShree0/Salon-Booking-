package com.jay.booking_service.service.client;

import com.jay.booking_service.domain.PaymentMethod;
import com.jay.booking_service.dto.BookingDTO;
import com.jay.booking_service.dto.PaymentLinkResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient("PAYMENT-SERVICE")
public interface PaymentFeignClient {

    @PostMapping("/api/payments/create")
    public ResponseEntity<PaymentLinkResponse> createPaymentLink(
            @RequestBody BookingDTO booking,
            @RequestParam PaymentMethod paymentMethod,
            @RequestHeader("Authorization") String jwt
    ) throws Exception;

    @org.springframework.web.bind.annotation.PatchMapping("/api/payments/cash/complete/{bookingId}")
    public ResponseEntity<Boolean> completeCashPayment(
            @org.springframework.web.bind.annotation.PathVariable("bookingId") Long bookingId
    );
}
