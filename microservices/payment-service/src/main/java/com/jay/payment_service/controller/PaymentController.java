package com.jay.payment_service.controller;

import com.jay.payment_service.domain.PaymentMethod;
import com.jay.payment_service.dto.BookingDTO;
import com.jay.payment_service.dto.SalonDTO;
import com.jay.payment_service.dto.UserDTO;
import com.jay.payment_service.model.PaymentOrder;
import com.jay.payment_service.response.PaymentLinkResponse;
import com.jay.payment_service.service.PaymentService;
import com.jay.payment_service.service.client.UserFeignClient;
import com.jay.payment_service.service.client.SalonFeignClient;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;
    private final UserFeignClient userFeignClient;
    private final SalonFeignClient salonFeignClient;

    @PostMapping("/create")
    public ResponseEntity<PaymentLinkResponse> createPaymentLink(
            @RequestBody BookingDTO booking,
            @RequestParam PaymentMethod paymentMethod,
            @RequestHeader("Authorization") String jwt
    ) throws Exception {
        UserDTO user = userFeignClient.getUserProfile(jwt).getBody();
        if (user == null || user.getId() == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User authentication required.");
        }
        if (user.getRole() == null || !"CUSTOMER".equalsIgnoreCase(user.getRole())) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "Only customers are permitted to create payment orders for bookings."
            );
        }

        PaymentLinkResponse response = paymentService.createOrder(
                user,
                booking,
                paymentMethod
        );
        return ResponseEntity.ok(response);
    }


    @GetMapping("/{paymentOrderId}")
    public ResponseEntity<PaymentOrder> getPaymentOrderById(
            @PathVariable Long paymentOrderId
    ) throws Exception {

        PaymentOrder response = paymentService.getPaymentOrderById(paymentOrderId);
        return ResponseEntity.ok(response);
    }

    // ADDED: Return payment records only for the authenticated owner's salon.
    @GetMapping("/salon")
    public ResponseEntity<List<PaymentOrder>> getPaymentOrdersBySalon(
            @RequestHeader("Authorization") String jwt
    ) throws Exception {
        SalonDTO salon = salonFeignClient.getSalonByOwnerId(jwt).getBody();
        List<PaymentOrder> response = paymentService.getPaymentOrdersBySalonId(salon.getId());
        return ResponseEntity.ok(response);
    }


    @PatchMapping("/proceed")
    public ResponseEntity<Boolean> proceedPayment(
            @RequestParam String paymentId,
            @RequestParam String paymentLinkId
    ) throws Exception {

        PaymentOrder paymentOrder = paymentService.getPaymentOrderByPaymentId(paymentLinkId);
        Boolean response = paymentService.processPayment(paymentOrder, paymentId, paymentLinkId);
        return ResponseEntity.ok(response);
    }

}
