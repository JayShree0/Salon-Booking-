package com.jay.payment_service.service.impl;

import com.jay.payment_service.repository.PaymentOrderRepository;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

class PaymentServiceImplTest {

    @Test
    void shouldFailFastWhenRazorpayCredentialsAreMissing() {
        PaymentServiceImpl service = new PaymentServiceImpl(null, null, null, null, null, null);
        ReflectionTestUtils.setField(service, "razorpayApiKey", "");
        ReflectionTestUtils.setField(service, "razorpayApiSecret", "");

        IllegalStateException exception = assertThrows(
                IllegalStateException.class,
                service::validateRazorpayConfiguration
        );

        assertTrue(exception.getMessage().contains("RAZORPAY_KEY"));
    }

    @Test
    void shouldCreateCodOrderWithoutGatewayRedirect() throws Exception {
        PaymentOrderRepository repo = org.mockito.Mockito.mock(PaymentOrderRepository.class);
        org.mockito.Mockito.when(repo.save(org.mockito.Mockito.any())).thenAnswer(inv -> inv.getArgument(0));

        PaymentServiceImpl service = new PaymentServiceImpl(repo, null, null, null, null, null);

        com.jay.payment_service.dto.UserDTO user = new com.jay.payment_service.dto.UserDTO();
        user.setId(10L);

        com.jay.payment_service.dto.BookingDTO booking = new com.jay.payment_service.dto.BookingDTO();
        booking.setId(99L);
        booking.setSalonId(8L);
        booking.setTotalPrice(450);

        com.jay.payment_service.response.PaymentLinkResponse resp = service.createOrder(
                user,
                booking,
                com.jay.payment_service.domain.PaymentMethod.CASH_ON_DELIVERY
        );

        org.junit.jupiter.api.Assertions.assertNull(resp.getPayment_link_url());
        org.junit.jupiter.api.Assertions.assertEquals("COD-99", resp.getGetPayment_link_id());
    }

    @Test
    void shouldRecordCashPaymentOnlyForCodOrders() throws Exception {
        PaymentOrderRepository repo = org.mockito.Mockito.mock(PaymentOrderRepository.class);
        com.jay.payment_service.model.PaymentOrder codOrder = new com.jay.payment_service.model.PaymentOrder();
        codOrder.setId(1L);
        codOrder.setBookingId(99L);
        codOrder.setPaymentMethod(com.jay.payment_service.domain.PaymentMethod.CASH_ON_DELIVERY);
        codOrder.setStatus(com.jay.payment_service.domain.PaymentOrderStatus.PENDING);
        codOrder.setAmount(450L);

        com.jay.payment_service.model.PaymentOrder onlineOrder = new com.jay.payment_service.model.PaymentOrder();
        onlineOrder.setId(2L);
        onlineOrder.setBookingId(100L);
        onlineOrder.setPaymentMethod(com.jay.payment_service.domain.PaymentMethod.RAZORPAY);
        onlineOrder.setStatus(com.jay.payment_service.domain.PaymentOrderStatus.PENDING);

        org.mockito.Mockito.when(repo.findByBookingId(99L)).thenReturn(codOrder);
        org.mockito.Mockito.when(repo.findByBookingId(100L)).thenReturn(onlineOrder);
        org.mockito.Mockito.when(repo.save(org.mockito.Mockito.any())).thenAnswer(inv -> inv.getArgument(0));

        PaymentServiceImpl service = new PaymentServiceImpl(repo, null, null, null, null, null);

        Boolean codResult = service.recordCashPayment(99L);
        org.junit.jupiter.api.Assertions.assertTrue(codResult);
        org.junit.jupiter.api.Assertions.assertEquals(com.jay.payment_service.domain.PaymentOrderStatus.SUCCESS, codOrder.getStatus());

        Boolean onlineResult = service.recordCashPayment(100L);
        org.junit.jupiter.api.Assertions.assertFalse(onlineResult);
        org.junit.jupiter.api.Assertions.assertEquals(com.jay.payment_service.domain.PaymentOrderStatus.PENDING, onlineOrder.getStatus());
    }
}
