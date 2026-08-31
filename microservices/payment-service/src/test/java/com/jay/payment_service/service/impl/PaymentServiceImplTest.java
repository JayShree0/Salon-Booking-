package com.jay.payment_service.service.impl;

import com.jay.payment_service.repository.PaymentOrderRepository;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

class PaymentServiceImplTest {

    @Test
    void shouldFailFastWhenRazorpayCredentialsAreMissing() {
        PaymentServiceImpl service = new PaymentServiceImpl(null);
        ReflectionTestUtils.setField(service, "razorpayApiKey", "");
        ReflectionTestUtils.setField(service, "razorpayApiSecret", "");

        IllegalStateException exception = assertThrows(
                IllegalStateException.class,
                service::validateRazorpayConfiguration
        );

        assertTrue(exception.getMessage().contains("RAZORPAY_KEY"));
    }
}
