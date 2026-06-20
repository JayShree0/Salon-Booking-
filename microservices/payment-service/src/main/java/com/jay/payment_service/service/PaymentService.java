package com.jay.payment_service.service;

import com.jay.payment_service.domain.PaymentMethod;
import com.jay.payment_service.dto.BookingDTO;
import com.jay.payment_service.dto.UserDTO;
import com.jay.payment_service.model.PaymentOrder;
import com.jay.payment_service.response.PaymentLinkResponse;
import com.razorpay.PaymentLink;
import com.stripe.exception.StripeException;

public interface PaymentService {

    PaymentLinkResponse createOrder(UserDTO user,
                                    BookingDTO booking,
                                    PaymentMethod paymentMethod) throws Exception;

    PaymentOrder getPaymentOrderById(Long id) throws Exception;

    PaymentOrder getPaymentOrderByPaymentId(String paymentId);

    PaymentLink createRazorpayPaymentLink(UserDTO user,
                                          Long amount,
                                          Long orderId) throws Exception;

    String createStripePaymentLink(UserDTO user,
                                   Long amount,
                                   Long orderId) throws StripeException;


    Boolean processPayment(PaymentOrder paymentOrder, String paymentId, String paymentLinkId) throws Exception;
}
