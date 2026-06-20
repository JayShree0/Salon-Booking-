package com.jay.payment_service.controller;

import com.jay.payment_service.domain.PaymentMethod;
import com.jay.payment_service.dto.BookingDTO;
import com.jay.payment_service.dto.UserDTO;
import com.jay.payment_service.model.PaymentOrder;
import com.jay.payment_service.response.PaymentLinkResponse;
import com.jay.payment_service.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping("/create")
    public ResponseEntity<PaymentLinkResponse> createPaymentLink(
            @RequestBody BookingDTO booking,
            @RequestParam PaymentMethod paymentMethod
    ) throws Exception {
        UserDTO user = new UserDTO();
        user.setId(1L);
        user.setFullName("Jay");
        user.setEmail("jayshree980@gmail.com");

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
